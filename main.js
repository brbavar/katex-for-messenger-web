import * as selector from './selector.js';
import { parseParts } from './parse.js';
import { makeFit, undoMakeFit } from './aesthetex.js';

class DomInfo {
  #mount = null;
  #accountControlsAndSettings = null;
  #chat = null;
  #messengerChatContainer = null;
  #messengerChatContainerContainer = null;
  #chatBoxContainer = null;
  #chatBoxContainerContainer = null;
  // #moreActionsMenuContainer = null;
  #messageGrid = null;
  #messengerChatContainerContainerWidth = -1;
  // #editorContainers = [];
  // #editorContainerObservers = [];
  // #escapeCharIndices = [];
  #chatBoxToLabel = new Map();
  #labelToBubbleObserver = new Map();
  #labelToChatBoxObserver = new Map();

  #accountControlsAndSettingsObserver = new MutationObserver((mutations) => {
    let messengerControlSeen = false;

    const respondToControlMutation = (nodes, respond) => {
      for (const node of nodes) {
        const messengerControl = node.querySelector(selector.messengerControl);
        if (messengerControl !== null) {
          this.disconnectObservers();
          respond();
          messengerControlSeen = true;
          break;
        }
      }
    };

    for (const mutation of mutations) {
      respondToControlMutation(mutation.addedNodes, reset);
      respondToControlMutation(mutation.removedNodes, startUp);
      if (messengerControlSeen) {
        break;
      }
    }
  });

  #messengerChatContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        let convo = null;
        if (
          'querySelector' in node &&
          (convo = node.querySelector(selector.chat))
        ) {
          const loneEntry = this.#labelToBubbleObserver.entries().next().value;
          loneEntry[1].disconnect();
          this.#labelToBubbleObserver.delete(loneEntry[0]);

          this.#chat = convo;
          this.setMessageGrid();
          this.handleChatBubbles();
          this.observeChatBubbles();
        }
      });
    });
  });

  #messengerChatContainerContainerObserver = new ResizeObserver(() => {
    if (
      this.#messengerChatContainerContainer.getBoundingClientRect().width !==
      this.#messengerChatContainerContainerWidth
    ) {
      this.#messengerChatContainerContainerWidth =
        this.#messengerChatContainerContainer.getBoundingClientRect().width;

      this.#messageGrid
        .querySelectorAll(
          `${selector.chatBubble} span:where(:not(.katex-display) > .katex, .katex-display)`
        )
        .forEach((span) => {
          undoMakeFit(span);
          makeFit(span);
        });
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

                  if (this.#labelToBubbleObserver.has(messageGridLabel)) {
                    this.#labelToBubbleObserver
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
      setTimeout(() => {
        pageDisplayObserver.disconnect();
      }, 5000);
    }
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

  getChat() {
    return this.#chat;
  }

  setChat(chat) {
    if (arguments.length === 0) {
      this.#chat = document.querySelector(selector.chat);
    }
    if (arguments.length === 1) {
      this.#chat = chat;
    }
  }

  setMessengerChatContainer() {
    this.#messengerChatContainer =
      this.#messengerChatContainerContainer.querySelector(
        selector.messengerChatContainer
      );
  }

  observeMessengerChatContainer() {
    if (this.#messengerChatContainer !== null) {
      this.#messengerChatContainerObserver.observe(
        this.#messengerChatContainer,
        {
          childList: true,
        }
      );
    }
  }

  ignoreMessengerChatContainer() {
    this.#messengerChatContainerObserver.disconnect();
  }

  setMessengerChatContainerContainer() {
    this.#messengerChatContainerContainer = document.querySelector(
      selector.messengerChatContainerContainer
    );
  }

  observeMessengerChatContainerContainer() {
    if (this.#messengerChatContainerContainer !== null) {
      this.#messengerChatContainerContainerObserver.observe(
        this.#messengerChatContainerContainer
      );
    }
  }

  ignoreMessengerChatContainerContainer() {
    this.#messengerChatContainerContainerObserver.unobserve(
      this.#messengerChatContainerContainer
    );
  }

  setMessengerChatContainerContainerWidth() {
    this.#messengerChatContainerContainerWidth =
      this.#messengerChatContainerContainer.getBoundingClientRect().width;
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
    }
  }

  getMessageGrid() {
    return this.#messageGrid;
  }

  setMessageGrid(pointOfReference = this.#chat) {
    let grid = pointOfReference.querySelector(selector.labeledMessageGrid);
    // Conditional statement below may be unnecessary
    if (grid === null) {
      grid = pointOfReference.querySelector(selector.messageGrid);
    }

    this.#messageGrid = grid;
  }

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

  markMostRecentMessage(gridcellSource = this.#chat) {
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

  #chatBubbleMutationHandler = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        this.handleChatBubbles(node);
      });
    });
  };

  observeChatBubbles() {
    if (this.#messageGrid !== null) {
      const observer = new MutationObserver(this.#chatBubbleMutationHandler);

      observer.observe(this.#messageGrid, {
        childList: true,
        subtree: true,
      });

      const label = this.#messageGrid.getAttribute('aria-label');
      this.#labelToBubbleObserver.set(label, observer);
    }
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

  handleChatBubbles(bubbleSource) {
    const bubbleHandler = (source) => {
      if (source && 'querySelectorAll' in source) {
        const chatBubbles = source.querySelectorAll(selector.chatBubble);
        chatBubbles.forEach((bubble) => {
          const waitForCompleteMessage = (txt) => {
            setTimeout(() => {
              if (bubble.textContent !== txt) {
                waitForCompleteMessage(bubble.textContent);
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
          };
          if (this.isNewMessage(bubble)) {
            waitForCompleteMessage(bubble.textContent);
          } else {
            parseParts(bubble);
          }
        });
      }
    };

    if (arguments.length === 0) {
      bubbleHandler(this.#messageGrid);
    }
    if (arguments.length === 1) {
      bubbleHandler(bubbleSource);
    }
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

  getLabelToBubbleObserver() {
    return this.#labelToBubbleObserver;
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
            this.#labelToBubbleObserver.get(messageGridLabel);
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
  }

  disconnectObservers() {
    [
      this.#accountControlsAndSettingsObserver,
      this.#chatBoxContainerObserver,
      this.#chatBoxContainerContainerObserver,
      this.#messengerChatContainerObserver,
    ].forEach((observer) => observer.disconnect());

    for (const entry of this.#labelToChatBoxObserver.entries()) {
      entry[1].disconnect();
    }

    for (const entry of this.#labelToBubbleObserver.entries()) {
      entry[1].disconnect();
    }

    if (this.#messengerChatContainerContainer !== null) {
      this.#messengerChatContainerContainerObserver.unobserve(
        this.#messengerChatContainerContainer
      );
    }
  }
}

const isOfTheClasses = (node, theCs) => {
  for (const c of theCs) {
    if (
      node === null ||
      !('classList' in node) ||
      !node.classList.contains(c)
    ) {
      return false;
    }
  }
  return true;
};

const injectCss = (filePath) => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  // Should not use chrome.runtime API in Safari (and should use cautiously in Firefox)
  css.href = chrome.runtime.getURL(filePath);
  css.type = 'text/css';
  document.head.appendChild(css);
};

for (filePath of ['katex/katex.min.css', 'fb.katex.css']) injectCss(filePath);

const handleChat = (domInfo) => {
  const chat = domInfo.getChat();
  if (domInfo.getChat() !== null && 'querySelector' in domInfo.getChat()) {
    const waitToHandleMessages = () => {
      if (domInfo.getMessageGrid() === null) {
        setTimeout(() => {
          domInfo.setChat(chat);
          domInfo.setMessageGrid();
          waitToHandleMessages();
        }, 100);
      } else {
        const label = domInfo.getChatBoxToLabel().get(chat);
        if (label === null || !domInfo.getLabelToBubbleObserver().has(label)) {
          domInfo.handleChatBubbles();
          domInfo.observeChatBubbles();
        }
      }
    };
    waitToHandleMessages();
  }
};

const handleChatBoxContainer = (domInfo) => {
  let lengthOfWait = 0;
  const waitToHandleChatBoxes = () => {
    if (domInfo.getChatBoxContainer().children.length === 0) {
      setTimeout(() => {
        if ((lengthOfWait += 100) < 5000) {
          waitToHandleChatBoxes();
        }
      }, 100);
    } else {
      const waitForGridsToBeLabeled = () => {
        if (!domInfo.messageGridsLabeled()) {
          setTimeout(waitForGridsToBeLabeled, 100);
        } else {
          domInfo.setChatBoxToLabel();
          domInfo.observeChatBoxes();
          const chatBoxes = domInfo.getChatBoxContainer().children;
          for (const chat of chatBoxes) {
            domInfo.markMostRecentMessage(chat);

            domInfo.setChat(chat);
            handleChat(domInfo);
          }
        }
      };
      waitForGridsToBeLabeled();
    }
  };
  waitToHandleChatBoxes();

  domInfo.observeChatBoxContainer();
};

const initMessengerChat = (domInfo) => {
  domInfo.setMessengerChatContainerContainer();
  domInfo.setMessengerChatContainerContainerWidth();
  domInfo.observeMessengerChatContainerContainer();

  domInfo.setMessengerChatContainer();
  domInfo.observeMessengerChatContainer();

  domInfo.setChat();
};

const startUp = () => {
  const domInfo = new DomInfo();

  domInfo.setMount();
  const waitForMount = () => {
    if (domInfo.getMount() === null) {
      setTimeout(() => {
        domInfo.setMount();
        waitForMount();
      }, 100);
    } else {
      domInfo.preventBlackPage();
    }
  };
  waitForMount();

  domInfo.setAccountControlsAndSettings();
  domInfo.observeAccountControlsAndSettings();

  if (window.location.href.startsWith('https://www.facebook.com/messages')) {
    initMessengerChat(domInfo);

    const waitToHandleChat = () => {
      if (domInfo.getChat() === null) {
        domInfo.ignoreMessengerChatContainerContainer();
        domInfo.ignoreMessengerChatContainer();
        setTimeout(() => {
          initMessengerChat(domInfo);
          waitToHandleChat();
        }, 100);
      } else {
        domInfo.markMostRecentMessage();

        handleChat(domInfo);

        // domInfo.setEditorContainers();
        // domInfo.observeEditorContainers();
      }
    };

    if (domInfo.getChat() === null) {
      waitToHandleChat();
    } else {
      domInfo.markMostRecentMessage();

      domInfo.setMessageGrid();
      domInfo.handleChatBubbles();
      domInfo.observeChatBubbles();

      // domInfo.setEditorContainers();
      // domInfo.observeEditorContainers();
    }
  } else {
    domInfo.setChatBoxContainerContainer();

    let lengthOfWait = 0;
    const waitToObserveChatBoxContainerContainer = () => {
      if (domInfo.getChatBoxContainerContainer() === null) {
        setTimeout(() => {
          if ((lengthOfWait += 100) < 5000) {
            domInfo.setChatBoxContainerContainer();
            waitToObserveChatBoxContainerContainer();
          }
        }, 100);
      } else {
        domInfo.observeChatBoxContainerContainer();
      }
    };
    waitToObserveChatBoxContainerContainer();

    domInfo.setChatBoxContainer();

    lengthOfWait = 0;
    const waitToHandleChatBoxContainer = () => {
      if (domInfo.getChatBoxContainer() === null) {
        setTimeout(() => {
          if ((lengthOfWait += 100) < 5000) {
            domInfo.setChatBoxContainer();
            waitToHandleChatBoxContainer();
          }
        }, 100);
      } else {
        handleChatBoxContainer(domInfo);
      }
    };
    waitToHandleChatBoxContainer();
  }
};

window.onload = startUp;

// A variant of startUp, specifically for cases where addition of Messenger control is observed (switching from Messenger to chat box view)
const reset = () => {
  const domInfo = new DomInfo();

  domInfo.setChatBoxContainerContainer();
  domInfo.observeChatBoxContainerContainer();

  domInfo.setAccountControlsAndSettings();
  domInfo.observeAccountControlsAndSettings();

  domInfo.setChatBoxContainer();
  const waitForGridsToBeLabeled = () => {
    if (!domInfo.messageGridsLabeled()) {
      setTimeout(waitForGridsToBeLabeled, 100);
    } else {
      domInfo.setChatBoxToLabel();
      domInfo.observeChatBoxes();

      const chatBoxes = domInfo.getChatBoxContainer().children;
      for (const chat of chatBoxes) {
        domInfo.setChat(chat);
        domInfo.setMessageGrid();
        const waitToHandleMessages = () => {
          if (domInfo.getMessageGrid() === null) {
            setTimeout(() => {
              domInfo.setMessageGrid();
              waitToHandleMessages();
            }, 100);
          } else {
            domInfo.markMostRecentMessage(chat);

            domInfo.handleChatBubbles();
            domInfo.observeChatBubbles();
          }
        };
        waitToHandleMessages();
      }

      domInfo.observeChatBoxContainer();
    }
  };
  waitForGridsToBeLabeled();
};
