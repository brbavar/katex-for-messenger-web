class DomInfo {
  // parseOutgoingMessage = (keystroke) => {
  //   if (this.#messageGrid && keystroke.key === 'Enter') {
  //     handleSendStatus(this.#messageGrid, this);
  //   }
  // };

  // // While Shift is depressed, message is not sent on Enter. So, in that case, do not attempt to parse on Enter.
  // suppressParsing = (keydown) => {
  //   if (keydown.key === 'Shift') {
  //     keydown.target.removeEventListener(parseOutgoingMessage);
  //   }
  // };

  // // Once Shift is released, message is sent on Enter. So, at that point, be prepared to parse on Enter.
  // allowParsing = (keyup) => {
  //   if (keyup.key === 'Shift') {
  //     keyup.target.addEventListener(parseOutgoingMessage);
  //   }
  // };

  // #oldBubblesStillNeedHandled = true;
  #accountControlsAndSettings = null;
  #chat = null;
  // #threadComposer = null;
  #sendButton = null;
  // #sendButtonContainer = null;
  #messengerChatContainer = null;
  #chatBoxContainer = null;
  #messageGrid = null;
  #bubbleSource = null;
  #bubble = null;
  // #cellContainer = null;
  #chatBoxes = [];
  // #gridcellContainers = [];
  #parsedBubbles = [];
  // #parsedCellContainers = [];
  #handledChats = [];
  // #gridToBubbleCounts = new Map();
  #chatBoxToObserver = new Map();

  // oldBubblesStillNeedHandled() {}

  // setBubbleHandlingTimer() {
  //   setTimeout(() => {
  //     this.#oldBubblesStillNeedHandled = false;
  //   }, 2000);
  // }

  #accountControlsAndSettingsObserver = new MutationObserver((mutations) => {
    console.log(`accountControlsAndSettings mutated`);
    let messengerControlSeen = false;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        const messengerControl = node.querySelector('[aria-label="Messenger"]');
        if (messengerControl !== null) {
          console.log(`messenger control added`);
          this.#accountControlsAndSettingsObserver.disconnect();
          // startUp();
          reset();
          messengerControlSeen = true;
          break;
        } else {
          console.log(`messenger control not added`);
        }
      }
      console.log(
        `${mutation.removedNodes.length} nodes removed from childList of accountControlsAndSettings`
      );
      for (const node of mutation.removedNodes) {
        const messengerControl = node.querySelector('[aria-label="Messenger"]');
        if (messengerControl !== null) {
          console.log(`messenger control removed`);
          this.#accountControlsAndSettingsObserver.disconnect();
          startUp();
          messengerControlSeen = true;
          break;
        } else {
          console.log(`messenger control not removed`);
        }
      }
      if (messengerControlSeen) {
        break;
      }
    }
  });

  // #threadComposerObserver = new MutationObserver((mutations) => {
  //   const clickHandler = () => {
  //     console.log('handling click');
  //     if (this.#messageGrid) {
  //       handleSendStatus(this.#messageGrid, this);
  //     }
  //   };

  //   mutations.forEach((mutation) => {
  //     mutation.addedNodes.forEach((node) => {
  //       if ('aria-label' in node) {
  //         console.log(
  //           `node with aria-label ${node.getAttribute(
  //             'aria-label'
  //           )} added to thread composer's child list:`
  //         );
  //       }
  //       if (
  //         node.getAttribute('aria-label') === 'Press enter to send' &&
  //         node.role === 'button' &&
  //         isOfTheClasses(node, [
  //           'html-span',
  //           'xdj266r',
  //           'x14z9mp',
  //           'xat24cr',
  //           'x1lziwak',
  //           'xexx8yu',
  //           'xyri2b',
  //           'x18d9i69',
  //           'x1c1uobl',
  //           'x1hl2dhg',
  //           'x16tdsg8',
  //           'x1vvkbs',
  //           'x4k7w5x',
  //           'x1h91t0o',
  //           'x1h9r5lt',
  //           'xv2umb2',
  //           'x1beo9mf',
  //           'xaigb6o',
  //           'x12ejxvf',
  //           'x3igimt',
  //           'xarpa2k',
  //           'xedcshv',
  //           'x1lytzrv',
  //           'x1t2pt76',
  //           'x7ja8zs',
  //           'x1qrby5j',
  //         ])
  //       ) {
  //         console.log(`event listener should be added`);
  //         node.addEventListener('click', clickHandler);
  //       }
  //     });
  //     mutation.removedNodes.forEach((node) => {
  //       if ('aria-label' in node) {
  //         console.log(
  //           `node with aria-label ${node.getAttribute(
  //             'aria-label'
  //           )} removed from thread composer's child list`
  //         );
  //       }
  //       if (
  //         node.getAttribute('aria-label') === 'Press enter to send' &&
  //         node.role === 'button' &&
  //         isOfTheClasses(node, [
  //           'html-span',
  //           'xdj266r',
  //           'x14z9mp',
  //           'xat24cr',
  //           'x1lziwak',
  //           'xexx8yu',
  //           'xyri2b',
  //           'x18d9i69',
  //           'x1c1uobl',
  //           'x1hl2dhg',
  //           'x16tdsg8',
  //           'x1vvkbs',
  //           'x4k7w5x',
  //           'x1h91t0o',
  //           'x1h9r5lt',
  //           'xv2umb2',
  //           'x1beo9mf',
  //           'xaigb6o',
  //           'x12ejxvf',
  //           'x3igimt',
  //           'xarpa2k',
  //           'xedcshv',
  //           'x1lytzrv',
  //           'x1t2pt76',
  //           'x7ja8zs',
  //           'x1qrby5j',
  //         ])
  //       ) {
  //         console.log(`event listener should be removed`);
  //         node.removeEventListener('click', clickHandler);
  //       }
  //     });
  //   });
  // });

  // #sendButtonObserver = new MutationObserver((mutations) => {
  //   const clickHandler = () => {
  //     console.log('handling click');
  //     if (this.#messageGrid) {
  //       handleSendStatus(this.#messageGrid, this);
  //     }
  //   };

  //   mutations.forEach((mutation) => {
  //     console.log(`sendButton mutated`);
  //     if (
  //       mutation.target.getAttribute(mutation.attributeName) ===
  //       'Press enter to send'
  //     ) {
  //       this.#sendButton.addEventListener('click', clickHandler);
  //     }
  //     if (mutation.oldValue === 'Press enter to send') {
  //       this.#sendButton.removeEventListener('click', clickHandler);
  //     }
  //   });
  // });

  // #sendButtonContainerObserver = new MutationObserver((mutations) => {
  //   const clickHandler = () => {
  //     console.log('handling click');
  //     if (this.#messageGrid) {
  //       handleSendStatus(this.#messageGrid, this);
  //     }
  //   };

  //   console.log(`sendButtonContainer's child list mutated`);
  //   mutations.forEach((mutation) => {
  //     mutation.addedNodes.forEach((node) => {
  //       console.log(
  //         `Node added to sendButtonContainer's child list. Node's classList is: ${node.classList}`
  //       );
  //       if (
  //         node.getAttribute('aria-label') === 'Press enter to send' &&
  //         node.role === 'button' /* &&
  //           isOfTheClasses(node, [
  //             'html-span',
  //             'xdj266r',
  //             'x14z9mp',
  //             'xat24cr',
  //             'x1lziwak',
  //             'xexx8yu',
  //             'xyri2b',
  //             'x18d9i69',
  //             'x1c1uobl',
  //             'x1hl2dhg',
  //             'x16tdsg8',
  //             'x1vvkbs',
  //             'x4k7w5x',
  //             'x1h91t0o',
  //             'x1h9r5lt',
  //             'xv2umb2',
  //             'x1beo9mf',
  //             'xaigb6o',
  //             'x12ejxvf',
  //             'x3igimt',
  //             'xarpa2k',
  //             'xedcshv',
  //             'x1lytzrv',
  //             'x1t2pt76',
  //             'x7ja8zs',
  //             'x1qrby5j',
  //           ])*/
  //       ) {
  //         console.log(`event listener should be added`);
  //         node.addEventListener('click', clickHandler);
  //       } else {
  //         if (
  //           node.firstChild.getAttribute('aria-label') ===
  //             'Press enter to send' &&
  //           node.firstChild.role === 'button' /* &&
  //           isOfTheClasses(node.firstChild, [
  //             'html-span',
  //             'xdj266r',
  //             'x14z9mp',
  //             'xat24cr',
  //             'x1lziwak',
  //             'xexx8yu',
  //             'xyri2b',
  //             'x18d9i69',
  //             'x1c1uobl',
  //             'x1hl2dhg',
  //             'x16tdsg8',
  //             'x1vvkbs',
  //             'x4k7w5x',
  //             'x1h91t0o',
  //             'x1h9r5lt',
  //             'xv2umb2',
  //             'x1beo9mf',
  //             'xaigb6o',
  //             'x12ejxvf',
  //             'x3igimt',
  //             'xarpa2k',
  //             'xedcshv',
  //             'x1lytzrv',
  //             'x1t2pt76',
  //             'x7ja8zs',
  //             'x1qrby5j',
  //           ])*/
  //         ) {
  //           console.log(`event listener should be added`);
  //           node.firstChild.addEventListener('click', clickHandler);
  //         }
  //       }
  //     });

  //     mutation.removedNodes.forEach((node) => {
  //       console.log(
  //         `Node removed from sendButtonContainer's child list. Node's classList is: ${node.classList}`
  //       );
  //       if (
  //         node.getAttribute('aria-label') === 'Press enter to send' &&
  //         node.role === 'button' /*&&
  //           isOfTheClasses(node, [
  //             'html-span',
  //             'xdj266r',
  //             'x14z9mp',
  //             'xat24cr',
  //             'x1lziwak',
  //             'xexx8yu',
  //             'xyri2b',
  //             'x18d9i69',
  //             'x1c1uobl',
  //             'x1hl2dhg',
  //             'x16tdsg8',
  //             'x1vvkbs',
  //             'x4k7w5x',
  //             'x1h91t0o',
  //             'x1h9r5lt',
  //             'xv2umb2',
  //             'x1beo9mf',
  //             'xaigb6o',
  //             'x12ejxvf',
  //             'x3igimt',
  //             'xarpa2k',
  //             'xedcshv',
  //             'x1lytzrv',
  //             'x1t2pt76',
  //             'x7ja8zs',
  //             'x1qrby5j',
  //           ])*/
  //       ) {
  //         console.log(`event listener should be removed`);
  //         node.removeEventListener('click', clickHandler);
  //       } else {
  //         if (
  //           node.firstChild.getAttribute('aria-label') ===
  //             'Press enter to send' &&
  //           node.firstChild.role === 'button' /*&&
  //           isOfTheClasses(node.firstChild, [
  //             'html-span',
  //             'xdj266r',
  //             'x14z9mp',
  //             'xat24cr',
  //             'x1lziwak',
  //             'xexx8yu',
  //             'xyri2b',
  //             'x18d9i69',
  //             'x1c1uobl',
  //             'x1hl2dhg',
  //             'x16tdsg8',
  //             'x1vvkbs',
  //             'x4k7w5x',
  //             'x1h91t0o',
  //             'x1h9r5lt',
  //             'xv2umb2',
  //             'x1beo9mf',
  //             'xaigb6o',
  //             'x12ejxvf',
  //             'x3igimt',
  //             'xarpa2k',
  //             'xedcshv',
  //             'x1lytzrv',
  //             'x1t2pt76',
  //             'x7ja8zs',
  //             'x1qrby5j',
  //           ])*/
  //         ) {
  //           console.log(`event listener should be removed`);
  //           node.firstChild.removeEventListener('click', clickHandler);
  //         }
  //       }
  //     });
  //   });
  // });

  // #gridChunkObserver = new MutationObserver((mutations) => {
  //   mutations.forEach((mutation) => {
  //     mutation.addedNodes.forEach((node) => {
  //       // console.log(
  //       //   `node of type ${node.constructor.name} added to grid; classList = ${
  //       //     node.classList
  //       //   }; parent's classList = ${
  //       //     node.parentNode ? node.parentNode.classList : 'N/A (no parent node)'
  //       //   }`
  //       // );

  //       // if (
  //       //   'classList' in node &&
  //       //   'role' in node &&
  //       //   node.classList.contains('x1n2onr6') &&
  //       //   node.role === 'row'
  //       // ) {
  //       //   console.log('row added to grid');
  //       // }

  //       // if (
  //       //   'classList' in node &&
  //       //   isOfTheClasses(node, [
  //       //     'html-div',
  //       //     'xexx8yu',
  //       //     'x18d9i69',
  //       //     'xat24cr',
  //       //     'xdj266r',
  //       //     'xeuugli',
  //       //     'x1vjfegm',
  //       //   ])
  //       // ) {
  //       //   console.log(`bubble added to grid`);
  //       // }

  //       if (
  //         'class' in node &&
  //         node.getAttribute('class') === 'x9f619 x1n2onr6 x1ja2u2z'
  //       ) {
  //         console.log(`gridcell container added to grid`);
  //       }
  //     });
  //     mutation.removedNodes.forEach((node) => {
  //       // console.log(
  //       //   `node of type ${
  //       //     node.constructor.name
  //       //   } removed from grid; classList = ${
  //       //     node.classList
  //       //   }; parent's classList = ${
  //       //     node.parentNode ? node.parentNode.classList : 'N/A (no parent node)'
  //       //   }`
  //       // );

  //       // if (
  //       //   'classList' in node &&
  //       //   'role' in node &&
  //       //   node.classList.contains('x1n2onr6') &&
  //       //   node.role === 'row'
  //       // ) {
  //       //   console.log('row removed from grid');
  //       // }

  //       // if (
  //       //   'classList' in node &&
  //       //   isOfTheClasses(node, [
  //       //     'html-div',
  //       //     'xexx8yu',
  //       //     'x18d9i69',
  //       //     'xat24cr',
  //       //     'xdj266r',
  //       //     'xeuugli',
  //       //     'x1vjfegm',
  //       //   ])
  //       // ) {
  //       //   console.log(`bubble removed from grid`);
  //       // }

  //       if (
  //         'class' in node &&
  //         node.getAttribute('class') === 'x9f619 x1n2onr6 x1ja2u2z'
  //       ) {
  //         console.log(`gridcell container removed from grid`);
  //       }
  //     });
  //   });
  // });

  #messengerChatContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log(`SWITCHED TO DIFFERENT CONVO`);
        let convo = null;
        if (
          'querySelector' in node &&
          (convo = node.querySelector(
            'div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq'
          ))
        ) {
          console.log(`this chat should be handled`);
          this.#chat = convo;
          this.setMessageGrid();
          this.setBubbleSource(this.#messageGrid);
          handleOldChatBubbles(this);
          // handleChat(this);
          handleMessageGrid(this);
        }
      });
    });
  });

  #chatBoxContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log(`observed addition of node to chat box container`);
        console.log(
          `node.firstChild.firstChild.hidden = ${node.firstChild.firstChild.hidden}`
        );
        // const messageGrid = node.querySelector(
        //   '[aria-label^="Messages in conversation"]'
        // );
        const messageGrid = node.querySelector(
          '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
        );
        console.log(`messageGrid = ${messageGrid}`);

        const chatBoxObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              /* !node.firstChild.firstChild.hidden && */
              mutation.attributeName === 'hidden' /* &&
                        mutation.oldValue === 'true' */ &&
              !node.firstChild.firstChild.hasAttribute('hidden')
            ) {
              console.log(
                `${node
                  .querySelector(
                    '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
                  )
                  .getAttribute('aria-label')} went from hidden to visible`
              );
              // // if (!this.#handledChats().includes(node)) {
              // this.#chat = node;
              // this.#messageGrid = messageGrid;
              // this.setBubbleSource(this.#messageGrid);
              // handleOldChatBubbles(this);
              // // handleChat(this);
              // handleMessageGrid(this);
              // // this.#handledChats.push(node);
              // // }
              const chatBubbles = node
                .querySelector(
                  '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
                )
                .querySelectorAll(
                  '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
                );

              console.log(`${chatBubbles.length} chat bubbles found`);

              chatBubbles.forEach((bubble) => {
                // if (!domInfo.getParsedBubbles().includes(bubble)) {
                // console.log('bubble still needs parsed');
                this.#bubble = bubble;
                parseContent(this, bubble);
              });

              this.#messageGrid = node.querySelector(
                '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
              );
              handleMessageGrid(this);
            }
          });
        });

        chatBoxObserver.observe(node.firstChild.firstChild, {
          attributes: true,
        });

        this.#chatBoxToObserver.set(node, chatBoxObserver);

        if (messageGrid !== null && !node.firstChild.firstChild.hidden) {
          let labeledGrid = node.querySelector(
            '[aria-label^="Messages in conversation"]'
          );
          const waitToHandleChatBox = () => {
            // if (!messageGrid.getAttribute('aria-label')) {
            //    setTimeout(waitToHandleChatBox, 100);
            if (!labeledGrid) {
              setTimeout(() => {
                labeledGrid = node.querySelector(
                  '[aria-label^="Messages in conversation"]'
                );
                waitToHandleChatBox();
              }, 100);
            } else {
              // console.log(
              //   `added chat box has this aria-label: ${messageGrid.getAttribute(
              //     'aria-label'
              //   )}`
              // );
              console.log(
                `added chat box has this aria-label: ${labeledGrid.getAttribute(
                  'aria-label'
                )}`
              );
              console.log(
                `number of chats handled thus far: ${this.#handledChats.length}`
              );
              // if (![...this.#chatBoxes, ...this.#handledChats].includes(node)) {
              //   this.#chatBoxes.push(node);
              //   this.#chat = node;
              //   this.#messageGrid = messageGrid;
              //   handleChat(this);
              //   this.#handledChats.push(node);
              // }

              // Perhaps you should check if chat box is hidden here as well, before handling and adding to #handledChats
              if (!this.#chatBoxes.includes(node)) {
                // console.log(`this.#chatBoxes does NOT include node`);
                this.#chatBoxes.push(node);

                // if (!this.#handledChats.includes(node)) {
                this.#chat = node;
                this.#messageGrid = messageGrid;
                this.setBubbleSource(this.#messageGrid);
                handleOldChatBubbles(this);
                // handleChat(this);
                handleMessageGrid(this);
                // this.#handledChats.push(node);
                // }
              }
            }
          };
          waitToHandleChatBox();
        }
      });
      mutation.removedNodes.forEach((node) => {
        console.log(`observed removal of node from chat box container`);
        const messageGrid = node.querySelector(
          '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
        );
        if (messageGrid !== null) {
          console.log(
            `removed chat box has this aria-label: ${messageGrid.getAttribute(
              'aria-label'
            )}`
          );
        }

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

  // getThreadComposer() {
  //   return this.#threadComposer;
  // }

  // setThreadComposer(chat) {
  //   this.#threadComposer =
  //     chat.querySelector(
  //       'div[aria-label="Thread composer"][role="group"].xuk3077.x57kliw.x78zum5.x6prxxf.xz9dl7a.xsag5q8'
  //     ) ||
  //     chat.querySelector(
  //       '.html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.xt5xv9l.x6wvzqs.xpqajaz.x78zum5.xdt5ytf.x1c4vz4f.xs83m0k.x13qp9f6 > .html-div.xdj266r.x14z9mp.xat24cr.x1lziwak.xpqajaz.x9f619.x78zum5.x1iyjqo2.xs83m0k.x1n2onr6.xh8yej3.xz9dl7a.xsag5q8.x135b78x.x11lfxj5'
  //     );
  //   this.#messageGrid = chat.querySelector(
  //     'div[aria-label^="Messages in conversation"][role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
  //   );
  // }

  // observeThreadComposer() {
  //   this.#threadComposerObserver.observe(this.#threadComposer, {
  //     childList: true,
  //   });
  // }

  getSendButton() {
    return this.#sendButton;
  }

  setSendButton(chat) {
    this.#sendButton = chat.querySelector(
      ':where([aria-label^="Send a"], [aria-label="Press enter to send"]).x1i10hfl.xjqpnuy.xc5r6h4.xqeqjp1.x1phubyo.x13fuv20.x18b5jzi.x1q0q8m5.x1t7ytsu.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x14z9mp.xat24cr.x1lziwak.x2lwn1j.xeuugli.xjbqb8w.x972fbf.x10w94by.x1qhh985.x14e42zd.x9f619.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz'
    );
  }

  // observeSendButton() {
  //   this.#sendButtonObserver.observe(this.#sendButton, { attributes: true });
  // }

  // getSendButtonContainer() {
  //   return this.#sendButtonContainer;
  // }

  // setSendButtonContainer(chat) {
  //   this.#sendButtonContainer = chat.querySelector(
  //     '.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x4k7w5x.x1h91t0o.x1h9r5lt.xv2umb2.x1beo9mf.xaigb6o.x12ejxvf.x3igimt.xarpa2k.xedcshv.x1lytzrv.x1t2pt76.x7ja8zs.x1qrby5j'
  //   );
  // }

  // observeSendButtonContainer() {
  //   this.#sendButtonContainerObserver.observe(this.#sendButtonContainer, {
  //     childList: true,
  //     /* subtree: true, */
  //   });
  // }

  // observeGridChunks() {
  //   this.#gridChunkObserver.observe(this.#messageGrid, {
  //     childList: true,
  //     subtree: true,
  //   });
  // }

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
      `${
        this.#chatBoxContainer.children.length
      } chatBoxes found. The corresponding aria-labels are as follows:`
    );

    for (const chatBox of this.#chatBoxContainer.children) {
      const grid = chatBox.querySelector(
        '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
      );
      if (grid) {
        console.log(grid.getAttribute('aria-label'));
      }

      if (
        /* !this.#handledChats.includes(chatBox) */ !this.#chatBoxes.includes(
          chatBox
        )
      ) {
        this.#chatBoxes.push(chatBox);

        if (
          grid ||
          (chatBox.firstChild.firstChild &&
            chatBox.firstChild.firstChild.hidden)
        ) {
          const chatBoxObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (
                /* !chatBox.firstChild.firstChild.hidden && */
                mutation.attributeName === 'hidden' /* &&
              mutation.oldValue === 'true' */ &&
                !chatBox.firstChild.firstChild.hasAttribute('hidden')
              ) {
                console.log(
                  `${chatBox
                    .querySelector(
                      '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
                    )
                    .getAttribute('aria-label')} went from hidden to visible`
                );
                // // if (!this.#handledChats().includes(chatBox)) {
                // this.#chat = chatBox;
                // this.#messageGrid = messageGrid;
                // this.setBubbleSource(this.#messageGrid);
                // handleOldChatBubbles(this);
                // // handleChat(this);
                // handleMessageGrid(this);
                // // this.#handledChats.push(chatBox);
                // // }
                const chatBubbles = chatBox
                  .querySelector(
                    '[aria-label^="Messages in conversation"], div[role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62, div.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
                  )
                  .querySelectorAll(
                    '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
                  );

                console.log(`${chatBubbles.length} chat bubbles found`);

                chatBubbles.forEach((bubble) => {
                  // if (!domInfo.getParsedBubbles().includes(bubble)) {
                  // console.log('bubble still needs parsed');
                  this.#bubble = bubble;
                  parseContent(this, bubble);
                });

                this.#messageGrid = chatBox.querySelector(
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

  getMessageGrid() {
    return this.#messageGrid;
  }

  setMessageGrid() {
    this.#messageGrid = this.#chat.querySelector(
      'div[aria-label^="Messages in conversation"][role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
    );
  }

  // getCellContainer() {
  //   return this.#cellContainer;
  // }

  // setCellContainer(container) {
  //   this.#cellContainer = container;
  // }

  // getGridcellContainers() {
  //   return this.#gridcellContainers;
  // }

  // setGridcellContainers() {
  //   // this.#gridcellContainers = this.#messageGrid.querySelectorAll(
  //   //   'div.x9f619.x1n2onr6.x1ja2u2z:has(> div > div > div[role="row"].x1n2onr6 > div > div[role="gridcell"][data-scope="messages_table"][data-release-focus-from="CLICK"])'
  //   // );
  //   this.#gridcellContainers = this.#messageGrid.querySelectorAll(
  //     'div[class="x9f619 x1n2onr6 x1ja2u2z"]'
  //   );
  // }

  getBubbleSource() {
    return this.#bubbleSource;
  }

  setBubbleSource(src) {
    this.#bubbleSource = src;
  }

  getBubble() {
    return this.#bubble;
  }

  setBubble(bbl) {
    this.#bubble = bbl;
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

  // getParsedCellContainers() {
  //   return this.#parsedCellContainers;
  // }

  // markCellContainerAsParsed() {
  //   this.#parsedCellContainers.push(this.#cellContainer);
  // }

  // unmarkCellContainerAsParsed() {
  //   this.#parsedCellContainers = this.#parsedCellContainers.filter(
  //     (container) => container !== this.#cellContainer
  //   );
  // }

  getHandledChats() {
    return this.#handledChats;
  }

  markAsHandled(chat) {
    this.#handledChats.push(chat);
  }

  // getBubbleCount(grid) {
  //   return this.#gridToBubbleCounts.get(grid);
  // }

  // setBubbleCount(grid, count) {
  //   this.#gridToBubbleCounts.set(grid, count);
  // }
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
  if (
    domInfo === null ||
    !domInfo.getParsedBubbles().includes(bubble)
    /* !domInfo.getParsedCellContainers().includes(domInfo.getCellContainer()) */
  ) {
    console.log(
      `Parsing of bubble with the following text should succeed: "${bubble.textContent}".`
    );
    const msg = bubble.querySelector(
      '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h'
    );
    let texBounds;

    if (msg !== null && msg.textContent != '') {
      texBounds = getTexBounds(msg);
    }

    if (texBounds !== undefined) {
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

const isOfTheClasses = (el, theCs) => {
  for (const c of theCs) {
    if (!'classList' in el || !el.classList.contains(c)) return false;
  }
  return true;
};

const findNewChatBubble = (sendStatusTxtNode) => {
  let searchNode = sendStatusTxtNode.parentNode;

  while (
    !isOfTheClasses(searchNode, [
      'html-div',
      'xdj266r',
      'xat24cr',
      'xexx8yu',
      'x18d9i69',
      'x1eb86dx',
      'x78zum5',
      'x13a6bvl',
    ])
  ) {
    searchNode = searchNode.parentNode;
  }

  return searchNode.previousSibling || searchNode.nextSibling;
};

// const findGridcellContainer = (bubbleSource) => {
//   let searchNode = bubbleSource.parentNode;

//   while (
//     searchNode !== null &&
//     searchNode.getAttribute('class') !== 'x9f619 x1n2onr6 x1ja2u2z'
//   ) {
//     searchNode = searchNode.parentNode;
//   }

//   return searchNode;
// };

let chatBubbleObserver;

const handleOldChatBubbles = (domInfo) => {
  console.log(`handleOldChatBubbles invoked`);
  if (
    domInfo.getBubbleSource() &&
    'querySelectorAll' in domInfo.getBubbleSource() /* &&
    !domInfo.getParsedCellContainers().includes(domInfo.getBubbleSource())*/
  ) {
    const chatBubbles = domInfo
      .getBubbleSource()
      .querySelectorAll(
        '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
      );

    console.log(`${chatBubbles.length} chat bubbles found`);

    chatBubbles.forEach((bubble) => {
      // if (!domInfo.getParsedBubbles().includes(bubble)) {
      // console.log('bubble still needs parsed');
      domInfo.setBubble(bubble);
      if (bubble.textContent === '') {
        console.log(`bubble initially empty`);
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
            console.log(
              `initially empty bubble now contains this text: ${txt}`
            );
            const waitForCompleteMessage = () => {
              setTimeout(() => {
                if (bubble.textContent !== txt) {
                  txt = bubble.textContent;
                  waitForCompleteMessage();
                } else {
                  parseContent(domInfo, bubble);
                  setTimeout(() => {
                    const msg = bubble.querySelector(
                      '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h'
                    );
                    let texBounds;

                    if (msg !== null && msg.textContent != '') {
                      console.log(
                        `double-checking message with this text: ${msg.textContent}`
                      );
                      texBounds = getTexBounds(msg);
                    }

                    if (texBounds !== undefined && texBounds.length) {
                      console.log(
                        `message still has these TeX bounds: ${texBounds}`
                      );
                      domInfo.unmarkAsParsed(bubble);
                      parseContent(domInfo, bubble);
                    }
                  }, 2000);
                }
              }, 100);
            };
            waitForCompleteMessage();
          }
        };
        waitToParseContent();
      } else {
        // const rows = domInfo
        //   .getMessageGrid()
        //   .querySelectorAll('div.x1n2onr6[role="row"]');
        // if (
        //   rows[rows.length - 1] ===
        //   bubble.parentNode.parentNode.parentNode.parentNode
        // ) {
        //   // let sendStatus = bubble.parentNode.parentNode.querySelector(
        //   //   '.html-div:scope > [role="presentation"].html-span > span[dir="auto"] > .html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
        //   // );
        //   let sendStatus = bubble.parentNode.parentNode.querySelector(
        //     '.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
        //   );
        //   console.log(`sendStatus is ${sendStatus}`);
        //   if (sendStatus === null) {
        //     // setTimeout(() => {
        //     handleSendStatus(domInfo.getMessageGrid(), domInfo);
        //     // }, 1000);
        //   } else {
        //     parseContent(domInfo);
        //   }
        // } else {

        // setTimeout(() => {
        parseContent(domInfo, bubble);
        // }, 500);
        setTimeout(() => {
          const msg = bubble.querySelector(
            '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h'
          );
          let texBounds;

          if (msg !== null && msg.textContent != '') {
            console.log(
              `double-checking message with this text: ${msg.textContent}`
            );
            texBounds = getTexBounds(msg);
          }

          if (texBounds !== undefined && texBounds.length) {
            console.log(`message still has these TeX bounds: ${texBounds}`);
            domInfo.unmarkAsParsed(bubble);
            parseContent(domInfo, bubble);
          }
        }, 2000);

        // }
      }
      // }
    });
  }
};

// const handleOldChatBubbles = (domInfo) => {
//   console.log(`handleOldChatBubbles invoked`);
//   const bubbleSource = domInfo.getBubbleSource();
//   if (
//     bubbleSource &&
//     'querySelectorAll' in bubbleSource /* &&
//     !domInfo.getParsedCellContainers().includes(bubbleSource)*/
//   ) {
//     let chatBubbles = bubbleSource.querySelectorAll(
//       '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
//     );

//     // What if there just are no old bubbles to iterate over, none that will show up if you wait long enough?
//     const waitToIterateOverBubbles = () => {
//       console.log(`${chatBubbles.length} chat bubbles found`);
//       if (chatBubbles.length === 0) {
//         setTimeout(() => {
//           chatBubbles = bubbleSource.querySelectorAll(
//             '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
//           );
//           waitToIterateOverBubbles();
//         }, 100);
//       } else {
//         chatBubbles.forEach((bubble) => {
//           // if (!domInfo.getParsedBubbles().includes(bubble)) {
//           // console.log('bubble still needs parsed');
//           domInfo.setBubble(bubble);
//           if (bubble.textContent === '') {
//             console.log(`bubble initially empty`);
//             const waitToParseContent = () => {
//               if (
//                 bubble.textContent === '' ||
//                 bubble.querySelector(
//                   '.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h'
//                 ) === null
//               ) {
//                 setTimeout(waitToParseContent, 100);
//               } else {
//                 let txt = bubble.textContent;
//                 console.log(
//                   `initially empty bubble now contains this text: ${txt}`
//                 );
//                 const waitForCompleteMessage = () => {
//                   setTimeout(() => {
//                     if (bubble.textContent !== txt) {
//                       txt = bubble.textContent;
//                       waitForCompleteMessage();
//                     } else {
//                       parseContent(domInfo);
//                     }
//                   }, 100);
//                 };
//                 waitForCompleteMessage();
//               }
//             };
//             waitToParseContent();
//           } else {
//             // const rows = domInfo
//             //   .getMessageGrid()
//             //   .querySelectorAll('div.x1n2onr6[role="row"]');
//             // if (
//             //   rows[rows.length - 1] ===
//             //   bubble.parentNode.parentNode.parentNode.parentNode
//             // ) {
//             //   // let sendStatus = bubble.parentNode.parentNode.querySelector(
//             //   //   '.html-div:scope > [role="presentation"].html-span > span[dir="auto"] > .html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//             //   // );
//             //   let sendStatus = bubble.parentNode.parentNode.querySelector(
//             //     '.html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//             //   );
//             //   console.log(`sendStatus is ${sendStatus}`);
//             //   if (sendStatus === null) {
//             //     // setTimeout(() => {
//             //     handleSendStatus(domInfo.getMessageGrid(), domInfo);
//             //     // }, 1000);
//             //   } else {
//             //     parseContent(domInfo);
//             //   }
//             // } else {

//             // setTimeout(() => {
//             parseContent(domInfo);
//             // }, 500);

//             // }
//           }
//           // }
//         });
//       }
//     };
//     waitToIterateOverBubbles();
//   }
// };

const handleMessageGrid = (domInfo = null) => {
  // domInfo.setBubbleSource(domInfo.getMessageGrid());

  // handleOldChatBubbles(domInfo);

  // domInfo.setGridcellContainers();
  // domInfo.getGridcellContainers().forEach((container) => {
  //   domInfo.setCellContainer(container);
  //   domInfo.setBubbleSource(container);
  //   handleOldChatBubbles(domInfo);
  //   domInfo.markCellContainerAsParsed();
  // });

  chatBubbleObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log(`observed addition of node to message grid`);
        domInfo.setBubbleSource(node);

        if ('querySelectorAll' in node) {
          const chatBubbles = node.querySelectorAll(
            '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
          );
          chatBubbles.forEach((bubble) => {
            console.log(
              `observed addition of bubble with this text: ${bubble.textContent}`
            );
          });
        }

        // Will this condition ever be met? Seems unlikely
        // const cellContainerArray = Array.from(domInfo.getGridcellContainers());
        // if (cellContainerArray.includes(node)) {
        //   console.log('gridcell container added');
        //   domInfo.setCellContainer(node);
        // } else {
        //   const container = findGridcellContainer(node);
        //   domInfo.setCellContainer(container);
        //   if (domInfo.getParsedCellContainers().includes(container)) {
        //     domInfo.unmarkCellContainerAsParsed();
        //   }
        // }

        // if (domInfo.oldBubblesStillNeedHandled()) {
        handleOldChatBubbles(domInfo);
        // } else {
        //   handleNewChatBubbles(domInfo);
        // }
      });
    });
  });

  if (domInfo.getMessageGrid()) {
    chatBubbleObserver.observe(domInfo.getMessageGrid(), {
      childList: true,
      subtree: true,
    });
    // domInfo.setBubbleHandlingTimer();
  }

  // domInfo.observeGridChunks();
};

