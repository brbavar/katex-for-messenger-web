class DomInfo {
  #accountControlsAndSettings = null;
  #chat = null;
  #messengerChatContainer = null;
  #chatBoxContainer = null;
  #messageGrids = [null, null];
  #chatBoxes = [];
  #parsedBubbles = [];
  #chatBoxToLabel = new Map();
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
        this.setMessageGrid(0, node);
        if (this.#messageGrids[0] !== null) {
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
              if (
                !Array.from(this.#chatBoxToLabel.values()).includes(
                  messageGridLabel
                ) ||
                (Array.from(this.#chatBoxToLabel.values()).includes(
                  messageGridLabel
                ) &&
                  !this.#chatBoxToLabel.has(node))
              ) {
                this.#chatBoxToLabel.set(node, messageGridLabel);
                this.handleChatBubbles();
                this.observeChatBubbles();
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
        if (i !== -1) {
          this.#chatBoxes.splice(i, 1);
        }
        if (this.#labelToBubbleObserver.get(messageGridLabel)) {
          this.#labelToBubbleObserver.get(messageGridLabel).disconnect();
          this.#labelToBubbleObserver.delete(messageGridLabel);
        }
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
    for (const chatBox of this.#chatBoxContainer.children) {
      this.#chatBoxes.push(chatBox);
    }
  }

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
        console.log(`bubble source added to grid`);
        this.handleChatBubbles(node);
      });
    });
  };

  observeChatBubbles(i = 0) {
    const observer = new MutationObserver(this.#chatBubbleMutationHandler);

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
    } else {
      console.log(
        `Blocked parsing of bubble with this text: "${bubble.textContent}".\ndomInfo = ${this}`
      );
      console.log(
        `domInfo.getParsedBubbles().includes(bubble) = ${this.#parsedBubbles.includes(
          bubble
        )}`
      );
    }
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

  // Consider removing parameter list along with second conditional statement
  setChatBoxToLabel(box, label) {
    if (arguments.length === 0) {
      console.log(
        `${this.#chatBoxes.length} chatBoxes found; setting chatBoxToLabel now`
      );
      for (const chatBox of this.#chatBoxes) {
        const messageGridLabel = chatBox
          .querySelector(this.#labeledMessageGridSelector)
          .getAttribute('aria-label');
        this.#chatBoxToLabel.set(chatBox, messageGridLabel);
      }
    }
    // Condition below never satisfied in practice
    if (arguments.length === 2) {
      this.#chatBoxToLabel.set(box, label);
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
      const waitForGridsToBeLabeled = () => {
        if (!domInfo.messageGridsLabeled()) {
          setTimeout(waitForGridsToBeLabeled, 100);
        } else {
          domInfo.setChatBoxes();
          domInfo.setChatBoxToLabel();
          // Condition below may be superfluous
          if (domInfo.getChatBoxes().length !== 0) {
            for (const chat of domInfo.getChatBoxes()) {
              domInfo.setChat(chat);
              handleChat(domInfo);
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
  const waitForGridsToBeLabeled = () => {
    if (!domInfo.messageGridsLabeled()) {
      setTimeout(waitForGridsToBeLabeled, 100);
    } else {
      domInfo.setChatBoxes();
      domInfo.setChatBoxToLabel();
      // Condition below may be superfluous
      if (domInfo.getChatBoxes().length !== 0) {
        for (const chat of domInfo.getChatBoxes()) {
          domInfo.setChat(chat);
          domInfo.setMessageGrid();
          const waitToHandleMessages = () => {
            if (domInfo.getMessageGrid() === null) {
              setTimeout(() => {
                domInfo.setMessageGrid();
                waitToHandleMessages();
              }, 100);
            } else {
              domInfo.handleChatBubbles();
              domInfo.observeChatBubbles();
            }
          };
          waitToHandleMessages();
          // handleChat(domInfo);
          // domInfo.markAsHandled(chat);
        }
      }

      domInfo.observeChatBoxContainer();
    }
  };
  waitForGridsToBeLabeled();
};
