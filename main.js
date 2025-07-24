class DomInfo {
  #accountControlsAndSettings = null;
  #chat = null;
  #messengerChatContainer = null;
  #chatBoxContainer = null;
  #messageGrids = [null, null];
  #chatBubbleObservers = [];
  #chatBoxes = [];
  // #messageGridLabels = [];
  #parsedBubbles = [];
  // #handledChats = [];
  #chatBoxToLabel = new Map();
  #labelToWasHandled = new Map();
  // #labelToChatBoxObserver = new Map();
  #labelToBubbleObserver = new Map();
  #accountControlsAndSettingsSelector =
    'div[aria-label="Account Controls and Settings"][role="navigation"].x6s0dn4.x78zum5.x1s65kcs.x1n2onr6.x1ja2u2z';
  #messengerControlSelector = '[aria-label="Messenger"]';
  #chatSelector =
    'div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq';
  #messengerChatContainerSelector = `div.x78zum5.xdt5ytf.x1iyjqo2.x1t2pt76.xeuugli.x1n2onr6.x1ja2u2z.x1vhhd5d:has(${
    this.#chatSelector
  })`;
  #chatBoxContainerSelector = 'div.x1ey2m1c.x78zum5.xixxii4.x1vjfegm';
  #labeledMessageGridSelector = '[aria-label^="Messages in conversation"]';
  #messageGridSelector = `${
    this.#labeledMessageGridSelector
  }, div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62`;
  #chatBubbleSelector =
    '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm';
  #messageSelector = '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h';

  #accountControlsAndSettingsObserver = new MutationObserver((mutations) => {
    let messengerControlSeen = false;

    const respondToControlMutation = (nodes, respond) => {
      for (const node of nodes) {
        const messengerControl = node.querySelector(
          this.#messengerControlSelector
        );
        if (messengerControl !== null) {
          [
            this.#accountControlsAndSettingsObserver,
            this.#chatBoxContainerObserver,
            this.#messengerChatContainerObserver,
          ].forEach((observer) => observer.disconnect());
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
          (convo = node.querySelector(this.#chatSelector))
        ) {
          this.#chat = convo;
          this.setMessageGrid();
          this.handleChatBubbles();
          this.observeChatBubbles();
        }
      });
    });
  });

  #chatBoxContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log(`chat box added`);
        // const chatBoxObserver = new MutationObserver((mutations) => {
        //   mutations.forEach((mutation) => {
        //     if (
        //       mutation.attributeName === 'hidden' &&
        //       !node.firstChild.firstChild.hasAttribute('hidden')
        //     ) {
        //       // console.log(
        //       //   `chat box unhidden; message grid inside has label ${node
        //       //     .querySelector(this.#messageGridSelector)
        //       //     .getAttribute('aria-label')}`
        //       // );

        //       this.setMessageGrid(1, node);
        //       const chatBubbles = this.#messageGrids[1].querySelectorAll(
        //         this.#chatBubbleSelector
        //       );

        //       chatBubbles.forEach((bubble) => {
        //         // if (!domInfo.getParsedBubbles().includes(bubble)) {
        //         // console.log('bubble still needs parsed');
        //         this.parseContent(bubble);
        //       });

        //       this.observeChatBubbles(1);
        //     }
        //   });
        // });

        // chatBoxObserver.observe(node.firstChild.firstChild, {
        //   attributes: true,
        // });
        // // this.#labelToChatBoxObserver.set(node, chatBoxObserver);

        this.setMessageGrid(0, node);
        if (
          this.#messageGrids[0] !== null /*&&
          !node.firstChild.firstChild.hidden*/
        ) {
          const waitToHandleChatBox = () => {
            const labeledGrid = node.querySelector(
              this.#labeledMessageGridSelector
            );
            const messageGridLabel = labeledGrid
              ? labeledGrid.getAttribute('aria-label')
              : null;
            if (labeledGrid === null || messageGridLabel === null) {
              setTimeout(waitToHandleChatBox, 100);
            } else {
              // if (!this.#chatBoxes.includes(node)) {
              // const messageGridLabel = labeledGrid
              //   .getAttribute('aria-label');
              // if (!this.#messageGridLabels.includes(messageGridLabel)) {
              if (
                Array.from(this.#chatBoxToLabel.values()).includes(
                  messageGridLabel
                )
              ) {
                console.log(
                  `chat box with this grid label already in array; label = ${messageGridLabel}`
                );
                if (this.#chatBoxToLabel.has(node)) {
                  console.log(
                    `chat box in array is identical to the one just added`
                  );
                } else {
                  console.log(
                    `chat box in array is distinct from the one just added, though`
                  );
                  this.#chatBoxToLabel.set(node, messageGridLabel);
                  this.handleChatBubbles();
                  this.observeChatBubbles();
                }
              } else {
                // if (!this.#chatBoxToLabel.get(node) === messageGridLabel) {
                // this.#messageGridLabels.push(messageGridLabel);
                this.#chatBoxToLabel.set(node, messageGridLabel);

                // this.#labelToChatBoxObserver.set(
                //   messageGridLabel,
                //   chatBoxObserver
                // );

                console.log(
                  `this.#chatBoxToLabel.values().length === ${
                    this.#chatBoxToLabel.values().length
                  }`
                );
                console.log(`label of grid in chat box is ${messageGridLabel}`);

                // if (!this.#handledChats.includes(node)) {
                this.handleChatBubbles();
                this.observeChatBubbles();
                // this.#handledChats.push(node);
                // }
                // }
              }
            }
          };
          waitToHandleChatBox();
        }
      });
      mutation.removedNodes.forEach((node) => {
        const labeledGrid = node.querySelector(
          this.#labeledMessageGridSelector
        );
        const messageGridLabel = labeledGrid
          ? labeledGrid.getAttribute('aria-label')
          : null;
        const i = this.#chatBoxes.indexOf(node);
        // const j = this.#messageGridLabels.indexOf(messageGridLabel);
        if (i !== -1) {
          this.#chatBoxes.splice(i, 1);
          this.#chatBoxToLabel.delete(node);
        }
        // if (j !== -1) {
        //   this.#messageGridLabels.splice(j, 1);
        // if (this.#messageGridLabels.includes(messageGridLabel)) {
        // if (this.#chatBoxToLabel.values().includes(messageGridLabel)) {
        // if (this.#labelToChatBoxObserver.get(messageGridLabel)) {
        //   this.#labelToChatBoxObserver.get(messageGridLabel).disconnect();
        //   this.#labelToChatBoxObserver.delete(messageGridLabel);
        // }
        if (this.#labelToWasHandled.get(messageGridLabel)) {
          this.#labelToWasHandled.delete(messageGridLabel);
        }
        // }
      });
    });
  });

  messageGridsLabeled() {
    for (const chatBox of this.#chatBoxContainer.children) {
      if (chatBox.querySelector(this.#labeledMessageGridSelector) === null) {
        return false;
      }
    }
    return true;
  }

  getAccountControlsAndSettings() {
    return this.#accountControlsAndSettings;
  }

  setAccountControlsAndSettings() {
    this.#accountControlsAndSettings = document.querySelector(
      this.#accountControlsAndSettingsSelector
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
      this.#chat = document.querySelector(this.#chatSelector);
    }
    if (arguments.length === 1) {
      this.#chat = chat;
    }
  }

  getMessengerChatContainer() {
    return this.#messengerChatContainer;
  }

  setMessengerChatContainer() {
    this.#messengerChatContainer = document.querySelector(
      this.#messengerChatContainerSelector
    );
  }

  observeMessengerChatContainer() {
    if (this.#messengerChatContainer) {
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

  getChatBoxContainer() {
    return this.#chatBoxContainer;
  }

  setChatBoxContainer() {
    this.#chatBoxContainer = document.querySelector(
      this.#chatBoxContainerSelector
    );
  }

  observeChatBoxContainer() {
    if (this.#chatBoxContainer) {
      this.#chatBoxContainerObserver.observe(this.#chatBoxContainer, {
        childList: true,
      });
    }
  }

  getChatBoxes() {
    return this.#chatBoxes;
  }

  setChatBoxes() {
    // this.#chatBoxes is certainly still empty, so the following line is unnecessary
    // this.#chatBoxes.length = 0;

    // console.log(`this.#chatBoxes.length === ${this.#chatBoxes.length}`);
    console.log(
      `this.#chatBoxContainer.children.length === ${
        this.#chatBoxContainer.children.length
      }`
    );

    for (const chatBox of this.#chatBoxContainer.children) {
      // Condition always met; setChatBoxes is invoked only on startUp or reset, before chat boxes are added to this object's chatBoxes array member
      // if (!this.#chatBoxes.includes(chatBox)) {
      this.#chatBoxes.push(chatBox);

      // console.log(`Inside for loop in setChatBoxes`);
      // } else {
      //   console.log('chat box already in array');
      // }
    }
  }

  // #chatBoxMutationHandler = (mutations) => {
  //   mutations.forEach((mutation) => {
  //     if (
  //       mutation.attributeName === 'hidden' &&
  //       !mutation.target.hasAttribute('hidden')
  //     ) {
  //       console.log(`chat box unhidden`);

  //       this.setMessageGrid(0, mutation.target);
  //       const chatBubbles = this.#messageGrids[0].querySelectorAll(
  //         this.#chatBubbleSelector
  //       );

  //       chatBubbles.forEach((bubble) => {
  //         // if (!domInfo.getParsedBubbles().includes(bubble)) {
  //         // console.log('bubble still needs parsed');
  //         this.parseContent(bubble);
  //         //}
  //       });

  //       this.observeChatBubbles();
  //     }
  //   });
  // };

  // observeChatBoxes() {
  //   let i = 0;
  //   for (const chatBox of this.#chatBoxes) {
  //     if (
  //       chatBox.querySelector(this.#messageGridSelector) ||
  //       (chatBox.firstChild.firstChild && chatBox.firstChild.firstChild.hidden)
  //     ) {
  //       const chatBoxObserver = new MutationObserver(
  //         this.#chatBoxMutationHandler
  //       );

  //       chatBoxObserver.observe(chatBox.firstChild.firstChild, {
  //         attributes: true,
  //       });

  //       this.#labelToChatBoxObserver.set(
  //         // this.#messageGridLabels[i++],
  //         this.#chatBoxToLabel.get(chatBox),
  //         chatBoxObserver
  //       );
  //     }
  //   }
  // }

  // getMessageGridLabels() {
  //   return this.#messageGridLabels;
  // }

  // setMessageGridLabels() {
  //   for (const chatBox of this.#chatBoxes) {
  //     const messageGridLabel = chatBox
  //       .querySelector(this.#labeledMessageGridSelector)
  //       .getAttribute('aria-label');
  //     this.#messageGridLabels.push(messageGridLabel);
  //   }
  // }

  getMessageGrid(i) {
    if (arguments.length === 0) {
      return this.#messageGrids[0];
    }

    return this.#messageGrids[i];
  }

  setMessageGrid(i = 0, pointOfReference = this.#chat) {
    let grid = pointOfReference.querySelector(this.#messageGridSelector);
    this.#messageGrids[i] = grid;
  }

  #chatBubbleMutationHandler = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log(
          `node added to message grid, detected by chatBubbleObserver`
        );
        this.handleChatBubbles(node);
      });
    });
  };

  observeChatBubbles(i = 0) {
    const observer = new MutationObserver(this.#chatBubbleMutationHandler);
    this.#chatBubbleObservers.push(observer);

    const grid = this.#messageGrids[i];
    if (grid) {
      observer.observe(grid, {
        childList: true,
        subtree: true,
      });
    }

    const label = grid.getAttribute('aria-label');
    this.#labelToBubbleObserver.set(label, observer);
  }

  parseContent(bubble) {
    if (!this.#parsedBubbles.includes(bubble)) {
      const msg = bubble.querySelector(this.#messageSelector);
      let texBounds;

      if (msg !== null && msg.textContent !== '') {
        texBounds = getTexBounds(msg);
      }

      if (texBounds !== undefined && texBounds.length) {
        for (let i = 0; i < texBounds.length; i++) {
          const offset = 32 * i;

          msg.textContent = `${msg.textContent.substring(
            0,
            texBounds[i][0] + offset
          )}<span class='renderable'>${msg.textContent.substring(
            texBounds[i][0] + offset,
            texBounds[i][1] + 2 + offset
          )}</span>${msg.textContent.substring(texBounds[i][1] + 2 + offset)}`;
        }

        msg.innerHTML = msg.textContent;

        msg.querySelectorAll('span.renderable').forEach((span) => {
          try {
            katex.render(
              span.textContent.substring(2, span.textContent.length - 2),
              span,
              {
                displayMode: span.textContent[0] === '$',
              }
            );
          } catch (error) {
            console.error('Caught ' + error);
          }

          const baseSpans = span.querySelectorAll(
            'span:where(.katex, .katex-display) span.katex-html > span.base'
          );
          let collectiveSpanWidth = 0;

          for (let baseSpan of baseSpans) {
            collectiveSpanWidth += baseSpan.getBoundingClientRect().width;
          }

          let partialSumOfSpanWidths = collectiveSpanWidth;
          if (
            baseSpans.length > 0 &&
            collectiveSpanWidth >
              baseSpans[0].parentNode.getBoundingClientRect().width
          ) {
            for (let i = baseSpans.length - 1; i > -1; i--) {
              if (
                partialSumOfSpanWidths -
                  baseSpans[i].getBoundingClientRect().width <=
                baseSpans[0].parentNode.getBoundingClientRect().width - 10
              ) {
                const spacer = document.createElement('div');
                spacer.style.lineHeight = '2px';
                baseSpans[0].parentNode.insertBefore(spacer, baseSpans[i]);
                if (
                  collectiveSpanWidth - partialSumOfSpanWidths <=
                  baseSpans[0].parentNode.getBoundingClientRect().width - 10
                ) {
                  break;
                } else {
                  collectiveSpanWidth = partialSumOfSpanWidths;
                  // Recursively call the function this code belongs in, to deal
                  // with cases where arbitrarily many line breaks are needed
                }
              } else {
                partialSumOfSpanWidths -=
                  baseSpans[i].getBoundingClientRect().width;
              }
            }
          }
        });
      }
      this.markAsParsed(bubble);
    }
    // else {
    //   console.log(
    //     `Blocked parsing of bubble with this text: "${bubble.textContent}".\ndomInfo = ${this}`
    //   );
    //   console.log(
    //     `domInfo.getParsedBubbles().includes(bubble) = ${this.#parsedBubbles.includes(
    //       bubble
    //     )}`
    //   );
    // }
  }

  ensureParsed(bubble) {
    setTimeout(() => {
      const msg = bubble.querySelector(this.#messageSelector);
      let texBounds;

      if (msg !== null && msg.textContent !== '') {
        texBounds = getTexBounds(msg);
      }

      if (texBounds !== undefined && texBounds.length) {
        this.unmarkAsParsed(bubble);
        this.parseContent(bubble);
      }
    }, 2000);
  }

  handleChatBubbles(bubbleSource) {
    const bubbleHandler = (source) => {
      if (source && 'querySelectorAll' in source) {
        const chatBubbles = source.querySelectorAll(this.#chatBubbleSelector);

        chatBubbles.forEach((bubble) => {
          // if (!domInfo.getParsedBubbles().includes(bubble)) {
          // console.log('bubble still needs parsed');
          if (bubble.textContent === '') {
            const waitToParseContent = () => {
              if (
                bubble.textContent === '' ||
                bubble.querySelector(this.#messageSelector) === null
              ) {
                setTimeout(waitToParseContent, 100);
              } else {
                let txt = bubble.textContent;
                const waitForCompleteMessage = () => {
                  setTimeout(() => {
                    if (bubble.textContent !== txt) {
                      txt = bubble.textContent;
                      waitForCompleteMessage();
                    } else {
                      this.parseContent(bubble);
                      this.ensureParsed(bubble);
                    }
                  }, 100);
                };
                waitForCompleteMessage();
              }
            };
            waitToParseContent();
          } else {
            this.parseContent(bubble);
            this.ensureParsed(bubble);
          }
        });
      }
    };

    if (arguments.length === 0) {
      bubbleHandler(this.#messageGrids[0]);
    }
    if (arguments.length === 1) {
      bubbleHandler(bubbleSource);
    }
  }

  getParsedBubbles() {
    return this.#parsedBubbles;
  }

  markAsParsed(bubble) {
    this.#parsedBubbles.push(bubble);
  }

  unmarkAsParsed(bubble) {
    let i = this.#parsedBubbles.indexOf(bubble);
    if (i !== -1) {
      this.#parsedBubbles.splice(i);
    }
  }

  // getHandledChats() {
  //   return this.#handledChats;
  // }

  // markAsHandled(gridLabel) {
  //   this.#handledChats.push(gridLabel);
  // }

  getChatBoxToLabel() {
    return this.#chatBoxToLabel;
  }

  // Consider removing parameter list
  setChatBoxToLabel(box, label) {
    if (arguments.length === 0) {
      for (const chatBox of this.#chatBoxes) {
        const messageGridLabel = chatBox
          .querySelector(this.#labeledMessageGridSelector)
          .getAttribute('aria-label');
        this.#chatBoxToLabel.set(chatBox, messageGridLabel);
        // if (!messageGridLabel) {
        //   console.log(`added null value/label to this.#chatBoxToLabel`);
        // }
      }
    }
    // Condition below never satisfied in practice
    if (arguments.length === 2) {
      this.#chatBoxToLabel.set(box, label);
      // if (!label) {
      //   console.log(`added null value/label to this.#chatBoxToLabel`);
      // }
    }
  }

  getLabelToWasHandled() {
    return this.#labelToWasHandled;
  }

  setLabelToWasHandled(label, wasHandled) {
    if (arguments.length === 0) {
      for (const value of this.#chatBoxToLabel.values()) {
        this.#labelToWasHandled.set(value, false);
      }
    }
    if (arguments.length === 2) {
      this.#labelToWasHandled.set(label, wasHandled);
    }
  }
}

const injectCss = (filePath) => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = chrome.runtime.getURL(filePath);
  css.type = 'text/css';
  document.head.appendChild(css);
};

for (filePath of ['katex/katex.min.css', 'fb.katex.css']) injectCss(filePath);

const getTexBounds = (msg) => {
  const txt = msg.textContent;
  const bounds = [];

  const delimAt = (i) => {
    return (
      (txt[i] === '$' && txt[i + 1] === '$') ||
      (txt[i] === '\\' && (txt[i + 1] === '(' || txt[i + 1] === ')'))
    );
  };

  const openingDelimAt = (l) => {
    return delimAt(l) && (txt[l] === '$' || txt[l + 1] === '(');
  };

  const closingDelimAt = (r) => {
    return delimAt(r) && (txt[r] === '$' || txt[r + 1] === ')');
  };

  let l = 0,
    r = 0;
  while (l < txt.length) {
    if (
      openingDelimAt(l) &&
      (bounds.length === 0 || l !== bounds[bounds.length - 1][1])
    ) {
      r = l + 2;

      while (r + 1 < txt.length && !(closingDelimAt(r) && txt[l] == txt[r])) {
        if (openingDelimAt(r) && txt[l] == txt[r]) {
          l = r;
          r += 2;
        } else {
          r++;
        }
      }

      if (closingDelimAt(r) && txt[l] == txt[r]) {
        bounds.push([l, r]);
      }
    }
    l++;
  }

  return bounds;
};

const handleChat = (domInfo) => {
  const chat = domInfo.getChat();
  if (domInfo.getChat() && 'querySelector' in domInfo.getChat()) {
    const waitToHandleMessages = () => {
      if (domInfo.getMessageGrid() === null) {
        setTimeout(() => {
          domInfo.setChat(chat);
          domInfo.setMessageGrid();
          waitToHandleMessages();
        }, 100);
      } else {
        domInfo.observeChatBubbles();
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
      domInfo.setChatBoxes();
      const waitForGridsToBeLabeled = () => {
        console.log(`Waiting for grids to be labeled...`);
        if (!domInfo.messageGridsLabeled()) {
          setTimeout(waitForGridsToBeLabeled, 100);
        } else {
          console.log(`Grids are now labeled!`);
          // domInfo.setMessageGridLabels();
          domInfo.setChatBoxToLabel();
          domInfo.setLabelToWasHandled();
          // domInfo.observeChatBoxes();
          // Condition below may be superfluous
          if (domInfo.getChatBoxes().length !== 0) {
            // let i = 0;
            const chatBoxToLabel = domInfo.getChatBoxToLabel();
            const labelToWasHandled = domInfo.getLabelToWasHandled();
            for (const chat of domInfo.getChatBoxes()) {
              // if (
              //   !domInfo
              //     .getHandledChats()
              //     .includes(domInfo.getMessageGridLabels()[i]) /* &&
              //   !chat.firstChild.firstChild.hidden */
              // ) {
              const label = chatBoxToLabel.get(chat);
              const wasHandled = labelToWasHandled.get(label);
              if (!wasHandled) {
                domInfo.setChat(chat);
                handleChat(domInfo);
                domInfo.setLabelToWasHandled(label, true);
              }
            }
          }
        }
      };
      waitForGridsToBeLabeled();
    }
  };
  waitToHandleChatBoxes();

  domInfo.observeChatBoxContainer();
};

const initMessengerChatContainer = (domInfo) => {
  domInfo.setMessengerChatContainer();
  domInfo.observeMessengerChatContainer();
  domInfo.setChat();
};

const startUp = () => {
  const domInfo = new DomInfo();

  domInfo.setAccountControlsAndSettings();
  domInfo.observeAccountControlsAndSettings();

  if (window.location.href.startsWith('https://www.facebook.com/messages')) {
    initMessengerChatContainer(domInfo);

    const waitToHandleChat = () => {
      if (domInfo.getChat() === null) {
        domInfo.ignoreMessengerChatContainer();
        setTimeout(() => {
          initMessengerChatContainer(domInfo);
          waitToHandleChat();
        }, 100);
      } else {
        handleChat(domInfo);
      }
    };

    if (domInfo.getChat() === null) {
      waitToHandleChat();
    } else {
      domInfo.setMessageGrid();
      domInfo.handleChatBubbles();
      domInfo.observeChatBubbles();
    }
  } else {
    domInfo.setChatBoxContainer();

    const waitToHandleChatBoxContainer = () => {
      if (domInfo.getChatBoxContainer() === null) {
        setTimeout(() => {
          domInfo.setChatBoxContainer();
          waitToHandleChatBoxContainer();
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

  domInfo.setAccountControlsAndSettings();
  domInfo.observeAccountControlsAndSettings();

  domInfo.setChatBoxContainer();
  domInfo.setChatBoxes();
  const waitForGridsToBeLabeled = () => {
    console.log(`Waiting for grids to be labeled...`);
    if (!domInfo.messageGridsLabeled()) {
      setTimeout(waitForGridsToBeLabeled, 100);
    } else {
      console.log(`Grids are now labeled!`);
      // domInfo.setMessageGridLabels();
      domInfo.setChatBoxToLabel();
      domInfo.setLabelToWasHandled();
      // domInfo.observeChatBoxes();

      if (domInfo.getChatBoxes().length !== 0) {
        const chatBoxToLabel = domInfo.getChatBoxToLabel();
        const labelToWasHandled = domInfo.getLabelToWasHandled();
        for (const chat of domInfo.getChatBoxes()) {
          // if (
          //   /* !domInfo.getHandledChats().includes(chat) && */
          //   !chat.firstChild.firstChild.hidden
          // ) {
          const label = chatBoxToLabel.get(chat);
          const wasHandled = labelToWasHandled.get(label);
          if (!wasHandled) {
            domInfo.setChat(chat);
            domInfo.setMessageGrid();
            const waitToHandleMessages = () => {
              console.log(`Waiting to handle messages...`);
              if (domInfo.getMessageGrid() === null) {
                setTimeout(() => {
                  domInfo.setMessageGrid();
                  waitToHandleMessages();
                }, 100);
              } else {
                domInfo.handleChatBubbles();
                domInfo.observeChatBubbles();
                domInfo.setLabelToWasHandled(label, true);
              }
            };
            waitToHandleMessages();
            // handleChat(domInfo);
            // domInfo.markAsHandled(chat);
          }
        }
      }

      domInfo.observeChatBoxContainer();
    }
  };
  waitForGridsToBeLabeled();
};