// const handleSendStatus = (messageGrid, domInfo) => {
//   console.log(`handling send status`);
//   const oldSendStatus = messageGrid.querySelector(
//     'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.xat24cr.xexx8yu.x18d9i69.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x18d9i69.x1n2onr6.x12nagc.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.xat24cr.xexx8yu.x18d9i69.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//   );
//   let sendStatus = oldSendStatus;
//   console.log(`oldSendStatus = ${oldSendStatus}`);

//   // May not need to set it. It may already be set.
//   domInfo.setBubbleSource(messageGrid);

//   let chatBubbles = domInfo
//     .getBubbleSource()
//     .querySelectorAll(
//       '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
//     );

//   const origNumBubbles = chatBubbles.length;
//   let numBubbles = origNumBubbles;

//   let bubbleSet = false;

//   const waitForNewSendStatus = () => {
//     console.log(`waiting for new send status...`);
//     console.log(`sendStatus = ${sendStatus}`);
//     // Should I compare the statuses directly or compare their first children's node values (text)?
//     if (sendStatus === oldSendStatus) {
//       setTimeout(() => {
//         sendStatus = messageGrid.querySelector(
//           'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.xat24cr.xexx8yu.x18d9i69.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x18d9i69.x1n2onr6.x12nagc.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.xat24cr.xexx8yu.x18d9i69.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//         );
//         waitForNewSendStatus();
//       }, 100);
//     } else {
//       const waitToParseContent = () => {
//         console.log(`waiting to parse content...`);
//         console.log(`sendStatus = ${sendStatus}`);
//         if (sendStatus) {
//           console.log(
//             `sendStatus.firstChild.nodeValue = ${sendStatus.firstChild.nodeValue}`
//           );
//         }
//         if (sendStatus === null) {
//           chatBubbles = domInfo
//             .getBubbleSource()
//             .querySelectorAll(
//               '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
//             );
//           numBubbles = chatBubbles.length;
//           if (numBubbles > origNumBubbles) {
//             console.log(`next message detected; parsing now`);
//             parseContent(domInfo);
//           } else {
//             setTimeout(() => {
//               sendStatus = messageGrid.querySelector(
//                 'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.xat24cr.xexx8yu.x18d9i69.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x18d9i69.x1n2onr6.x12nagc.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.xat24cr.xexx8yu.x18d9i69.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//               );
//               waitToParseContent();
//             }, 100);
//           }
//         } else {
//           if (!bubbleSet) {
//             domInfo.setBubble(findNewChatBubble(sendStatus.firstChild));
//             bubbleSet = true;
//           }
//           if (sendStatus.firstChild.nodeValue !== 'Sent') {
//             setTimeout(waitToParseContent, 100);
//           } else {
//             // domInfo.setBubble(findNewChatBubble(sendStatus.firstChild));
//             parseContent(domInfo);
//           }
//         }
//       };
//       waitToParseContent();
//     }
//   };
//   waitForNewSendStatus();
// };

