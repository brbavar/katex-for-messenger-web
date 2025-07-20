class DomInfo {
  #accountControlsAndSettings = null;
  #chat = null;
  #sendButton = null;
  #messengerChatContainer = null;
  #chatBoxContainer = null;
  #messageGrids = [null, null];
  #chatBoxes = [];
  #parsedBubbles = [];
  #handledChats = [];
  #chatBoxToObserver = new Map();

  #accountControlsAndSettingsObserver = new MutationObserver((mutations) => {
    let messengerControlSeen = false;

    const respondToControlMutation = (nodes, respond) => {
      for (const node of nodes) {
        const messengerControl = node.querySelector('[aria-label="Messenger"]');
        if (messengerControl !== null) {
          this.#accountControlsAndSettingsObserver.disconnect();
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
          (convo = node.querySelector(
            'div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq'
          ))
        ) {
          this.#chat = convo;
          this.setMessageGrid();
          this.handleChatBubbles();
          handleMessageGrid(this);
        }
      });
    });
  });

  #chatBoxContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // console.log(`chat box added`);
        const chatBoxObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.attributeName === 'hidden' &&
              !node.firstChild.firstChild.hasAttribute('hidden')
            ) {
              // console.log(`chat box unhidden`);
              // this.#messageGrid = node.querySelector(
              //   '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
              // );
              this.setMessageGrid(1, node);
              const chatBubbles = this.#messageGrids[1].querySelectorAll(
                '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
              );

              chatBubbles.forEach((bubble) => {
                // if (!domInfo.getParsedBubbles().includes(bubble)) {
                // console.log('bubble still needs parsed');
                parseContent(this, bubble);
              });

              handleMessageGrid(this, 1);
            }
          });
        });

        chatBoxObserver.observe(node.firstChild.firstChild, {
          attributes: true,
        });

        this.#chatBoxToObserver.set(node, chatBoxObserver);

        // let messageGrid = node.querySelector(
        //   '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
        // );
        this.setMessageGrid(0, node);
        if (
          this.#messageGrids[0] !== null &&
          !node.firstChild.firstChild.hidden
        ) {
          const waitToHandleChatBox = () => {
            // if (
            //   !this.#messageGrids[0].hasAttribute(
            //     'aria-label'
            //   ) /* || !this.#messageGrids[1].hasAttribute('aria-label').startsWith('Messages in conversation') */
            // ) {
            if (
              node.querySelector('[aria-label^="Messages in conversation"]') ===
              null
            ) {
              console.log(`waiting to handle chat box...`);
              setTimeout(() => {
                // messageGrid = node.querySelector(
                //   '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
                // );
                // this.setMessageGrid(0, node);
                waitToHandleChatBox();
              }, 100);
            } else {
              // This condition may not be doing anything for us
              // if (!this.#chatBoxes.includes(node)) {
              // console.log(
              //   `${this.getMessageGrid(0).getAttribute('aria-label')}`
              // );
              this.#chatBoxes.push(node);

              // if (!this.#handledChats.includes(node)) {
              // this.#chat = node;
              // this.#messageGrid = messageGrid;
              this.handleChatBubbles();
              handleMessageGrid(this);
              // this.#handledChats.push(node);
              // }
              // }
            }
          };
          waitToHandleChatBox();
        }
      });
      mutation.removedNodes.forEach((node) => {
        let i = this.#chatBoxes.indexOf(node);
        if (i !== -1) {
          this.#chatBoxes.splice(i, 1);

          if (this.#chatBoxToObserver.get(node)) {
            this.#chatBoxToObserver.get(node).disconnect();
            this.#chatBoxToObserver.delete(node);
          }
        }
      });
    });
  });

  getAccountControlsAndSettings() {
    return this.#accountControlsAndSettings;
  }

  setAccountControlsAndSettings() {
    this.#accountControlsAndSettings = document.querySelector(
      'div[aria-label="Account Controls and Settings"][role="navigation"].x6s0dn4.x78zum5.x1s65kcs.x1n2onr6.x1ja2u2z'
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
      this.#chat = document.querySelector(
        'div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq'
      );
    }
    if (arguments.length === 1) {
      this.#chat = chat;
    }
  }

  getSendButton() {
    return this.#sendButton;
  }

  setSendButton(chat) {
    this.#sendButton = chat.querySelector(
      ':where([aria-label^="Send a"], [aria-label="Press enter to send"]).x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.xjbqb8w.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz'
    );
  }

  getMessengerChatContainer() {
    return this.#messengerChatContainer;
  }

  setMessengerChatContainer() {
    this.#messengerChatContainer = document.querySelector(
      'div.x78zum5.xdt5ytf.x1iyjqo2.x1t2pt76.xeuugli.x1n2onr6.x1ja2u2z.x1vhhd5d:has(div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq)'
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
      'div.x1ey2m1c.x78zum5.xixxii4.x1vjfegm'
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
    this.#chatBoxes.length = 0;

    console.log(
      `${this.#chatBoxContainer.children.length} chat boxes in container`
    );

    for (const chatBox of this.#chatBoxContainer.children) {
      if (!this.#chatBoxes.includes(chatBox)) {
        this.#chatBoxes.push(chatBox);

        const grid = chatBox.querySelector(
          '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
        );
        if (
          grid ||
          (chatBox.firstChild.firstChild &&
            chatBox.firstChild.firstChild.hidden)
        ) {
          const chatBoxObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (
                mutation.attributeName === 'hidden' &&
                !chatBox.firstChild.firstChild.hasAttribute('hidden')
              ) {
                // console.log(`chat box unhidden`);
                const chatBubbles = chatBox
                  .querySelector(
                    '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
                  )
                  .querySelectorAll(
                    '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
                  );

                chatBubbles.forEach((bubble) => {
                  // if (!domInfo.getParsedBubbles().includes(bubble)) {
                  // console.log('bubble still needs parsed');
                  parseContent(this, bubble);
                  //}
                });

                this.#messageGrids[0] = chatBox.querySelector(
                  '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
                );
                handleMessageGrid(this);
              }
            });
          });

          chatBoxObserver.observe(chatBox.firstChild.firstChild, {
            attributes: true,
          });

          this.#chatBoxToObserver.set(chatBox, chatBoxObserver);
        }
      }
    }
  }

  getMessageGrid(i) {
    if (arguments.length === 0) {
      return this.#messageGrids[0];
    }

    return this.#messageGrids[i];
  }

  setMessageGrid(i = 0, pointOfReference = this.#chat) {
    // let grid = pointOfReference.querySelector(
    //   'div[aria-label^="Messages in conversation"][role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
    // );
    // if (!grid) {
    //   console.log(`Couldn't find grid. Try again.`);
    //   grid = pointOfReference.querySelector(
    //     '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
    //   );

    //   // console.log(`this.#chat.querySelector(
    //   //   '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
    //   // ) = ${this.#chat.querySelector(
    //   //   '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
    //   // )}`);
    // }
    let grid = pointOfReference.querySelector(
      '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
    );
    // console.log(`grid = ${grid}`);

    this.#messageGrids[i] = grid;
  }

  ensureParsed(bubble) {
    setTimeout(() => {
      const msg = bubble.querySelector(
        '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h'
      );
      let texBounds;

      if (msg !== null && msg.textContent !== '') {
        texBounds = getTexBounds(msg);
      }

      if (texBounds !== undefined && texBounds.length) {
        this.unmarkAsParsed(bubble);
        parseContent(this, bubble);
      }
    }, 2000);
  }

  handleChatBubbles(bubbleSource) {
    const bubbleHandler = (source) => {
      // console.log(`source = ${source}`);
      // console.log(
      //   `'querySelectorAll' in source = ${'querySelectorAll' in source}`
      // );
      if (source && 'querySelectorAll' in source) {
        const chatBubbles = source.querySelectorAll(
          '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
        );

        // console.log(`${chatBubbles.length} chat bubbles found`);

        chatBubbles.forEach((bubble) => {
          // if (!domInfo.getParsedBubbles().includes(bubble)) {
          // console.log('bubble still needs parsed');
          if (bubble.textContent === '') {
            const waitToParseContent = () => {
              if (
                bubble.textContent === '' ||
                bubble.querySelector(
                  '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h'
                ) === null
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
                      parseContent(this, bubble);
                      this.ensureParsed(bubble);
                    }
                  }, 100);
                };
                waitForCompleteMessage();
              }
            };
            waitToParseContent();
          } else {
            parseContent(this, bubble);
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

  getHandledChats() {
    return this.#handledChats;
  }

  markAsHandled(chat) {
    this.#handledChats.push(chat);
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

const parseContent = (domInfo = null, bubble) => {
  if (domInfo === null || !domInfo.getParsedBubbles().includes(bubble)) {
    const msg = bubble.querySelector(
      '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h'
    );
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
    if (domInfo !== null) {
      domInfo.markAsParsed(bubble);
    }
  } else {
    console.log(
      `Blocked parsing of bubble with this text: "${bubble.textContent}".\ndomInfo = ${domInfo}`
    );
    console.log(
      `domInfo.getParsedBubbles().includes(bubble) = ${domInfo
        .getParsedBubbles()
        .includes(bubble)}`
    );
  }
};

let chatBubbleObserver;

const handleMessageGrid = (domInfo, i = 0) => {
  chatBubbleObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // console.log(`node added to grid`);
        domInfo.handleChatBubbles(node);
      });
    });
  });

  if (domInfo.getMessageGrid(i)) {
    chatBubbleObserver.observe(domInfo.getMessageGrid(i), {
      childList: true,
      subtree: true,
    });
  }
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
        // console.log(`handling message grid`);
        handleMessageGrid(domInfo);
      }
    };
    waitToHandleMessages();
  }
};

