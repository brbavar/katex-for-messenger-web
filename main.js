class DomInfo {
  #accountControlsAndSettings = null;
  #chat = null;
  #messengerChatContainer = null;
  #chatBoxContainer = null;
  #chatBoxContainerContainer = null;
  // #moreActionsMenuContainer = null;
  #messageGrid = null;
  #gridcellContainer = null;
  // #editorContainers = [];
  // #editorContainerObservers = [];
  #chatBoxToId = new Map();
  #idToChatBoxObserver = new Map();
  #cellIdToObserver = new Map();
  #gridcellContainerToObserver = new Map();
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
  // #chatTitleSelector =
  //   'div[aria-label="Chat settings"][role="button"] [dir="auto"].html-h2 > span > span > span';
  #labeledMessageGridSelector = '[aria-label^="Messages in conversation"]';
  #messageGridSelector = `${
    this.#labeledMessageGridSelector
  }, div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62`;
  #chatBubbleSelector =
    '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm';
  #messageSelector = '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h';
  #sendStatusSelector =
    '.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa';
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
          const loneEntry = this.#gridcellContainerToObserver
            .entries()
            .next().value;
          loneEntry[1].disconnect();
          this.#gridcellContainerToObserver.delete(loneEntry[0]);

          // TODO: if needed, disconnect other observers and delete associated map entries

          this.#chat = convo;
          this.setMessageGrid();
          this.activateRendering();
        }
      });
    });
  });

  #chatBoxContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // Condition below may be superfluous
        if (!node.firstChild.firstChild.hasAttribute('hidden')) {
          this.setMessageGrid(node);
          if (this.#messageGrid !== null) {
            const waitForGridsToBeLabeled = () => {
              if (!this.messageGridsLabeled()) {
                setTimeout(waitForGridsToBeLabeled, 100);
              } else {
                // // this.assignGridsIds();

                // // const labeledGrid = node.querySelector(
                // //   this.#labeledMessageGridSelector
                // // );
                // // const messageGridId = labeledGrid ? labeledGrid.id : null;

                // if (
                //   // !Array.from(this.#chatBoxToId.values()).includes(
                //   //   messageGridId
                //   // ) ||
                //   !this.#chatBoxToId.has(node)
                // ) {
                //   const labeledMessageGrid = node.querySelector(
                //     this.#labeledMessageGridSelector
                //   );
                //   // const messageGridId = labeledGrid ? labeledGrid.id : null;

                //   console.log(
                //     `chat box with label ${labeledMessageGrid.getAttribute(
                //       'aria-label'
                //     )} not yet mapped to id; labeledMessageGrid.id = ${
                //       labeledMessageGrid.id
                //     }`
                //   );

                //   this.#chatBoxToId.set(node, labeledMessageGrid.id);

                //   // if (!this.#chatBoxToId.has(node)) {
                //   if (this.#idToChatBoxObserver.has(labeledMessageGrid.id)) {
                //     this.#idToChatBoxObserver
                //       .get(labeledMessageGrid.id)
                //       .disconnect();
                //   }

                //   if (
                //     this.#gridcellContainerToObserver.has(
                //       this.#gridcellContainer
                //     )
                //   ) {
                //     this.#gridcellContainerToObserver
                //       .get(this.#gridcellContainer)
                //       .disconnect();
                //   }
                //   // }

                //   const visibilityObserver = new MutationObserver(
                //     this.#chatBoxVisibilityMutationHandler
                //   );
                //   visibilityObserver.observe(node.firstChild.firstChild, {
                //     attributes: true,
                //   });
                //   this.#idToChatBoxObserver.set(
                //     labeledMessageGrid.id,
                //     visibilityObserver
                //   );

                //   // this.#chatBoxToId.set(node, labeledMessageGrid.id;
                //   this.activateRendering();
                // }
                this.prepareChatBoxForRendering(node);
              }
            };
            waitForGridsToBeLabeled();
          }
        }
      });
    });
  });

  #chatBoxContainerContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        this.setChatBoxContainer();

        if (this.#chatBoxContainer !== null) {
          const waitForGridsToBeLabeled = () => {
            if (!this.messageGridsLabeled()) {
              setTimeout(waitForGridsToBeLabeled, 100);
            } else {
              // this.assignGridsIds();

              for (const chatBox of this.#chatBoxContainer.children) {
                if (!chatBox.firstChild.firstChild.hasAttribute('hidden')) {
                  this.setMessageGrid(chatBox);
                  // if (!this.#chatBoxToId.has(chatBox)) {
                  //   const labeledMessageGrid = chatBox.querySelector(
                  //     this.#labeledMessageGridSelector
                  //   );
                  //   // const messageGridId = labeledMessageGrid.id;

                  //   console.log(
                  //     `chat box with label ${labeledMessageGrid.getAttribute(
                  //       'aria-label'
                  //     )} not yet mapped to id; labeledMessageGrid.id = ${
                  //       labeledMessageGrid.id
                  //     }`
                  //   );

                  //   this.#chatBoxToId.set(chatBox, labeledMessageGrid.id);

                  //   if (this.#idToChatBoxObserver.has(labeledMessageGrid.id)) {
                  //     this.#idToChatBoxObserver
                  //       .get(labeledMessageGrid.id)
                  //       .disconnect();
                  //   }

                  //   if (
                  //     this.#gridcellContainerToObserver.has(
                  //       this.#gridcellContainer
                  //     )
                  //   ) {
                  //     this.#gridcellContainerToObserver
                  //       .get(this.#gridcellContainer)
                  //       .disconnect();
                  //   }

                  //   const visibilityObserver = new MutationObserver(
                  //     this.#chatBoxVisibilityMutationHandler
                  //   );
                  //   visibilityObserver.observe(chatBox.firstChild.firstChild, {
                  //     attributes: true,
                  //   });
                  //   this.#idToChatBoxObserver.set(
                  //     labeledMessageGrid.id,
                  //     visibilityObserver
                  //   );

                  //   this.observeGridcells();
                  //   this.observeGridcellContainer();
                  // }
                  this.prepareChatBoxForRendering(chatBox, false);
                }
              }
            }
          };
          waitForGridsToBeLabeled();
        }
        this.observeChatBoxContainer();
      }
    });
  });

  prepareChatBoxForRendering(chatBox, isActive = true) {
    if (!this.#chatBoxToId.has(chatBox)) {
      const labeledMessageGrid = chatBox.querySelector(
        this.#labeledMessageGridSelector
      );

      console.log(
        `chat box with label ${labeledMessageGrid.getAttribute(
          'aria-label'
        )} not yet mapped to id; labeledMessageGrid.id = ${
          labeledMessageGrid.id
        }`
      );

      this.#chatBoxToId.set(chatBox, labeledMessageGrid.id);

      if (this.#idToChatBoxObserver.has(labeledMessageGrid.id)) {
        this.#idToChatBoxObserver.get(labeledMessageGrid.id).disconnect();
      }

      if (this.#gridcellContainerToObserver.has(this.#gridcellContainer)) {
        this.#gridcellContainerToObserver
          .get(this.#gridcellContainer)
          .disconnect();
      }

      const visibilityObserver = new MutationObserver(
        this.#chatBoxVisibilityMutationHandler
      );
      visibilityObserver.observe(chatBox.firstChild.firstChild, {
        attributes: true,
      });
      this.#idToChatBoxObserver.set(labeledMessageGrid.id, visibilityObserver);

      if (isActive) {
        this.handleChatBubbles();
      }
      this.observeGridcells();
      this.observeGridcellContainer();
    }
  }

  #gridcellMutationHandler = (mutations) => {
    // if (!this.cellsHaveIds()) {
    //   // console.log(`cells do NOT have IDs`);
    //   const cellAncestors = this.#gridcellContainer.children;
    //   const numCells = cellAncestors.length;
    //   for (let i = 1; i < numCells; i++) {
    //     const cell = cellAncestors[i].firstChild.firstChild;
    //     if (!cell.hasAttribute('id')) {
    //       cell.id = `cell${i - 1}:${this.#messageGrid.id}`;
    //       // console.log(`cell id = ${cell.id}`);
    //     }
    //   }
    // }
    // // else {
    // //   const cellAncestors = this.#gridcellContainer.children;
    // //   const numCells = cellAncestors.length;
    // //   for (let i = 1; i < numCells; i++) {
    // //     const cell = cellAncestors[i].firstChild.firstChild;
    // //     console.log(cell);
    // //   }
    // // }

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if ('querySelector' in node) {
          const chatBubble = node.querySelector(this.#chatBubbleSelector);
          if (chatBubble !== null) {
            this.parseContent(chatBubble);
            // this.ensureParsed(chatBubble);
          }
        }
      });
    });
  };

  cellsHaveIds() {
    for (const child of this.#gridcellContainer.children) {
      const cell = child.firstChild.firstChild;
      if (cell.hasAttribute('id')) {
        return true;
      }
    }
    return false;
  }

  #gridcellContainerMutationHandler = (mutations) => {
    const addedNodes = [];
    mutations.forEach((mutation) => {
      for (const node of mutation.addedNodes) {
        addedNodes.push(node);
      }
    });

    if (this.cellsHaveIds()) {
      if (addedNodes.length > 0) {
        let sibling = null;
        let siblingIdNum = 0;
        if (
          addedNodes[addedNodes.length - 1].nextSibling !== undefined &&
          addedNodes[addedNodes.length - 1].nextSibling !== null &&
          !addedNodes[addedNodes.length - 1].nextSibling.hasAttribute(
            'class'
          ) &&
          !addedNodes[addedNodes.length - 1].nextSibling.hasAttribute('role')
        ) {
          for (let i = addedNodes.length - 1; i >= 0; i--) {
            sibling = addedNodes[i].nextSibling;

            let colonPos = 0;
            for (let j = 0; j < sibling.firstChild.firstChild.id.length; j++) {
              if (sibling.firstChild.firstChild.id[j] === ':') {
                colonPos = j;
                break;
              }
            }
            const gridId = sibling.firstChild.firstChild.id.substring(
              colonPos + 1
            );
            const siblingBaseId = sibling.firstChild.firstChild.id.substring(
              0,
              colonPos
            );
            siblingIdNum = siblingBaseId.substring(4);

            let idNum = parseInt(siblingIdNum) - 1;
            addedNodes[i].firstChild.firstChild.id = `cell${idNum}:${gridId}`;
          }
        } else {
          for (let i = 0; i < addedNodes.length; i++) {
            sibling = addedNodes[i].previousSibling;

            let colonPos = 0;
            for (let j = 0; j < sibling.firstChild.firstChild.id.length; j++) {
              if (sibling.firstChild.firstChild.id[j] === ':') {
                colonPos = j;
                break;
              }
            }
            const gridId = sibling.firstChild.firstChild.id.substring(
              colonPos + 1
            );
            const siblingBaseId = sibling.firstChild.firstChild.id.substring(
              0,
              colonPos
            );
            siblingIdNum = siblingBaseId.substring(4);

            let idNum = parseInt(siblingIdNum) + 1;
            addedNodes[i].firstChild.firstChild.id = `cell${idNum}:${gridId}`;
          }
        }
      }
    } else {
      const cellAncestors = this.#gridcellContainer.children;
      const numCells = cellAncestors.length;
      for (let i = 1; i < numCells; i++) {
        const cell = cellAncestors[i].firstChild.firstChild;
        if (!cell.hasAttribute('id')) {
          cell.id = `cell${i - 1}:${mutations[0].target.id.substring(15)}`;
        }

        // const observer = new MutationObserver(this.#gridcellMutationHandler);
        // observer.observe(cell, { childList: true, subtree: true });
        // this.#cellIdToObserver.set(cell.id, observer);
      }
    }

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        const cell = node.firstChild.firstChild;

        if (!this.#cellIdToObserver.has(cell.id)) {
          const gridcellObserver = new MutationObserver(
            this.#gridcellMutationHandler
          );
          gridcellObserver.observe(cell, {
            childList: true,
          });
          this.#cellIdToObserver.set(cell.id, gridcellObserver);
        }

        const chatBubble = cell.querySelector(this.#chatBubbleSelector);
        if (chatBubble !== null) {
          const sendStatusSpan = cell.querySelector(this.#sendStatusSelector);
          const messageSent =
            sendStatusSpan !== null
              ? sendStatusSpan.textContent.startsWith('Sent')
              : false;
          console.log(
            `${cell.id}: sendStatusSpan = ${sendStatusSpan}, messageSent = ${messageSent}`
          );
          if (
            (node.nextSibling === undefined ||
              node.nextSibling === null ||
              node.nextSibling.hasAttribute('class') ||
              node.nextSibling.hasAttribute('role')) &&
            !messageSent
          ) {
            const userBubble = chatBubble.querySelector(
              'div > [role="presentation"].html-div > div.x78zum5.xdt5ytf.x193iq5w.x1n2onr6.x1kxipp6.xuk3077'
            );
            if (userBubble === null) {
              const waitForCompleteMessage = (txt) => {
                setTimeout(() => {
                  if (chatBubble.textContent !== txt) {
                    waitForCompleteMessage(chatBubble.textContent);
                  } else {
                    // attributeObserver.disconnect();

                    this.parseContent(chatBubble);
                  }
                }, 500); // Sometimes 300 ms is not long enough
              };
              waitForCompleteMessage(chatBubble.textContent);
            } else {
              console.log(`ensuring message in ${cell.id} is parsed`);
              // this.parseContent(chatBubble);
              this.ensureParsed(chatBubble);
            }
          } else {
            this.parseContent(chatBubble);
          }
        }
      });
    });
  };

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

  // assignGridsIds() {
  //   for (const chatBox of this.#chatBoxContainer.children) {
  //     const labeledMessageGrid = chatBox.querySelector(
  //       this.#labeledMessageGridSelector
  //     );
  //     if (!labeledMessageGrid.hasAttribute('id')) {
  //       const chatTitle = chatBox.querySelector(this.#chatTitleSelector);
  //       const name = chatTitle.textContent.toLowerCase().replace(/\s/g, '-');
  //       labeledMessageGrid.id = `${name}.${crypto.randomUUID()}`;
  //     }
  //   }
  // }

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

    // Consider moving this assignment to a separate setter
    this.#gridcellContainer = grid.querySelector(
      this.#gridcellContainerSelector
    );

    const waitToAssignIds = () => {
      const labeledGrid = pointOfReference.querySelector(
        this.#labeledMessageGridSelector
      );
      if (labeledGrid === null) {
        setTimeout(waitToAssignIds, 100);
      } else {
        if (!labeledGrid.hasAttribute('id')) {
          const label = labeledGrid.getAttribute('aria-label');
          const labelEnd = label.substring(25);

          let name;

          if (labelEnd.startsWith('with')) {
            name = labelEnd.substring(5).toLowerCase().replace(/\s/g, '-');
          }

          if (labelEnd.startsWith('titled')) {
            name = labelEnd.substring(7).toLowerCase().replace(/\s/g, '-');
          }

          labeledGrid.id = `${name}.${crypto.randomUUID()}`;
        }

        this.#gridcellContainer.id = `cell-container:${labeledGrid.id}`;
      }
    };
    waitToAssignIds();
  }

  observeGridcells() {
    const cellAncestors = this.#gridcellContainer.children;
    const numCells = cellAncestors.length;
    for (let i = 1; i < numCells; i++) {
      const cell = cellAncestors[i].firstChild.firstChild;

      if (!cell.hasAttribute('id')) {
        cell.id = `cell${i - 1}:${this.#messageGrid.id}`;
      }

      const observer = new MutationObserver(this.#gridcellMutationHandler);
      observer.observe(cell, { childList: true });
      this.#cellIdToObserver.set(cell.id, observer);
    }
  }

  getGridcellContainer() {
    return this.#gridcellContainer;
  }

  observeGridcellContainer() {
    const observer = new MutationObserver(
      this.#gridcellContainerMutationHandler
    );
    observer.observe(this.#gridcellContainer, {
      childList: true,
    });
    this.#gridcellContainerToObserver.set(this.#gridcellContainer, observer);
  }

  // // #editorContainerMutationHandler = (mutations) => {
  // //   mutations.forEach((mutation) => {
  // //     // console.log(`attribute of editor container mutated`);
  // //     // if (
  // //     //   mutation.attributeName === 'aria-label' &&
  // //     //   !mutation.target.hasAttribute('aria-label')
  // //     // ) {
  // //     //   console.log(`aria-label removed`);
  // //     // }
  // //     mutation.addedNodes.forEach((node) => {
  // //       console.log(`node added to editor container's child list`);
  // //       console.log(node);
  // //       const textbox = node.querySelector(
  // //         'div[role="textbox"][contenteditable="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw'
  // //       );
  // //     });
  // //   });
  // // };

  // // observeEditorContainers() {
  // //   const editorContainers = document.querySelectorAll(
  // //     this.#editorContainerSelector
  // //   );
  // //   console.log(`${editorContainers.length} editor containers found`);
  // //   for (const container of editorContainers) {
  // //     const observer = new MutationObserver(
  // //       this.#editorContainerMutationHandler
  // //     );
  // //     observer.observe(container, { childList: true });
  // //   }
  // // }

  activateRendering() {
    this.handleChatBubbles();
    this.observeGridcells();
    this.observeGridcellContainer();
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
          this.parseContent(bubble);
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

  getChatBoxToId() {
    return this.#chatBoxToId;
  }

  setChatBoxToId() {
    for (const chatBox of this.#chatBoxContainer.children) {
      const messageGridId = chatBox.querySelector(
        this.#labeledMessageGridSelector
      ).id;
      this.#chatBoxToId.set(chatBox, messageGridId);
    }
  }

  getGridcellContainerToObserver() {
    return this.#gridcellContainerToObserver;
  }

  #chatBoxVisibilityMutationHandler = (mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'hidden') {
        this.setMessageGrid(mutation.target);

        if (mutation.target.hasAttribute('hidden')) {
          console.log(`chat box hidden`);
          const gridcellContainerObserver =
            this.#gridcellContainerToObserver.get(this.#gridcellContainer);
          if (gridcellContainerObserver !== undefined) {
            gridcellContainerObserver.disconnect();
          }
        } else {
          console.log(`chat box shown`);
          const waitForGridsToBeLabeled = () => {
            if (!this.messageGridsLabeled()) {
              setTimeout(waitForGridsToBeLabeled, 100);
            } else {
              // this.assignGridsIds();

              const labeledGrid = mutation.target.querySelector(
                this.#labeledMessageGridSelector
              );
              const messageGridId = labeledGrid ? labeledGrid.id : null;

              // this.setMessageGrid(/*0, */ mutation.target);
              this.#chatBoxToId.set(mutation.target, messageGridId);
              this.activateRendering();
            }
          };
          waitForGridsToBeLabeled();
        }
      }
    });
  };

  observeChatBoxes() {
    console.log(`${this.#chatBoxContainer.children.length} chat boxes found`);
    for (const chatBox of this.#chatBoxContainer.children) {
      // if (!this.#chatBoxToId.has(chatBox)) {
      const messageGridId = chatBox.querySelector(
        this.#labeledMessageGridSelector
      ).id;
      if (!this.#idToChatBoxObserver.has(messageGridId)) {
        const observer = new MutationObserver(
          this.#chatBoxVisibilityMutationHandler
        );
        observer.observe(chatBox.firstChild.firstChild, { attributes: true });

        // const messageGridId = chatBox.querySelector(
        //   this.#labeledMessageGridSelector
        // ).id;
        this.#idToChatBoxObserver.set(messageGridId, observer);

        console.log(`observing visibility of ${messageGridId}`);
      }
      // }
    }
  }

  disconnectObservers() {
    [
      this.#accountControlsAndSettingsObserver,
      this.#chatBoxContainerObserver,
      this.#chatBoxContainerContainerObserver,
      this.#messengerChatContainerObserver,
    ].forEach((observer) => observer.disconnect());

    [
      this.#idToChatBoxObserver,
      this.#cellIdToObserver,
      this.#gridcellContainerToObserver,
    ].forEach((map) => {
      for (const entry of map.entries()) {
        entry[1].disconnect();
      }
    });
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
        if (
          !domInfo
            .getGridcellContainerToObserver()
            .has(domInfo.getGridcellContainer())
        ) {
          domInfo.activateRendering();
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
          // domInfo.assignGridsIds();

          domInfo.setChatBoxToId();
          domInfo.observeChatBoxes();
          // Condition below may be superfluous
          const chatBoxes = domInfo.getChatBoxContainer().children;
          // if (chatBoxes.length !== 0) {
          for (const chat of chatBoxes) {
            domInfo.setChat(chat);
            domInfo.setMessageGrid(chat);
            handleChat(domInfo);
          }
          // }
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

        // domInfo.setEditorContainers();
        // domInfo.observeEditorContainers();
      }
    };

    if (domInfo.getChat() === null) {
      waitToHandleChat();
    } else {
      domInfo.setMessageGrid();
      domInfo.activateRendering();

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
        // domInfo.setChatBoxContainerContainer();
      } else {
        domInfo.observeChatBoxContainerContainer();
      }
    };
    // waitToObserveChatBoxContainerContainer();

    domInfo.setChatBoxContainer();

    lengthOfWait = 0;
    const waitToHandleChatBoxContainer = () => {
      if (domInfo.getChatBoxContainer() === null) {
        setTimeout(() => {
          if ((lengthOfWait += 100) < 5000) {
            domInfo.setChatBoxContainer();
            waitToHandleChatBoxContainer();
          } else {
            waitToObserveChatBoxContainerContainer();
          }
        }, 100);
      } else {
        waitToObserveChatBoxContainerContainer();
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
      // domInfo.assignGridsIds();

      domInfo.setChatBoxToId();
      const chatBoxes = domInfo.getChatBoxContainer().children;
      // Condition below may be superfluous
      if (chatBoxes.length !== 0) {
        domInfo.observeChatBoxes();
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
              domInfo.activateRendering();
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