// const listenForOutgoingMessages = (chat, textbox, domInfo) => {
//   console.log('listenForOutgoingMessages invoked');

//   domInfo.setChat(chat);

//   // const messageGrid = chat.querySelector(
//   //   'div[aria-label^="Messages in conversation"][role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
//   // );
//   // const messageGrid = domInfo
//   //   .getChat()
//   //   .querySelector(
//   //     'div[aria-label^="Messages in conversation"][role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
//   //   );

//   domInfo.setMessageGrid();

//   // textbox.addEventListener('keydown', domInfo.parseOutgoingMessage);

//   // textbox.addEventListener('keydown', domInfo.suppressParsing);

//   // textbox.addEventListener('keyup', domInfo.allowParsing);

//   textbox.addEventListener('keydown', (keystroke) => {
//     if (domInfo.getMessageGrid() && keystroke.key === 'Enter') {
//       handleSendStatus(domInfo.getMessageGrid(), domInfo);
//     }
//   });

//   // domInfo.setThreadComposer(chat);
//   // domInfo.observeThreadComposer();

//   domInfo.setSendButton(chat);
//   console.log(`domInfo.getSendButton() is ${domInfo.getSendButton()}`);

//   const clickHandler = () => {
//     console.log('click detected');
//     if (
//       domInfo.getSendButton().getAttribute('aria-label') ===
//       'Press enter to send'
//     ) {
//       console.log('handling send status now');
//       handleSendStatus(domInfo.getMessageGrid(), domInfo);
//       // handleSendStatus(domInfo.getMessageGrid(), domInfo);
//       domInfo.getSendButton().removeEventListener('click', clickHandler);
//     }
//   };

