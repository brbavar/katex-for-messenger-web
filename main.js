class DomInfo {
  #accountControlsAndSettings = null;
  #chat = null;
  #messengerChatContainer = null;
  #chatBoxContainer = null;
  #chatBoxContainerContainer = null;
  // #moreActionsMenuContainer = null;
  #messageGrids = [null, null];
  // #editorContainers = [];
  // #editorContainerObservers = [];
  #chatBoxToLabel = new Map();
  #labelToBubbleObserver = new Map();
  #labelToChatBoxObserver = new Map();
  #accountControlsAndSettingsSelector =
    'div[aria-label="Account Controls and Settings"][role="navigation"].x6s0dn4.x78zum5.x1s65kcs.x1n2onr6.x1ja2u2z';
  #messengerControlSelector = '[aria-label="Messenger"]';
  #chatSelector =
    'div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq';
  #messengerChatContainerSelector = `div.x78zum5.xdt5ytf.x1iyjqo2.x1t2pt76.xeuugli.x1n2onr6.x1ja2u2z.x1vhhd5d:has(${
    this.#chatSelector
  })`;
  #chatBoxContainerSelector = 'div.x1ey2m1c.x78zum5.xixxii4.x1vjfegm';
  #chatBoxContainerContainerSelector =
    '[id^="mount"] > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div[data-visualcompletion="ignore"]';
  #labeledMessageGridSelector = '[aria-label^="Messages in conversation"]';
  #messageGridSelector = `${
    this.#labeledMessageGridSelector
  }, div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62`;
  #chatBubbleSelector =
    '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm';
  #messageSelector = '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h';
  #gridcellContainerSelector =
    'div.x1qjc9v5.x9f619.xdl72j9.x2lwn1j.xeuugli.x1n2onr6.x78zum5.xdt5ytf.x1iyjqo2.xs83m0k.x6ikm8r.x10wlt62.x1ja2u2z > div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x1odjw0f.xish69e.x16o0dkt > div.x78zum5.xdt5ytf.x1iyjqo2.x2lah0s.xl56j7k.x121v3j4';
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
            // console.log(`waiting for grids to be labeled`);
            setTimeout(waitForGridsToBeLabeled, 100);
          } else {
            // console.log(`grids are labeled`);
            const max = inChatBoxContainerObserver
              ? mutation.addedNodes.length
              : this.#chatBoxContainer.children.length;
            for (let i = 0; i < max; i++) {
              const chatBox = this.#chatBoxContainer.children[i];
              if (!chatBox.firstChild.firstChild.hasAttribute('hidden')) {
                this.setMessageGrid(0, chatBox);
                if (!this.#chatBoxToLabel.has(chatBox)) {
                  this.markMostRecentMessage(chatBox);

                  const labeledMessageGrid = chatBox.querySelector(
                    this.#labeledMessageGridSelector
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

  getChatBoxContainerContainer() {
    return this.#chatBoxContainerContainer;
  }

  setChatBoxContainerContainer() {
    this.#chatBoxContainerContainer = document.querySelector(
      this.#chatBoxContainerContainerSelector
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

  markMostRecentMessage(gridcellSource = this.#chat) {
    let gridcellContainer = gridcellSource.querySelector(
      this.#gridcellContainerSelector
    );
    // console.log(`gridcellContainer:`);
    // console.log(gridcellContainer);
    if (gridcellContainer === null) {
      // console.log(`setting gridcellContainer to gridcellSource, i.e., to:`);
      // console.log(gridcellSource);
      gridcellContainer = gridcellSource;
    }

    const waitForMessagesToAppear = () => {
      if (gridcellContainer.children.length < 2) {
        // console.log(`waiting for messages to appear`);
        setTimeout(waitForMessagesToAppear, 100);
      } else {
        const waitForBareGridcell = () => {
          // console.log(`gridcellContainer.children[
          //     gridcellContainer.children.length - 1
          //   ]:`);
          // console.log(
          //   gridcellContainer.children[gridcellContainer.children.length - 1]
          // );
          const mostRecentMessage =
            gridcellContainer.children[gridcellContainer.children.length - 1];
          // console.log(`mostRecentMessage:`);
          // console.log(mostRecentMessage);
          if (mostRecentMessage.hasAttribute('role')) {
            // console.log(`waiting for bare gridcell`);
            setTimeout(waitForBareGridcell, 100);
          } else {
            // console.log(`bare gridcell detected:`);
            // console.log(mostRecentMessage);
            const finalOldMessage = gridcellContainer.querySelector(
              '.old-messages-end-here'
            );
            if (finalOldMessage !== null) {
              // console.log(
              //   `removing class from finalOldMessage (or what used to be the final one):`
              // );
              // console.log(finalOldMessage);
              finalOldMessage.removeAttribute('class');
            }
            // console.log(
            //   `${gridcellContainer.children.length - 1} messages have appeared`
            // );
            mostRecentMessage.classList.add('old-messages-end-here');

            // const date = new Date();
            // mostRecentMessage.classList.add(
            //   `ms-since-1970-began:${date.getTime()}`
            // );
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
      // console.log(
      //   `chat bubble observer detected the addition of ${mutation.addedNodes.length} nodes:`
      // );
      mutation.addedNodes.forEach((node) => {
        // console.log(node);
        // const date = new Date();
        this.handleChatBubbles(node /*, date.getTime()*/);
      });
    });
  };

  observeChatBubbles(i = 0) {
    const observer = new MutationObserver(this.#chatBubbleMutationHandler);

    const grid = this.#messageGrids[i];
    if (grid !== null) {
      observer.observe(grid, {
        childList: true,
        subtree: true,
      });

      const label = grid.getAttribute('aria-label');
      this.#labelToBubbleObserver.set(label, observer);
    }
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

  isNewMessage(bubble /*, timeBubbleAdded*/) {
    const gridcell = this.findGridcell(bubble);
    if (gridcell === null) {
      // console.log(`gridcell is null`);
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
    // console.log(`finalOldMessage:`);
    // console.log(finalOldMessage);
    const finalOldMessagePos = gridcells.indexOf(finalOldMessage);
    // console.log(`finalOldMessagePos = ${finalOldMessagePos}`);
    // let finalOldMessageTime;
    // for (const item of finalOldMessage.classList) {
    //   if (item.startsWith('ms-since-1970-began')) {
    //     finalOldMessageTime = parseInt(item.substring(20));
    //     break;
    //   }
    // }

    console.log(`bubble:`);
    console.log(bubble);
    console.log(`finalOldMessage:`);
    console.log(finalOldMessage);
    // console.log(
    //   `finalOldMessageTime = ${finalOldMessageTime}, timeBubbleAdded = ${timeBubbleAdded}`
    // );

    // if (timeBubbleAdded === -1) {
    return gridcellPos > finalOldMessagePos;
    // } else {
    //   return (
    //     gridcellPos > finalOldMessagePos ||
    //     finalOldMessageTime < timeBubbleAdded
    //   );
    // }
  }

  handleChatBubbles(bubbleSource /*, timeNodeAdded = -1*/) {
    const bubbleHandler = (source /*, timeAdded*/) => {
      if (source && 'querySelectorAll' in source) {
        const chatBubbles = source.querySelectorAll(this.#chatBubbleSelector);
        // console.log(`${chatBubbles.length} chat bubbles found:`);
        chatBubbles.forEach((bubble) => {
          // console.log(bubble);
          const waitForCompleteMessage = (txt) => {
            // const userBubble = bubble.querySelector(
            //   'div > [role="presentation"].html-div > div.x78zum5.xdt5ytf.x193iq5w.x1n2onr6.x1kxipp6.xuk3077'
            // );

            // setTimeout(() => {
            //   if (bubble.textContent !== txt) {
            setTimeout(
              () => {
                if (bubble.textContent !== txt) {
                  // console.log(`waiting for complete message`);
                  waitForCompleteMessage(bubble.textContent);
                } else {
                  // console.log(`message complete`);
                  // console.log(`new message:`);
                  // console.log(bubble);
                  this.parseContent(bubble);
                  // // setTimeout(() => {
                  // //   this.parseContent(bubble);

                  // const waitForParsingToStabilize = () => {
                  //   const msg = bubble.querySelector(this.#messageSelector);
                  //   let texBounds;

                  //   if (msg !== null && msg.textContent !== '') {
                  //     texBounds = getTexBounds(msg);
                  //   }

                  //   if (texBounds !== undefined && texBounds.length) {
                  //     console.log(
                  //       `waiting for parsing to stabilize; problematic bubble:`
                  //     );
                  //     console.log(bubble);
                  //     setTimeout(() => {
                  //       this.parseContent(bubble);
                  //       waitForParsingToStabilize();
                  //     }, 2000);
                  //   } else {
                  //     console.log(`stably parsed the following bubble:`);
                  //     console.log(bubble);
                  setTimeout(() => {
                    const gridcell = this.findGridcell(bubble);
                    if (gridcell !== null) {
                      const gridcellContainer = gridcell.parentNode;
                      this.markMostRecentMessage(gridcellContainer);
                    }
                  }, 4000);
                  //   }
                  // };
                  // waitForParsingToStabilize();
                  // // }, 2000);
                }
              },
              // userBubble === null ? 2000 : /*300*/ 1500
              2000
            );
            //   } else {
            //     this.parseContent(bubble);
            //   }
            // }, 300);
          };
          if (bubble.textContent === '') {
            let lengthOfWait = 0;
            const waitToParseContent = () => {
              if (
                bubble.textContent === '' ||
                bubble.querySelector(this.#messageSelector) === null
              ) {
                // console.log(`waiting to parse content`);
                setTimeout(() => {
                  if ((lengthOfWait += 100) < 5000) {
                    waitToParseContent();
                  }
                }, 100);
              } else {
                // console.log(`parsing content`);
                if (this.isNewMessage(bubble /*, timeAdded*/)) {
                  // console.log(`this message is new:`);
                  // console.log(bubble);
                  waitForCompleteMessage(bubble.textContent);
                } else {
                  // console.log(`this bubble is old`);
                  // console.log(bubble);
                  this.parseContent(bubble);
                }
              }
            };
            waitToParseContent();
          } else {
            // console.log(`NOT waiting to parse content`);
            if (this.isNewMessage(bubble /*, timeAdded*/)) {
              // console.log(`this message is new:`);
              // console.log(bubble);
              waitForCompleteMessage(bubble.textContent);
            } else {
              // console.log(`this bubble is old:`);
              // console.log(bubble);
              this.parseContent(bubble);
            }
          }
        });
      }
    };

    if (arguments.length === 0) {
      bubbleHandler(this.#messageGrids[0] /*, timeNodeAdded*/);
    }
    if (arguments.length === 1 /*|| arguments.length === 2*/) {
      bubbleHandler(bubbleSource /*, timeNodeAdded*/);
    }
  }

  getChatBoxToLabel() {
    return this.#chatBoxToLabel;
  }

  setChatBoxToLabel() {
    for (const chatBox of this.#chatBoxContainer.children) {
      const messageGridLabel = chatBox
        .querySelector(this.#labeledMessageGridSelector)
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
          this.#labeledMessageGridSelector
        );
        const messageGridLabel = labeledGrid
          ? labeledGrid.getAttribute('aria-label')
          : null;

        if (mutation.target.hasAttribute('hidden')) {
          // console.log(`chat box concealed`);
          const bubbleObserver =
            this.#labelToBubbleObserver.get(messageGridLabel);
          if (bubbleObserver !== undefined) {
            bubbleObserver.disconnect();
          }
        } else {
          // console.log(`chat box UNconcealed`);
          this.setMessageGrid(0, mutation.target);
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
        .querySelector(this.#labeledMessageGridSelector)
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
  }
}

const isOfTheClasses = (node, theCs) => {
  for (const c of theCs) {
    if (node === null || !'classList' in node || !node.classList.contains(c)) {
      return false;
    }
  }
  return true;
};

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
        const label = domInfo.getChatBoxToLabel().get(chat);
        if (label === null || !domInfo.getLabelToBubbleObserver().has(label)) {
          domInfo.handleChatBubbles();
          domInfo.observeChatBubbles();
        }
        // else {
        //   console.log(`'${label}' is already mapped to a bubble observer`);
        // }
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
        domInfo.setChatBoxContainerContainer();
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
