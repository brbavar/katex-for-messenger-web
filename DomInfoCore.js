import * as selector from './selector.js';
import { parseParts } from './parse.js';
import { makeFit, undoMakeFit } from './aesthetex.js';
import { findAncestor } from './util.js';
import { gridcellFeatures } from './config.js';

class DomInfoCore {
  #chat = null;
  #chatContainer = null;
  #resizeObservee = null;
  #messageGrid = null;
  #chatWidth = -1;
  #labelToBubbleObserver = new Map();
  // #editStatusContainerToObserver = new Map();
  #gridcellToEditStatusObserver = new Map();
  #observeeToActiveResizeObserver = new Map();
  #activeMutationObservers = [];
  #mapsToMutationObservers = [
    this.#labelToBubbleObserver,
    // this.#editStatusContainerToObserver,
    this.#gridcellToEditStatusObserver,
  ];

  #chatWidthObserver = new ResizeObserver(() => {
    if (
      this.#resizeObservee.getBoundingClientRect().width !== this.#chatWidth
    ) {
      this.#chatWidth = this.#resizeObservee.getBoundingClientRect().width;

      this.#messageGrid.querySelectorAll(selector.katex).forEach((span) => {
        undoMakeFit(span);
        makeFit(span);
      });
    }
  });

  #chatContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        let resizableChat = null;
        const waitForResizableChat = () => {
          if (
            'querySelector' in node &&
            (resizableChat = node.querySelector(selector.resizableChat))
          ) {
            const loneEntry = this.#labelToBubbleObserver
              .entries()
              .next().value;
            loneEntry[1].disconnect();
            this.#labelToBubbleObserver.delete(loneEntry[0]);

            this.#chat = resizableChat;
            this.setMessageGrid();
            this.handleChatBubbles();
            this.observeChatBubbles();
          } else {
            setTimeout(waitForResizableChat, 100);
          }
        };
        waitForResizableChat();
      });
    });
  });

  getChat() {
    return this.#chat;
  }

  setChat(chat) {
    if (arguments.length === 0) {
      this.#chat = document.querySelector(selector.resizableChat);
    }
    if (arguments.length === 1) {
      this.#chat = chat;
    }
  }

  getChatContainer() {
    return this.#chatContainer;
  }

  setChatContainer() {
    this.#chatContainer = document.querySelector(selector.chatContainer);
  }

  observeChatContainer() {
    if (this.#chatContainer !== null) {
      this.#chatContainerObserver.observe(this.#chatContainer, {
        childList: true,
      });

      this.#activeMutationObservers.push(this.#chatContainerObserver);
    }
  }

  ignoreChatContainer() {
    this.#chatContainerObserver.disconnect();

    const i = this.#activeMutationObservers.indexOf(
      this.#chatContainerObserver
    );
    if (i >= 0) {
      this.#activeMutationObservers.splice(i, 1);
    }
  }

  setResizeObservee() {
    this.#resizeObservee = document.querySelector(selector.resizeObservee);
  }

  setChatWidth() {
    this.#chatWidth = this.#resizeObservee.getBoundingClientRect().width;
  }

  observeChatWidth() {
    if (this.#resizeObservee !== null) {
      this.#chatWidthObserver.observe(this.#resizeObservee);

      this.#observeeToActiveResizeObserver.set(
        this.#resizeObservee,
        this.#chatWidthObserver
      );
    }
  }

  ignoreChatWidth() {
    this.#chatWidthObserver.unobserve(this.#resizeObservee);

    this.#observeeToActiveResizeObserver.delete(this.#resizeObservee);
  }

  getMessageGrid() {
    return this.#messageGrid;
  }

  setMessageGrid(pointOfReference = this.#chat) {
    if (selector.labeledMessageGrid === undefined) {
      this.#messageGrid = this.#chat;
    } else {
      let grid = pointOfReference.querySelector(selector.labeledMessageGrid);
      // Conditional statement below may be unnecessary
      if (grid === null) {
        grid = pointOfReference.querySelector(selector.messageGrid);
      }

      this.#messageGrid = grid;
    }
  }

  getLabelToBubbleObserver() {
    return this.#labelToBubbleObserver;
  }

  getActiveMutationObservers() {
    return this.#activeMutationObservers;
  }

  getMapsToMutationObservers() {
    return this.#mapsToMutationObservers;
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

  // Invisibly pin and unpin the edited message
  showLatestEdits(editStatusSource) {
    console.log(`editStatusSource:`);
    console.log(editStatusSource);
    const gridcell = findAncestor(editStatusSource, gridcellFeatures);
    if (gridcell !== null) {
      console.log(`edited gridcell:`);
      console.log(gridcell);

      // const hover = new MouseEvent('mouseover', {
      //   bubbles: true,
      //   cancelable: true,
      // });
      let hoverableRow = gridcell;
      let moreActionsButton = null;

      const pinMsg = () => {
        let moreActionsMenu = document.querySelector(selector.moreActionsMenu);
        const waitForMoreActionsMenu = () => {
          console.log(`moreActionsMenu:`);
          console.log(moreActionsMenu);
          if (moreActionsMenu === null) {
            setTimeout(() => {
              moreActionsMenu = document.querySelector(
                selector.moreActionsMenu
              );
              waitForMoreActionsMenu();
            }, 100);
          } else {
            // moreActionsMenu.style.visibility = 'hidden';
            moreActionsMenu.parentNode.parentNode.parentNode.style.visibility =
              'hidden';

            const actions = moreActionsMenu.querySelectorAll(
              'div[role="menuitem"]'
            );
            for (const action of actions) {
              console.log(`action:`);
              console.log(action);
              const actionTxt = action.querySelector(
                'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xk50ysn.xzsf02u.x1yc453h'
              ).textContent;
              console.log(`actionTxt:`);
              console.log(actionTxt);
              if (!action.hasAttribute('aria-label') && actionTxt === 'Pin') {
                action.click();
              }
            }

            // hoverableRow.removeEventListener('mouseover', hoverOverRow);
            moreActionsButton.removeEventListener('click', pinMsg);
          }
        };
        waitForMoreActionsMenu();
        // setTimeout(() => {
        // // const moreActionsMenu = document.querySelector(
        // //   selector.moreActionsMenu
        // // );
        // // console.log(`moreActionsMenu:`);
        // // console.log(moreActionsMenu);
        // moreActionsMenu.style.visibility = 'hidden';

        // const actions = moreActionsMenu.querySelectorAll(
        //   'div[role="menuitem"]'
        // );
        // for (const action of actions) {
        //   console.log(`action:`);
        //   console.log(action);
        //   const actionTxt = action.querySelector(
        //     'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xk50ysn.xzsf02u.x1yc453h'
        //   ).textContent;
        //   console.log(`actionTxt:`);
        //   console.log(actionTxt);
        //   if (!action.hasAttribute('aria-label') && actionTxt === 'Pin') {
        //     action.click();
        //   }
        // }

        // // hoverableRow.removeEventListener('mouseover', hoverOverRow);
        // moreActionsButton.removeEventListener('click', pinMsg);
        // }, 100);
      };

      // const clickButton = () => {
      //   moreActionsButton.addEventListener('click', pinMsg);
      //   moreActionsButton.dispatchEvent(new MouseEvent('click'));

      //   // moreActionsButton.removeEventListener('mouseenter', clickButton);
      //   moreActionsButton.removeEventListener('mouseover', clickButton);
      // };

      const hoverOverRow = () => {
        console.log(`hoverableRow:`);
        console.log(hoverableRow);

        const waitForMoreActionsButton = () => {
          if (moreActionsButton === null) {
            setTimeout(() => {
              // const moreActionsButton = gridcell.querySelector(
              //   selector.moreActionsButton
              // );
              // const moreActionsButton = hoverableRow.querySelector(
              //   selector.moreActionsButton
              // );
              moreActionsButton = hoverableRow.querySelector(
                selector.moreActionsButton
              );
              waitForMoreActionsButton();
            }, 100);
          } else {
            console.log(`moreActionsButton:`);
            console.log(moreActionsButton);
            hoverableRow.removeEventListener('mouseover', hoverOverRow);
            // // hoverableRow.removeEventListener('mouseenter', hoverOverRow);
            // if (moreActionsButton === null) {
            //   // hoverableRow.removeEventListener('mouseover', hoverOverRow);

            //   hoverableRow = hoverableRow.parentNode;
            //   hoverableRow.addEventListener('mouseover', hoverOverRow);
            //   // hoverableRow.dispatchEvent(hover);
            //   hoverableRow.dispatchEvent(
            //     new MouseEvent('mouseover', { bubbles: true })
            //   );
            //   // hoverableRow.addEventListener('mouseenter', hoverOverRow);
            //   // hoverableRow.dispatchEvent(new MouseEvent('mouseenter'));
            // } else {
            //   // // // // // const hover = new MouseEvent('mouseover', {
            //   // // // // //   bubbles: true,
            //   // // // // //   cancelable: true,
            //   // // // // // });
            //   // // // // // moreActionsButton.dispatchEvent(hover);
            //   // // // // moreActionsButton.click();
            moreActionsButton.addEventListener('click', pinMsg);
            moreActionsButton.dispatchEvent(
              new MouseEvent('click', { bubbles: true })
            );
            //   // // moreActionsButton.addEventListener('mouseenter', clickButton);
            //   // // moreActionsButton.dispatchEvent(new MouseEvent('mouseenter'));
            //   // moreActionsButton.addEventListener('mouseover', clickButton);
            //   // moreActionsButton.dispatchEvent(new MouseEvent('mouseover'));

            //   // const moreActionsMenu = document.querySelector(
            //   //   selector.moreActionsMenu
            //   // );
            //   // console.log(`moreActionsMenu:`);
            //   // console.log(moreActionsMenu);
            //   // moreActionsMenu.style.visibility = 'hidden';

            //   // const actions = moreActionsMenu.querySelectorAll(
            //   //   'div[role="menuitem"]'
            //   // );
            //   // for (const action of actions) {
            //   //   console.log(`action:`);
            //   //   console.log(action);
            //   //   const actionTxt = action.querySelector(
            //   //     'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xk50ysn.xzsf02u.x1yc453h'
            //   //   ).textContent;
            //   //   console.log(`actionTxt:`);
            //   //   console.log(actionTxt);
            //   //   if (!action.hasAttribute('aria-label') && actionTxt === 'Pin') {
            //   //     action.click();
            //   //   }
            //   // }

            //   // hoverableRow.removeEventListener('mouseover', hoverOverRow);
            // }
          }
        };
        waitForMoreActionsButton();
      };

      gridcell.addEventListener('mouseover', hoverOverRow);
      // gridcell.dispatchEvent(hover);
      gridcell.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      // gridcell.addEventListener('mouseenter', hoverOverRow);
      // gridcell.dispatchEvent(new MouseEvent('mouseenter'));

      // // const moreActionsMenuContainer = gridcell.querySelector(
      // //   selector.moreActionsMenuContainer
      // // );
      // const moreActionsButton = gridcell.querySelector(
      //   selector.moreActionsButton
      // );
      // console.log(`moreActionsButton:`);
      // console.log(moreActionsButton);

      // // const hover = new MouseEvent('mouseover', {
      // //   bubbles: true,
      // //   cancelable: true,
      // // });
      // // moreActionsButton.dispatchEvent(hover);
      // moreActionsButton.click();

      // const moreActionsMenu = document.querySelector(selector.moreActionsMenu);
      // console.log(`moreActionsMenu:`);
      // console.log(moreActionsMenu);
      // moreActionsMenu.style.visibility = 'hidden';

      // const actions = moreActionsMenu.querySelectorAll('div[role="menuitem"]');
      // for (const action of actions) {
      //   console.log(`action:`);
      //   console.log(action);
      //   const actionTxt = action.querySelector(
      //     'span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x4zkp8e.x3x7a5m.x6prxxf.xvq8zen.xk50ysn.xzsf02u.x1yc453h'
      //   ).textContent;
      //   console.log(`actionTxt:`);
      //   console.log(actionTxt);
      //   if (!action.hasAttribute('aria-label') && actionTxt === 'Pin') {
      //     action.click();
      //   }
      // }
    }
  }

  handleEditStatus(editStatusSource) {
    console.log(`handling edit status`);
    const editStatus = editStatusSource.querySelector(selector.editStatus);
    if (editStatus !== null) {
      console.log(`edit status found:`);
      console.log(editStatus);
      // console.log(`about to click edit status`);
      // editStatus.click();

      const editStatusObserver =
        // this.#editStatusContainerToObserver.get(editStatusSource);
        this.#gridcellToEditStatusObserver.get(editStatusSource);
      if (editStatusObserver !== undefined) {
        console.log(
          `disconnecting edit status observer and deleting map entry`
        );
        editStatusObserver.disconnect();
        // this.#editStatusContainerToObserver.delete(editStatusSource);
        this.#gridcellToEditStatusObserver.delete(editStatusSource);
      }
    }
  }

  #editStatusCreationHandler = (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        console.log(`addition of node to gridcell's subtree observed`);
        if (
          'querySelector' in node &&
          node.querySelector(selector.editStatus) !== null
        ) {
          console.log(`edit status created`);
          this.showLatestEdits(node);
          this.handleEditStatus(node);
        } else {
          console.log(`edit status NOT created`);
        }
      });
    });
  };

  handleChatBubbles(bubbleSource) {
    // console.log(`handling chat bubbles from this source:`);
    // console.log(bubbleSource);
    const bubbleHandler = (source) => {
      if (source && 'querySelectorAll' in source) {
        const chatBubbles = source.querySelectorAll(selector.chatBubble);
        chatBubbles.forEach((bubble) => {
          if (
            this.waitForCompleteMessage !== undefined &&
            this.isNewMessage(bubble)
          ) {
            this.waitForCompleteMessage(bubble);
          } else {
            parseParts(bubble);
          }
        });
        const gridcells = source.querySelectorAll(selector.gridcell);
        // console.log(`${gridcells.length} gridcells found`);
        gridcells.forEach((cell) => {
          // // // const chatBubbles = cell.querySelectorAll(selector.chatBubble);
          // // // chatBubbles.forEach((bubble) => {
          // // //   if (
          // // //     this.waitForCompleteMessage !== undefined &&
          // // //     this.isNewMessage(bubble)
          // // //   ) {
          // // //     this.waitForCompleteMessage(bubble);
          // // //   } else {
          // // //     parseParts(bubble);
          // // //   }
          // // // });
          // // const chatBubble = cell.querySelector(selector.chatBubble);
          // // console.log(`chatBubble:`);
          // // console.log(chatBubble);
          // // if (chatBubble !== null) {
          // //   // let gridChunk = null;
          // //   if (
          // //     this.waitForCompleteMessage !== undefined &&
          // //     this.isNewMessage(chatBubble /*, gridChunk*/)
          // //   ) {
          // //     console.log(`chatBubble is a new message, and gridChunk is:`);
          // //     const gridChunk = this.getGridChunk();
          // //     console.log(gridChunk);
          // //     this.waitForCompleteMessage(chatBubble, gridChunk);
          // //   } else {
          // //     console.log(
          // //       `chatBubble is NOT a new message, or this.waitForCompleteMessage is undefined`
          // //     );
          // //     parseParts(chatBubble);
          // //   }
          // // }

          // const editStatusContainers = cell.querySelectorAll(
          //   selector.editStatusContainer
          // );
          // console.log(
          //   `${editStatusContainers.length} edit status containers found in this gridcell:`
          // );
          // console.log(cell);
          // editStatusContainers.forEach((container) => {
          //   console.log(`edit status container:`);
          //   console.log(container);
          //   // const editStatus = container.querySelector(selector.editStatus);
          //   // if (editStatus )
          //   const editStatusObserver = new MutationObserver(
          //     this.#editStatusCreationHandler
          //   );
          //   editStatusObserver.observe(container, {
          //     childList: true,
          //     subtree: true,
          //   });

          //   this.#editStatusContainerToObserver.set(
          //     container,
          //     editStatusObserver
          //   );

          //   this.handleEditStatus(container);
          // });
          const editStatusObserver = new MutationObserver(
            this.#editStatusCreationHandler
          );
          editStatusObserver.observe(cell, {
            childList: true,
            subtree: true,
          });

          this.#gridcellToEditStatusObserver.set(cell, editStatusObserver);

          this.handleEditStatus(cell);
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

  disconnectObservers() {
    this.#activeMutationObservers.forEach((observer) => observer.disconnect());
    this.#activeMutationObservers.length = 0;

    for (const entry of this.#observeeToActiveResizeObserver.entries()) {
      if (entry[0] !== null) {
        entry[1].unobserve(entry[0]);
      }
    }
    this.#observeeToActiveResizeObserver.clear();

    for (const map of this.#mapsToMutationObservers) {
      for (const entry of map.entries()) {
        entry[1].disconnect();
      }
    }
  }
}

export { DomInfoCore };
