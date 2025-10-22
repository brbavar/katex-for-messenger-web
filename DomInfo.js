import * as selector from './selector.js';
import { DomInfoCore } from './DomInfoCore.js';
import { setUpMessengerView, setUpChatBoxView } from './run.js';
import { parseParts } from './parse.js';
import { findAncestor } from './util.js';
import { gridChunkFeatures, gridChunkNonFeatures } from './config.js';

class DomInfo extends DomInfoCore {
  #mount = null;
  #accountControlsAndSettings = null;
  #chatBoxContainer = null;
  #chatBoxContainerContainer = null;
  // #gridChunk = null;
  #chatBoxToLabel = new Map();
  #labelToChatBoxObserver = new Map();

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
        const bubbleObserver =
          this.getLabelToBubbleObserver().get(messageGridLabel);

        if (mutation.target.hasAttribute('hidden')) {
          if (this.getLabelToBubbleObserver().has(messageGridLabel)) {
            bubbleObserver.disconnect();
          }
        } else {
          this.setMessageGrid(mutation.target);
          this.#chatBoxToLabel.set(mutation.target, messageGridLabel);
          this.handleChatBubbles();
          if (
            this.getLabelToBubbleObserver().has(messageGridLabel) &&
            this.getMessageGrid() !== null
          ) {
            bubbleObserver.observe(this.getMessageGrid(), {
              childList: true,
              subtree: true,
            });
          } else {
            this.observeChatBubbles();
          }
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
      } else {
        this.#labelToChatBoxObserver
          .get(messageGridLabel)
          .observe(chatBox.firstChild.firstChild, { attributes: true });
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

  // getGridChunk() {
  //   return this.#gridChunk;
  // }

  // setGridChunk(chatBubble) {
  //   this.#gridChunk = findAncestor(
  //     chatBubble,
  //     gridChunkFeatures,
  //     gridChunkNonFeatures
  //   );
  // }

  markMostRecentMessage(gridChunkSource = this.getChat()) {
    let gridChunkContainer = gridChunkSource.querySelector(
      selector.gridChunkContainer
    );
    if (gridChunkContainer === null) {
      gridChunkContainer = gridChunkSource;
    }

    const waitForMessagesToAppear = () => {
      if (gridChunkContainer.children.length < 2) {
        setTimeout(waitForMessagesToAppear, 100);
      } else {
        const waitForBareGridChunk = () => {
          const mostRecentMessage =
            gridChunkContainer.children[gridChunkContainer.children.length - 1];
          if (mostRecentMessage.hasAttribute('role')) {
            setTimeout(waitForBareGridChunk, 100);
          } else {
            const finalOldMessage = gridChunkContainer.querySelector(
              '.old-messages-end-here'
            );
            if (finalOldMessage !== null) {
              finalOldMessage.removeAttribute('class');
            }
            mostRecentMessage.classList.add('old-messages-end-here');
          }
        };
        waitForBareGridChunk();
      }
    };
    waitForMessagesToAppear();
  }

  isNewMessage(bubble /*, gridChunk*/) {
    const gridChunk = findAncestor(
      bubble,
      gridChunkFeatures,
      gridChunkNonFeatures
    );
    // // gridChunk = findAncestor(bubble, gridChunkFeatures, gridChunkNonFeatures);
    // console.log(`gridChunk found in isNewMessage:`);
    // console.log(gridChunk);
    if (gridChunk === null) {
      return false;
    }

    let gridChunkContainer = gridChunk.parentNode;
    const gridChunks = Array.from(gridChunkContainer.children);
    const gridChunkPos = gridChunks.indexOf(gridChunk);

    // this.setGridChunk(bubble);
    // console.log(`gridChunk found in isNewMessage:`);
    // console.log(this.getGridChunk());
    // if (this.getGridChunk() === null) {
    //   return false;
    // }

    // let gridChunkContainer = this.getGridChunk().parentNode;
    // const gridChunks = Array.from(gridChunkContainer.children);
    // const gridChunkPos = gridChunks.indexOf(this.getGridChunk());

    let finalOldMessage = gridChunkContainer.querySelector(
      '.old-messages-end-here'
    );
    if (finalOldMessage === null) {
      this.markMostRecentMessage(gridChunkContainer);
      finalOldMessage = gridChunkContainer.querySelector(
        '.old-messages-end-here'
      );
    }

    const finalOldMessagePos = gridChunks.indexOf(finalOldMessage);

    return gridChunkPos > finalOldMessagePos;
  }

  waitForCompleteMessage(bubble /*, gridChunk*/) {
    const txt = bubble.textContent;
    setTimeout(() => {
      if (bubble.textContent !== txt) {
        // console.log(`waiting for complete message...`);
        this.waitForCompleteMessage(bubble /*, gridChunk*/);
      } else {
        // console.log(`message complete!`);
        parseParts(bubble);

        setTimeout(() => {
          const gridChunk = findAncestor(
            bubble,
            gridChunkFeatures,
            gridChunkNonFeatures
          );
          // console.log(`gridChunk found in waitForCompleteMessage:`);
          // console.log(gridChunk);
          if (gridChunk !== null) {
            const gridChunkContainer = gridChunk.parentNode;
            // console.log(`gridChunk that is accessed in waitForCompleteMessage:`);
            // console.log(this.getGridChunk());
            // if (this.getGridChunk() !== null) {
            //   const gridChunkContainer = this.getGridChunk().parentNode;
            this.markMostRecentMessage(gridChunkContainer);
          }
        }, 8000);
      }
    }, 4000);
  }
}

export { DomInfo };