const handleChatBoxContainer = (domInfo) => {
  console.log(`Handling chat box container.`);

  let lengthOfWait = 0;
  const waitToHandleChatBoxes = () => {
    if (domInfo.getChatBoxContainer().children.length === 0) {
      console.log(
        `No chat boxes yet. Waiting to handle them... lengthOfWait = ${lengthOfWait}`
      );
      setTimeout(() => {
        if ((lengthOfWait += 100) < 5000) {
          waitToHandleChatBoxes();
        }
      }, 100);
    } else {
      domInfo.setChatBoxes();
      // Condition below may be superfluous
      if (domInfo.getChatBoxes().length !== 0) {
        for (const chat of domInfo.getChatBoxes()) {
          // if (
          //   /* !domInfo.getHandledChats().includes(chat) && */
          //   !chat.firstChild.firstChild.hidden
          // ) {
          domInfo.setChat(chat);
          handleChat(domInfo);
          // domInfo.markAsHandled(chat);
          // }
        }
      }
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
      handleMessageGrid(domInfo);
    }
  } else {
    domInfo.setChatBoxContainer();

    const waitToHandleChatBoxContainer = () => {
      if (domInfo.getChatBoxContainer() === null) {
        console.log(`No chat box container yet. Waiting to handle it...`);
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

  if (domInfo.getChatBoxes().length !== 0) {
    for (const chat of domInfo.getChatBoxes()) {
      // if (
      //   /* !domInfo.getHandledChats().includes(chat) && */
      //   !chat.firstChild.firstChild.hidden
      // ) {
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
          handleMessageGrid(domInfo);
        }
      };
      waitToHandleMessages();
      // handleChat(domInfo);
      // domInfo.markAsHandled(chat);
      // }
    }
  }

  domInfo.observeChatBoxContainer();
};
