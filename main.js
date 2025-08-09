class DomInfo {
  #accountControlsAndSettings = null;
  #chat = null;
  #messengerChatContainer = null;
  #chatBoxContainer = null;
  // #moreActionsMenuContainer = null;
  #messageGrids = [null, null];
  #chatBoxes = [];
  // #editorContainers = [];
  // #editorContainerObservers = [];
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
  // #moreActionsMenuContainerSelector =
  //   'div.x9f619.x1n2onr6.x1ja2u2z > div.x78zum5.xdt5ytf.x1n2onr6.x1ja2u2z > div.x78zum5.xdt5ytf.x1n2onr6.xat3117.xxzkxad > div:not(.x78zum5.xdt5ytf.x1t2pt76.x1n2onr6.x1ja2u2z.x10cihs4) > div, div.x1ey2m1c.xtijo5x.xixxii4.xamhafn.x1vjfegm > div:not(.xuk3077.x78zum5.xc8icb0) > div';
  // #moreActionsMenuSelector = 'div[aria-label="More actions"][role="menu"]';
  // #editorContainerSelector =
  //   'div[aria-label="Thread composer"].xuk3077.x57kliw.x78zum5.x6prxxf.xz9dl7a.xsag5q8, div:has(> .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.xt5xv9l.x6wvzqs.xpqajaz.x78zum5.xdt5ytf.x1c4vz4f.xs83m0k.x13qp9f6), div:has(> div[aria-label="Thread composer"].xuk3077.x57kliw.x78zum5.x6prxxf.xz9dl7a.xsag5q8)';

  #accountControlsAndSettingsObserver = new MutationObserver((mutations) => {
    let messengerControlSeen = false;

    const respondToControlMutation = (nodes, respond) => {
      for (const node of nodes) {
        const messengerControl = node.querySelector(
          this.#messengerControlSelector
        );
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
          (convo = node.querySelector(this.#chatSelector))
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
                !this.#chatBoxToLabel.has(node)
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

  // #moreActionsMenuContainerObserver = new MutationObserver((mutations) => {
  //   mutations.forEach((mutation) => {
  //     mutation.addedNodes.forEach((node) => {});
  //   });
  // });

  #documentVisibilityListener = () => {
    if (document.hidden) {
      this.disconnectObservers();
    } else {
      this.observeAccountControlsAndSettings();
      this.observeChatBoxContainer();
      this.observeMessengerChatContainer();

      if (this.#chatBoxToLabel.size === 0) {
        const loneEntry = this.#labelToBubbleObserver.entries().next().value;

        loneEntry[1].observe(this.#messageGrids[0], {
          childList: true,
          subtree: true,
        });
      } else {
        for (const key of this.#chatBoxToLabel.keys()) {
          const label = this.#chatBoxToLabel.get(key);
          const observer = this.#labelToBubbleObserver.get(label);
          const messageGrid = key.querySelector(this.#messageGridSelector);

          observer.observe(messageGrid, { childList: true, subtree: true });
        }
      }
    }
  };

  messageGridsLabeled() {
    for (const chatBox of this.#chatBoxContainer.children) {
      const labeledMessageGrid = chatBox.querySelector(
        this.#labeledMessageGridSelector
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
    let grid = pointOfReference.querySelector(this.#labeledMessageGridSelector);
    // Conditional statement below may be unnecessary
    if (grid === null) {
      grid = pointOfReference.querySelector(this.#messageGridSelector);
    }
    this.#messageGrids[i] = grid;
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

  #chatBubbleMutationHandler = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // console.log(`bubble source added to grid`);
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
        if (baseSpans.length > 0) {
          let i = baseSpans.length - 1;
          let j = 0;
          const insertLineBreak = () => {
            if (
              collectiveSpanWidth >
                baseSpans[0].parentNode.getBoundingClientRect().width &&
              i > j
            ) {
              if (
                partialSumOfSpanWidths -
                  baseSpans[i].getBoundingClientRect().width <=
                  baseSpans[0].parentNode.getBoundingClientRect().width - 10 ||
                i - j === 1
              ) {
                const spacer = document.createElement('div');
                spacer.style.margin = '10px 0px';
                baseSpans[0].parentNode.insertBefore(spacer, baseSpans[i]);

                if (
                  collectiveSpanWidth -
                    (partialSumOfSpanWidths -
                      baseSpans[i].getBoundingClientRect().width) >
                  baseSpans[0].parentNode.getBoundingClientRect().width - 10
                ) {
                  partialSumOfSpanWidths =
                    collectiveSpanWidth -
                    (partialSumOfSpanWidths -
                      baseSpans[i].getBoundingClientRect().width);
                  collectiveSpanWidth = partialSumOfSpanWidths;
                  j = i;
                  i = baseSpans.length - 1;

                  insertLineBreak();
                }
              } else {
                partialSumOfSpanWidths -=
                  baseSpans[i--].getBoundingClientRect().width;

                insertLineBreak();
              }
            }
          };
          insertLineBreak();
        }
      });
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
        this.parseContent(bubble);
      }
    }, 2000);
  }

  handleChatBubbles(bubbleSource) {
    const bubbleHandler = (source) => {
      if (source && 'querySelectorAll' in source) {
        const chatBubbles = source.querySelectorAll(this.#chatBubbleSelector);

        chatBubbles.forEach((bubble) => {
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

  // Consider removing parameter list along with second conditional statement
  setChatBoxToLabel(box, label) {
    if (arguments.length === 0) {
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

  listenToDocumentVisibility() {
    document.addEventListener(
      'visibilitychange',
      this.#documentVisibilityListener
    );
  }

  disconnectObservers() {
    [
      this.#accountControlsAndSettingsObserver,
      this.#chatBoxContainerObserver,
      this.#messengerChatContainerObserver,
    ].forEach((observer) => observer.disconnect());

    for (const entry of this.#labelToBubbleObserver.entries()) {
      entry[1].disconnect();
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
  if (domInfo.getChat() !== null && 'querySelector' in domInfo.getChat()) {
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
    console.log(`waiting to handle chat boxes...`);
    if (domInfo.getChatBoxContainer().children.length === 0) {
      setTimeout(() => {
        if ((lengthOfWait += 100) < 5000) {
          waitToHandleChatBoxes();
        }
      }, 100);
    } else {
      console.log(`handling chat boxes`);
      const waitForGridsToBeLabeled = () => {
        console.log(`waiting for grids to be labeled...`);
        if (!domInfo.messageGridsLabeled()) {
          setTimeout(waitForGridsToBeLabeled, 100);
        } else {
          console.log(`grids are labeled`);
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
  // console.log(`starting up`);
  const domInfo = new DomInfo();

  domInfo.listenToDocumentVisibility();

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

        // domInfo.setEditorContainers();
        // domInfo.observeEditorContainers();
      }
    };

    if (domInfo.getChat() === null) {
      waitToHandleChat();
    } else {
      domInfo.setMessageGrid();
      domInfo.handleChatBubbles();
      domInfo.observeChatBubbles();

      // domInfo.setEditorContainers();
      // domInfo.observeEditorContainers();
    }
  } else {
    domInfo.setChatBoxContainer();

    const waitToHandleChatBoxContainer = () => {
      console.log(`waiting to handle chat box container...`);
      if (domInfo.getChatBoxContainer() === null) {
        setTimeout(() => {
          domInfo.setChatBoxContainer();
          waitToHandleChatBoxContainer();
        }, 100);
      } else {
        console.log(`handling chat box container`);
        handleChatBoxContainer(domInfo);
      }
    };

    waitToHandleChatBoxContainer();
  }
};

window.onload = startUp;

// A variant of startUp, specifically for cases where addition of Messenger control is observed (switching from Messenger to chat box view)
const reset = () => {
  // console.log(`resetting`);
  const domInfo = new DomInfo();

  domInfo.listenToDocumentVisibility();

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
        }
      }

      domInfo.observeChatBoxContainer();
    }
  };
  waitForGridsToBeLabeled();
};