//   // Really, you should not have to check if domInfo.#sendButton is null. Prior to this, you should ensure it's not null.
//   if (domInfo.getSendButton()) {
//     domInfo.getSendButton().addEventListener('click', clickHandler);
//   }

//   // domInfo.observeSendButton();
//   // domInfo.setSendButtonContainer(chat);
//   // console.log(
//   //   `domInfo.getSendButtonContainer() is ${domInfo.getSendButtonContainer()}`
//   // );
//   // domInfo.observeSendButtonContainer();
// };

// const handleTextbox = (chat, domInfo) => {
//   let textbox = chat.querySelector(
//     'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.notranslate'
//   );

//   const waitToListenForOutgoingMessages = () => {
//     if (textbox === null) {
//       setTimeout(() => {
//         textbox = chat.querySelector(
//           'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.notranslate'
//         );
//       }, 100);
//     } else {
//       listenForOutgoingMessages(chat, textbox, domInfo);
//     }
//   };
//   waitToListenForOutgoingMessages();

//   // TODO: Listen for clicks on send button, not just keypresses on textbox. Likely still need something like sendButtonCreationObserver.
//   //
//   // const sendButton = document.querySelector(
//   //   'div[aria-label="Press enter to send"][role="button"].x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.xe8uvvx.xdj266r.xat24cr.x2lwn1j.xeuugli.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x1c4vz4f.x2lah0s.xsgj6o6.xw3qccf.x1y1aw1k.x1sxyh0.xwib8y2.xurb0ha'
//   // );
//   // if (sendButton !== undefined && sendButton !== null) {
//   //   console.log(`sendButton created`);
// };

