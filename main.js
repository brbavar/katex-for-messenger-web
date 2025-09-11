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
  #escapeCharIndices = [];
  // #escapeCharIndices = new Set();
  #chatBoxToLabel = new Map();
  #labelToBubbleObserver = new Map();
  #labelToChatBoxObserver = new Map();
  #mountSelector = 'div[id^="mount"]';
  #accountControlsAndSettingsSelector =
    'div[aria-label="Account Controls and Settings"][role="navigation"].x6s0dn4.x78zum5.x1s65kcs.x1n2onr6.x1ja2u2z';
  #messengerControlSelector = '[aria-label="Messenger"]';
  #chatSelector =
    'div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq';
  #messengerChatContainerSelector = `div.x78zum5.xdt5ytf.x1iyjqo2.x1t2pt76.xeuugli.x1n2onr6.x1ja2u2z.x1vhhd5d:has(${
    this.#chatSelector
  })`;
  #messengerChatContainerContainerSelector =
    '.x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.xs83m0k.xjhlixk.xgyuaek';
  #chatBoxContainerSelector = 'div.x1ey2m1c.x78zum5.xixxii4.x1vjfegm';
  #chatBoxContainerContainerSelector = `${
    this.#mountSelector
  } > div > div > div.x9f619.x1n2onr6.x1ja2u2z > div[data-visualcompletion="ignore"]`;
  #labeledMessageGridSelector = '[aria-label^="Messages in conversation"]';
  #messageGridSelector = `${
    this.#labeledMessageGridSelector
  }, div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62`;
  #chatBubbleSelector =
    '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm';
  // #simpleMessageSelector =
  //   '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h';
  // #complexMessageSelector =
  //   'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u';
  // #complexMessageSelector =
  //   'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xzsf02u';
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

  #messengerChatContainerContainerObserver = new ResizeObserver(() => {
    if (
      this.#messengerChatContainerContainer.getBoundingClientRect().width !==
      this.#messengerChatContainerContainerWidth
    ) {
      this.#messengerChatContainerContainerWidth =
        this.#messengerChatContainerContainer.getBoundingClientRect().width;

      this.#messageGrid.querySelectorAll('span.renderable').forEach((span) => {
        removeLineBreaks(span);
        insertLineBreaks(span);
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

  getMount() {
    return this.#mount;
  }

  setMount() {
    this.#mount = document.querySelector(this.#mountSelector);
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
    this.#messengerChatContainer =
      this.#messengerChatContainerContainer.querySelector(
        this.#messengerChatContainerSelector
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
      this.#messengerChatContainerContainerSelector
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

  getMessageGrid() {
    return this.#messageGrid;
  }

  setMessageGrid(pointOfReference = this.#chat) {
    let grid = pointOfReference.querySelector(this.#labeledMessageGridSelector);
    // Conditional statement below may be unnecessary
    if (grid === null) {
      grid = pointOfReference.querySelector(this.#messageGridSelector);
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
      this.#gridcellContainerSelector
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

  parseContent(bubble) {
    let msgParts = [];
    // const complexMsg = bubble.querySelector(this.#complexMessageSelector);
    // if (complexMsg === null) {
    //   msgParts.push(bubble.querySelector(this.#simpleMessageSelector));
    // } else {
    //   for (const div of complexMsg.children) {
    //     for (const msgPart of div.children) {
    //       msgParts.push(msgPart);
    //     }
    //   }
    // }
    const wrapTextNodes = (root) => {
      // console.log(`finding text nodes`);
      // console.log(`root:`);
      // console.log(root);
      for (const node of root.childNodes) {
        // console.log(`node.nodeName = ${node.nodeName}`);
        // console.log(`typeof node = ${typeof node}`);
        // console.log(`node.constructor.name = ${node.constructor.name}`);
        // if (node.nodeName !== 'code') {
        if (node.nodeName !== 'CODE') {
          // if (typeof node === 'Text') {
          if (node.constructor.name === 'Text') {
            // msgParts.push(node);
            const span = document.createElement('span');
            span.textContent = node.textContent;
            node.parentNode.insertBefore(span, node);
            node.remove();

            msgParts.push(span);
          } else {
            // if (node.childNodes.length > 0) {
            wrapTextNodes(node);
            // }
          }
        }
      }
    };
    wrapTextNodes(bubble);

    for (const msgPart of msgParts) {
      let texBounds;

      if (msgPart !== null && msgPart.textContent !== '') {
        texBounds = this.getTexBounds(msgPart);
      }

      if (texBounds !== undefined && texBounds.length) {
        // console.log(`texBounds.length = ${texBounds.length}`);
        // console.log(`msgPart.textContent = ${msgPart.textContent}`);

        const outerEscapeCharIndices = [];
        // const outerEscapeCharIndices = new Set();
        for (let i = 0; i < this.#escapeCharIndices.length; i++) {
          for (let j = 0; j < texBounds.length; j++) {
            // console.log(
            //   `this.#escapeCharIndices[${i}] = ${this.#escapeCharIndices[i]}`
            // );
            // console.log(
            //   `texBounds[${j}][0] = ${texBounds[j][0]}, texBounds[${j}][1] = ${texBounds[j][1]}`
            // );
            if (
              this.#escapeCharIndices[i] > texBounds[j][0] &&
              this.#escapeCharIndices[i] < texBounds[j][1]
            ) {
              break;
            } else {
              if (j === texBounds.length - 1) {
                // this.#escapeCharIndices.splice(i, 1);
                if (
                  !outerEscapeCharIndices.includes(this.#escapeCharIndices[i])
                ) {
                  outerEscapeCharIndices.push(this.#escapeCharIndices[i]);
                }
                // outerEscapeCharIndices.add(this.#escapeCharIndices[i]);
              }
            }
          }
        }
        // console.log(`this.#escapeCharIndices:`);
        // console.log(this.#escapeCharIndices);
        this.#escapeCharIndices.length = 0;
        // this.#escapeCharIndices.clear();

        // for (const i of outerEscapeCharIndices) {
        //   console.log(
        //     `i = ${i}, msgPart.textContent[${i}] = ${msgPart.textContent[i]}`
        //   );
        //   // msgPart.textContent.splice(i, 1);
        //   msgPart.textContent = `${msgPart.textContent.substring(
        //     0,
        //     i
        //   )}${msgPart.textContent.substring(i)}`;
        //   for (let j = 0; j < texBounds.length; j++) {
        //     for (let k = 0; k < 2; k++) {
        //       if (texBounds[j][k] > i) {
        //         texBounds[j][k]--;
        //       }
        //     }
        //   }
        // }
        // console.log(`outerEscapeCharIndices:`);
        // console.log(outerEscapeCharIndices);
        for (let i = 0; i < outerEscapeCharIndices.length; i++) {
          // console.log(
          //   `i = ${i}, msgPart.textContent[${outerEscapeCharIndices[i]}] = ${
          //     msgPart.textContent[outerEscapeCharIndices[i]]
          //   }`
          // );
          // msgPart.textContent.splice(i, 1);
          msgPart.textContent = `${msgPart.textContent.substring(
            0,
            outerEscapeCharIndices[i]
          )}${msgPart.textContent.substring(outerEscapeCharIndices[i] + 1)}`;
          for (let j = 0; j < texBounds.length; j++) {
            for (let k = 0; k < 2; k++) {
              if (texBounds[j][k] > outerEscapeCharIndices[i]) {
                texBounds[j][k]--;
              }
            }
          }

          // // for (let j = 0; j < outerEscapeCharIndices.length; j++) {
          // //   if (outerEscapeCharIndices[i] < outerEscapeCharIndices[j]) {
          // //     outerEscapeCharIndices[j]--;
          // //   }
          // // }

          // // Assume the elements of outerEscapeCharIndices are in ascending order
          // for (let j = i + 1; j < outerEscapeCharIndices.length; j++) {
          //   // if (outerEscapeCharIndices[i] < outerEscapeCharIndices[j]) {
          //   outerEscapeCharIndices[j]--;
          //   // }
          // }

          // Never mind. Don't assume that.
          for (let j = i + 1; j < outerEscapeCharIndices.length; j++) {
            if (outerEscapeCharIndices[i] < outerEscapeCharIndices[j]) {
              outerEscapeCharIndices[j]--;
            }
          }
        }

        for (let i = 0; i < texBounds.length; i++) {
          const offset = 32 * i;
          const delimLen =
            msgPart.textContent[texBounds[i][0] + offset] === '$' &&
            msgPart.textContent[texBounds[i][0] + offset + 1] !== '$'
              ? 1
              : 2;

          msgPart.textContent = `${msgPart.textContent.substring(
            0,
            texBounds[i][0] + offset
          )}<span class='renderable'>${msgPart.textContent.substring(
            texBounds[i][0] + offset,
            texBounds[i][1] + delimLen + offset
          )}</span>${msgPart.textContent.substring(
            texBounds[i][1] + delimLen + offset
          )}`;
        }

        // if (msgPart.parentNode !== null) {
        // console.log(`msgPart.textContent = ${msgPart.textContent}`);
        // console.log(`msgPart.innerHTML before = ${msgPart.innerHTML}`);
        // console.log(
        //   `msgPart.parentNode.innerHTML before = ${msgPart.parentNode.innerHTML}`
        // );
        // console.log(
        //   `msgPart.parentElement.innerHTML before = ${msgPart.parentElement.innerHTML}`
        // );

        msgPart.innerHTML = msgPart.textContent;
        // msgPart.parentNode.innerHTML = msgPart.textContent;
        // msgPart.parentNode.innerHTML = msgPart.parentNode.textContent;

        // console.log(`msgPart.innerHTML after = ${msgPart.innerHTML}`);

        msgPart.querySelectorAll('span.renderable').forEach((span) => {
          try {
            const hasDollarDelim = span.textContent[0] === '$';
            const hasSingleDollarDelim =
              hasDollarDelim && span.textContent[1] !== '$';
            const delimLen = hasSingleDollarDelim ? 1 : 2;

            katex.render(
              span.textContent.substring(
                delimLen,
                span.textContent.length - delimLen
              ),
              span,
              {
                displayMode:
                  (hasDollarDelim && !hasSingleDollarDelim) ||
                  span.textContent[1] === '[',
              }
            );
          } catch (error) {
            console.error('Caught ' + error);
          }

          insertLineBreaks(span);
        });
        // }
        // const waitForParent = () => {
        //   if (msgPart.parentNode === null) {
        //     console.log(`waiting for parent...`);
        //     setTimeout(waitForParent, 100);
        //   } else {
        //     console.log(`parent ready!`);
        //     // console.log(`msgPart.innerHTML after = ${msgPart.innerHTML}`);
        //     console.log(
        //       `msgPart.parentNode.innerHTML after = ${msgPart.parentNode.innerHTML}`
        //     );

        //     // msgPart.querySelectorAll('span.renderable').forEach((span) => {
        //     msgPart.parentNode
        //       .querySelectorAll('span.renderable')
        //       .forEach((span) => {
        //         try {
        //           const hasDollarDelim = span.textContent[0] === '$';
        //           const hasSingleDollarDelim =
        //             hasDollarDelim && span.textContent[1] !== '$';
        //           const delimLen = hasSingleDollarDelim ? 1 : 2;

        //           katex.render(
        //             span.textContent.substring(
        //               delimLen,
        //               span.textContent.length - delimLen
        //             ),
        //             span,
        //             {
        //               displayMode:
        //                 (hasDollarDelim && !hasSingleDollarDelim) ||
        //                 span.textContent[1] === '[',
        //             }
        //           );
        //         } catch (error) {
        //           console.error('Caught ' + error);
        //         }

        //         insertLineBreaks(span);
        //       });
        //   }
        // };
        // waitForParent();
      } else {
        // console.log(`this.#escapeCharIndices:`);
        // console.log(this.#escapeCharIndices);
        // // // for (let i = 0; i < this.#escapeCharIndices.length; i++) {
        // // for (let i = 0; i < this.#escapeCharIndices.size; i++) {
        // //   console.log(
        // //     `i = ${i}, msgPart.textContent[${this.#escapeCharIndices[i]}] = ${
        // //       msgPart.textContent[this.#escapeCharIndices[i]]
        // //     }`
        // //   );
        // //   // msgPart.textContent.splice(i, 1);
        // //   msgPart.textContent = `${msgPart.textContent.substring(
        // //     0,
        // //     this.#escapeCharIndices[i]
        // //   )}${msgPart.textContent.substring(this.#escapeCharIndices[i] + 1)}`;

        // //   for (let j = i + 1; j < this.#escapeCharIndices.length; j++) {
        // //     if (this.#escapeCharIndices[i] < this.#escapeCharIndices[j]) {
        // //       this.#escapeCharIndices[j]--;
        // //     }
        // //   }
        // // }
        // for (const i of this.#escapeCharIndices.keys()) {
        //   console.log(
        //     `i = ${i}, msgPart.textContent[${i}] = ${msgPart.textContent[i]}`
        //   );
        //   // msgPart.textContent.splice(i, 1);
        //   msgPart.textContent = `${msgPart.textContent.substring(
        //     0,
        //     i
        //   )}${msgPart.textContent.substring(i + 1)}`;

        //   const newEscapeCharIndices = new Set();
        //   for (const j of this.#escapeCharIndices.keys()) {
        //     newEscapeCharIndices.add(j - (i < j ? 1 : 0));
        //   }
        //   this.#escapeCharIndices = newEscapeCharIndices;
        // }
        for (let i = 0; i < this.#escapeCharIndices.length; i++) {
          // console.log(
          //   `i = ${i}, msgPart.textContent[${this.#escapeCharIndices[i]}] = ${
          //     msgPart.textContent[this.#escapeCharIndices[i]]
          //   }`
          // );
          // msgPart.textContent.splice(i, 1);
          msgPart.textContent = `${msgPart.textContent.substring(
            0,
            this.#escapeCharIndices[i]
          )}${msgPart.textContent.substring(this.#escapeCharIndices[i] + 1)}`;

          for (let j = i + 1; j < this.#escapeCharIndices.length; j++) {
            if (this.#escapeCharIndices[i] < this.#escapeCharIndices[j]) {
              this.#escapeCharIndices[j]--;
            }
          }
        }

        // this.#escapeCharIndices.clear();
        this.#escapeCharIndices.length = 0;
      }
    }
  }

  getTexBounds(msg) {
    const txt = msg.textContent;
    const bounds = [];
    // console.log(`msg:`);
    // console.log(msg);
    // console.log(`msg.textContent.length = ${msg.textContent.length}`);
    // for (let i = 0; i < msg.textContent.length; i++) {
    //   console.log(`msg.textContent[${i}] = ${msg.textContent[i]}`);
    // }

    const delimAt = (i) => {
      let delim = '';
      if ((txt[i] === '$' || txt[i] === '\\') && i > 0 && txt[i - 1] === '\\') {
        this.#escapeCharIndices.push(i - 1);
        // this.#escapeCharIndices.add(i - 1);
      } else {
        if (txt[i] === '$' /*&& (i === 0 || txt[i - 1] !== '\\')*/) {
          delim += '$';
          if (txt[i + 1] === '$') {
            delim += '$';
          }
        }
        // else {
        if (txt[i] === '\\' /*&& (i === 0 || txt[i - 1] !== '\\')*/) {
          if (
            txt[i + 1] === '(' ||
            txt[i + 1] === ')' ||
            txt[i + 1] === '[' ||
            txt[i + 1] === ']'
          ) {
            delim = `${txt[i]}${txt[i + 1]}`;
          }
        }
        // }
      }
      return delim;
    };

    const isOpeningDelim = (delim) => {
      if (delim.length === 0) {
        return false;
      }
      return delim[0] === '$' || delim[1] === '(' || delim[1] === '[';
    };

    const pairsWith = (delim1, delim2) => {
      if (delim1[0] === '$') {
        return delim1 === delim2;
      } else {
        if (delim1[1] === '(') {
          return delim2[1] === ')';
        }
        if (delim1[1] === '[') {
          return delim2[1] === ']';
        }
      }
      return false;
    };

    let l = 0,
      r = 0;
    while (l < txt.length) {
      let leftDelim = delimAt(l);
      let rightDelim;
      // console.log(`delimAt(${l}) = ${delimAt(l)}`);
      if (isOpeningDelim(leftDelim)) {
        r = l + 2;
        rightDelim = delimAt(r);

        while (r + 1 < txt.length && !pairsWith(leftDelim, rightDelim)) {
          if (leftDelim === rightDelim) {
            l = r;
            r += 2;
            leftDelim = delimAt(l);
            rightDelim = delimAt(r);
          } else {
            rightDelim = delimAt(++r);
          }
        }

        if (pairsWith(leftDelim, rightDelim)) {
          bounds.push([l, r]);
        }
      }

      if (bounds.length === 0 || l > bounds[bounds.length - 1][1]) {
        l++;
      } else {
        l = bounds[bounds.length - 1][1] + rightDelim.length;
      }
    }

    return bounds;
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
        const chatBubbles = source.querySelectorAll(this.#chatBubbleSelector);
        chatBubbles.forEach((bubble) => {
          console.log(`bubble:`);
          console.log(bubble);
          const waitForCompleteMessage = (txt) => {
            setTimeout(() => {
              if (bubble.textContent !== txt) {
                console.log(`waiting for complete message...`);
                waitForCompleteMessage(bubble.textContent);
              } else {
                console.log(`message complete!`);
                this.parseContent(bubble);

                setTimeout(() => {
                  const gridcell = this.findGridcell(bubble);
                  if (gridcell !== null) {
                    const gridcellContainer = gridcell.parentNode;
                    this.markMostRecentMessage(gridcellContainer);
                  }
                }, /*4000*/ /*6000*/ 8000);
              }
            }, /*2000*/ /*3000*/ 4000);
          };
          if (bubble.textContent === '') {
            let lengthOfWait = 0;
            const waitToParseContent = () => {
              // if (
              //   bubble.textContent === '' ||
              //   bubble.querySelector(
              //     `${this.#simpleMessageSelector}, ${
              //       this.#complexMessageSelector
              //     }`
              //   ) === null
              // ) {
              if (
                bubble.textContent === '' ||
                this.getTexBounds(bubble).length > 0
              ) {
                setTimeout(() => {
                  if ((lengthOfWait += 100) < 5000) {
                    waitToParseContent();
                  }
                }, 100);
              } else {
                if (this.isNewMessage(bubble)) {
                  waitForCompleteMessage(bubble.textContent);
                } else {
                  this.parseContent(bubble);
                }
              }
            };
            waitToParseContent();
          } else {
            if (this.isNewMessage(bubble)) {
              waitForCompleteMessage(bubble.textContent);
            } else {
              this.parseContent(bubble);
            }
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

    if (this.#messengerChatContainerContainer !== null) {
      // console.log(`unobserving container container`);
      this.#messengerChatContainerContainerObserver.unobserve(
        this.#messengerChatContainerContainer
      );
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

const insertLineBreaks = (span) => {
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
          partialSumOfSpanWidths - baseSpans[i].getBoundingClientRect().width <=
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
};

const removeLineBreaks = (span) => {
  span.querySelectorAll('div').forEach((div) => {
    if (div.style.margin === '10px 0px' && div.attributes.length === 1) {
      div.remove();
    }
  });
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
