import * as selector from './selector.js';
import { DomInfoCore } from './DomInfoCore.js';
import {
  /* startUp, reset */ setUpMessengerView,
  setUpChatBoxView,
} from './run.js';
import { isOfTheClasses } from './util.js';
import { parseParts } from './parse.js';

class DomInfo extends DomInfoCore {
  #mount = null;
  #accountControlsAndSettings = null;
  #chatBoxContainer = null;
  #chatBoxContainerContainer = null;
  // #moreActionsMenuContainer = null;
  #chatBoxToLabel = new Map();
  #labelToChatBoxObserver = new Map();
  // #editorContainers = [];
  // #editorContainerObservers = [];

  #accountControlsAndSettingsObserver = new MutationObserver((mutations) => {
    let messengerControlSeen = false;

    const respondToControlMutation = (nodes, respond) => {
      for (const node of nodes) {
        const messengerControl = node.querySelector(selector.messengerControl);
        if (messengerControl !== null) {
          this.disconnectObservers();
          respond(this);
          messengerControlSeen = true;
          break;
        }
      }
    };

    for (const mutation of mutations) {
      // respondToControlMutation(mutation.addedNodes, reset);
      // respondToControlMutation(mutation.removedNodes, startUp);
      respondToControlMutation(mutation.addedNodes, setUpChatBoxView);
      respondToControlMutation(mutation.removedNodes, setUpMessengerView);
      if (messengerControlSeen) {
        break;
      }
    }
  });

  #chatBoxContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      this.prepareChatBoxesForRendering(mutation);
    });
  });

  #chatBoxContainerContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      this.prepareChatBoxesForRendering(mutation, false);
    });
  });

  prepareChatBoxesForRendering(mutation, inChatBoxContainerObserver = true) {
    if (mutation.addedNodes.length > 0) {
      if (!inChatBoxContainerObserver) {
        this.setChatBoxContainer();
        this.observeChatBoxContainer();
      }

      if (this.#chatBoxContainer !== null || inChatBoxContainerObserver) {
        const waitForGridsToBeLabeled = () => {
          if (!this.messageGridsLabeled()) {
            setTimeout(waitForGridsToBeLabeled, 100);
          } else {
            const max = inChatBoxContainerObserver
              ? mutation.addedNodes.length
              : this.#chatBoxContainer.children.length;
            for (let i = 0; i < max; i++) {
              const chatBox = this.#chatBoxContainer.children[i];
              if (!chatBox.firstChild.firstChild.hasAttribute('hidden')) {
                this.setMessageGrid(chatBox);
                if (!this.#chatBoxToLabel.has(chatBox)) {
                  this.markMostRecentMessage(chatBox);

                  const labeledMessageGrid = chatBox.querySelector(
                    selector.labeledMessageGrid
                  );
                  const messageGridLabel =
                    labeledMessageGrid.getAttribute('aria-label');

                  this.#chatBoxToLabel.set(chatBox, messageGridLabel);

                  if (this.#labelToChatBoxObserver.has(messageGridLabel)) {
                    this.#labelToChatBoxObserver
                      .get(messageGridLabel)
                      .disconnect();
                  }

                  if (this.getLabelToBubbleObserver().has(messageGridLabel)) {
                    this.getLabelToBubbleObserver()
                      .get(messageGridLabel)
                      .disconnect();
                  }

                  const visibilityObserver = new MutationObserver(
                    this.#chatBoxVisibilityMutationHandler
                  );
                  visibilityObserver.observe(chatBox.firstChild.firstChild, {
                    attributes: true,
                  });
                  this.#labelToChatBoxObserver.set(
                    messageGridLabel,
                    visibilityObserver
                  );

                  if (inChatBoxContainerObserver) {
                    this.handleChatBubbles();
                  }
                  this.observeChatBubbles();
                }
              }
            }
          }
        };
        waitForGridsToBeLabeled();
      }
    }
  }

  // #moreActionsMenuContainerObserver = new MutationObserver((mutations) => {
  //   mutations.forEach((mutation) => {
  //     mutation.addedNodes.forEach((node) => {});
  //   });
  // });

  // #editorContainerMutationHandler = (mutations) => {
  //   mutations.forEach((mutation) => {
  //     // console.log(`attribute of editor container mutated`);
  //     // if (
  //     //   mutation.attributeName === 'aria-label' &&
  //     //   !mutation.target.hasAttribute('aria-label')
  //     // ) {
  //     //   console.log(`aria-label removed`);
  //     // }
  //     mutation.addedNodes.forEach((node) => {
  //       console.log(`node added to editor container's child list`);
  //       console.log(node);
  //       const textbox = node.querySelector(
  //         'div[role="textbox"][contenteditable="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw'
  //       );
  //     });
  //   });
  // };

  // observeEditorContainers() {
  //   const editorContainers = document.querySelectorAll(
  //     this.#editorContainerSelector
  //   );
  //   console.log(`${editorContainers.length} editor containers found`);
  //   for (const container of editorContainers) {
  //     const observer = new MutationObserver(
  //       this.#editorContainerMutationHandler
  //     );
  //     observer.observe(container, { childList: true });
  //   }
  // }

  messageGridsLabeled() {
    for (const chatBox of this.#chatBoxContainer.children) {
      const labeledMessageGrid = chatBox.querySelector(
        selector.labeledMessageGrid
      );
      if (labeledMessageGrid === null) {
        return false;
      }

      const label = labeledMessageGrid.getAttribute('aria-label');
      if (label === null || label === 'null') {
        return false;
      }
    }
    return true;
  }

  getMount() {
    return this.#mount;
  }

  setMount() {
    this.#mount = document.querySelector(selector.mount);
  }

  preventBlackPage() {
    if (this.#mount.style.display === 'none') {
      this.#mount.style.display = '';
    } else {
      const pageDisplayObserver = new MutationObserver(() => {
        if (
          this.#mount.hasAttribute('style') &&
          this.#mount.style.display === 'none'
        ) {
          this.#mount.style.display = '';
        }
      });
      pageDisplayObserver.observe(this.#mount, {
        attributes: true,
        attributeFilter: ['style'],
      });
      this.getActiveMutationObservers().push(pageDisplayObserver);
      setTimeout(() => {
        pageDisplayObserver.disconnect();

        const i =
          this.getActiveMutationObservers().indexOf(pageDisplayObserver);
        this.getActiveMutationObservers().splice(i, 1);
      }, 5000);
    }
  }

  getAccountControlsAndSettings() {
    return this.#accountControlsAndSettings;
  }

  setAccountControlsAndSettings() {
    this.#accountControlsAndSettings = document.querySelector(
      selector.accountControlsAndSettings
    );
  }

  observeAccountControlsAndSettings() {
    this.#accountControlsAndSettingsObserver.observe(
      this.#accountControlsAndSettings,
      { childList: true }
    );

    // this.getActiveMutationObservers().push(
    //   this.#accountControlsAndSettingsObserver
    // );
  }

  getChatBoxToLabel() {
    return this.#chatBoxToLabel;
  }

  setChatBoxToLabel() {
    for (const chatBox of this.#chatBoxContainer.children) {
      const messageGridLabel = chatBox
        .querySelector(selector.labeledMessageGrid)
        .getAttribute('aria-label');
      this.#chatBoxToLabel.set(chatBox, messageGridLabel);
    }
  }

  #chatBoxVisibilityMutationHandler = (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'hidden') {
        const labeledGrid = mutation.target.querySelector(
          selector.labeledMessageGrid
        );
        const messageGridLabel = labeledGrid
          ? labeledGrid.getAttribute('aria-label')
          : null;

        if (mutation.target.hasAttribute('hidden')) {
          const bubbleObserver =
            this.getLabelToBubbleObserver().get(messageGridLabel);
          if (bubbleObserver !== undefined) {
            bubbleObserver.disconnect();
          }
        } else {
          this.setMessageGrid(mutation.target);
          this.#chatBoxToLabel.set(mutation.target, messageGridLabel);
          this.handleChatBubbles();
          this.observeChatBubbles();
        }
      }
    });
  };

  observeChatBoxes() {
    for (const chatBox of this.#chatBoxContainer.children) {
      const messageGridLabel = chatBox
        .querySelector(selector.labeledMessageGrid)
        .getAttribute('aria-label');
      if (!this.#labelToChatBoxObserver.has(messageGridLabel)) {
        const observer = new MutationObserver(
          this.#chatBoxVisibilityMutationHandler
        );
        observer.observe(chatBox.firstChild.firstChild, { attributes: true });
        this.#labelToChatBoxObserver.set(messageGridLabel, observer);
      }
    }
    this.getMapsToMutationObservers().push(this.#labelToChatBoxObserver);
  }

  getChatBoxContainer() {
    return this.#chatBoxContainer;
  }

  setChatBoxContainer() {
    this.#chatBoxContainer = document.querySelector(selector.chatBoxContainer);
  }

  observeChatBoxContainer() {
    if (this.#chatBoxContainer) {
      this.#chatBoxContainerObserver.observe(this.#chatBoxContainer, {
        childList: true,
      });

      this.getActiveMutationObservers().push(this.#chatBoxContainerObserver);
    }
  }

  getChatBoxContainerContainer() {
    return this.#chatBoxContainerContainer;
  }

  setChatBoxContainerContainer() {
    this.#chatBoxContainerContainer = document.querySelector(
      selector.chatBoxContainerContainer
    );
  }

  observeChatBoxContainerContainer() {
    if (this.#chatBoxContainerContainer) {
      this.#chatBoxContainerContainerObserver.observe(
        this.#chatBoxContainerContainer,
        {
          childList: true,
        }
      );

      this.getActiveMutationObservers().push(
        this.#chatBoxContainerContainerObserver
      );
    }
  }

  markMostRecentMessage(gridcellSource = this.getChat()) {
    let gridcellContainer = gridcellSource.querySelector(
      selector.gridcellContainer
    );
    if (gridcellContainer === null) {
      gridcellContainer = gridcellSource;
    }

    const waitForMessagesToAppear = () => {
      if (gridcellContainer.children.length < 2) {
        setTimeout(waitForMessagesToAppear, 100);
      } else {
        const waitForBareGridcell = () => {
          const mostRecentMessage =
            gridcellContainer.children[gridcellContainer.children.length - 1];
          if (mostRecentMessage.hasAttribute('role')) {
            setTimeout(waitForBareGridcell, 100);
          } else {
            const finalOldMessage = gridcellContainer.querySelector(
              '.old-messages-end-here'
            );
            if (finalOldMessage !== null) {
              finalOldMessage.removeAttribute('class');
            }
            mostRecentMessage.classList.add('old-messages-end-here');
          }
        };
        waitForBareGridcell();
      }
    };
    waitForMessagesToAppear();
  }

  findGridcell(descendant) {
    if (
      !descendant.hasAttribute('class') &&
      isOfTheClasses(descendant.parentNode, [
        'x78zum5',
        'xdt5ytf',
        'x1iyjqo2',
        'x2lah0s',
        'xl56j7k',
        'x121v3j4',
      ])
    ) {
      return descendant;
    }

    let ancestor = descendant.parentNode;

    while (
      ancestor !== null &&
      (ancestor.hasAttribute('class') ||
        !isOfTheClasses(ancestor.parentNode, [
          'x78zum5',
          'xdt5ytf',
          'x1iyjqo2',
          'x2lah0s',
          'xl56j7k',
          'x121v3j4',
        ]))
    ) {
      ancestor = ancestor.parentNode;

      if (
        ancestor !== null &&
        ancestor.constructor.name === 'HTMLBodyElement'
      ) {
        return null;
      }
    }

    return ancestor;
  }

  isNewMessage(bubble) {
    const gridcell = this.findGridcell(bubble);
    if (gridcell === null) {
      return false;
    }

    let gridcellContainer = gridcell.parentNode;
    const gridcells = Array.from(gridcellContainer.children);
    const gridcellPos = gridcells.indexOf(gridcell);

    let finalOldMessage = gridcellContainer.querySelector(
      '.old-messages-end-here'
    );
    if (finalOldMessage === null) {
      this.markMostRecentMessage(gridcellContainer);
      finalOldMessage = gridcellContainer.querySelector(
        '.old-messages-end-here'
      );
    }

    const finalOldMessagePos = gridcells.indexOf(finalOldMessage);

    return gridcellPos > finalOldMessagePos;
  }

  waitForCompleteMessage(bubble) {
    const txt = bubble.textContent;
    setTimeout(() => {
      if (bubble.textContent !== txt) {
        this.waitForCompleteMessage(bubble);
      } else {
        parseParts(bubble);

        setTimeout(() => {
          const gridcell = this.findGridcell(bubble);
          if (gridcell !== null) {
            const gridcellContainer = gridcell.parentNode;
            this.markMostRecentMessage(gridcellContainer);
          }
        }, 8000);
      }
    }, 4000);
  }
}

export { DomInfo };