const handleChat = (domInfo = null) => {
  const chat = domInfo.getChat();
  if (
    domInfo !== null &&
    domInfo.getChat() &&
    'querySelector' in domInfo.getChat()
  ) {
    const waitToHandleMessages = () => {
      if (domInfo.getMessageGrid() === null) {
        console.log(`messageGrid IS null`);
        setTimeout(() => {
          domInfo.setChat(chat);
          domInfo.setMessageGrid();
          waitToHandleMessages();
        }, 100);
      } else {
        console.log(`messageGrid is NOT null`);
        domInfo.setBubbleSource(domInfo.getMessageGrid());
        handleMessageGrid(domInfo);
        // handleTextbox(chat, domInfo);
      }
    };
    waitToHandleMessages();
  }
};

const handleChatBoxContainer = (domInfo) => {
  // console.log('before for loop in handleChatBoxContainer...');
  // Sometimes 0 chat boxes are found despite 1 or more's being open, so you need to wait until any open ones are findable before setting/handling
  domInfo.setChatBoxes();
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
  // console.log('after for loop in handleChatBoxContainer...');
  // domInfo.setChatBoxes(); // Just for testing purposes
  domInfo.observeChatBoxContainer();
};

const startUp = () => {
  const domInfo = new DomInfo();

  domInfo.setAccountControlsAndSettings();
  domInfo.observeAccountControlsAndSettings();

  if (window.location.href.startsWith('https://www.facebook.com/messages')) {
    domInfo.setMessengerChatContainer();
    domInfo.observeMessengerChatContainer();
    domInfo.setChat();

    const waitToHandleChat = () => {
      // console.log(`domInfo.getChat() = ${domInfo.getChat()}`);
      if (domInfo.getChat() === null) {
        domInfo.ignoreMessengerChatContainer();
        setTimeout(() => {
          domInfo.setMessengerChatContainer();
          domInfo.observeMessengerChatContainer();

          domInfo.setChat();

          waitToHandleChat();
        }, 100);
      } else {
        handleChat(domInfo);
      }
    };
    console.log(`domInfo.getChat() = ${domInfo.getChat()}`);
    if (domInfo.getChat() === null) {
      waitToHandleChat();
    } else {
      domInfo.setMessageGrid();
      domInfo.setBubbleSource(domInfo.getMessageGrid());
      handleOldChatBubbles(domInfo);
      handleMessageGrid(domInfo);
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
    console.log(
      `domInfo.getChatBoxContainer() = ${domInfo.getChatBoxContainer()}`
    );
    // if (domInfo.getChatBoxContainer() === null) {
    waitToHandleChatBoxContainer();
    // } else {
    //   domInfo.setMessageGrid();
    //   domInfo.setBubbleSource(domInfo.getMessageGrid());
    //   handleOldChatBubbles(domInfo);
    //   handleMessageGrid(domInfo);
    // }
  }
};

window.onload = () => {
  console.log('Page loaded');
  startUp();
};

// A variant of startUp, specifically for cases where addition of Messenger control is observed (switching from Messenger to chat box view)
const reset = () => {
  const domInfo = new DomInfo();

  domInfo.setAccountControlsAndSettings();
  domInfo.observeAccountControlsAndSettings();

  domInfo.setChatBoxContainer();

  console.log(
    `domInfo.getChatBoxContainer() = ${domInfo.getChatBoxContainer()}`
  );

  domInfo.setChatBoxes();
  if (domInfo.getChatBoxes().length !== 0) {
    for (const chat of domInfo.getChatBoxes()) {
      // if (
      //   /* !domInfo.getHandledChats().includes(chat) && */
      //   !chat.firstChild.firstChild.hidden
      // ) {
      domInfo.setChat(chat);
      domInfo.setMessageGrid();
      domInfo.setBubbleSource(domInfo.getMessageGrid());
      handleOldChatBubbles(domInfo);
      // handleChat(domInfo);
      handleMessageGrid(domInfo);
      // domInfo.markAsHandled(chat);
      // }
    }
  }
  domInfo.observeChatBoxContainer();
};
