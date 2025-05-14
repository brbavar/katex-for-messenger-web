let chatBubbleObserver;

// const getMessageGrid = (domInfo, withWhomToChat) => {
//   let chat, messageGrid;
//   for (const chatBox of domInfo.getChatBoxes()) {
//     messageGrid = chatBox.querySelector(
//       'div[aria-label^="Messages in conversation"][role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
//     );
//     if (messageGrid.getAttribute('aria-label').endsWith(withWhomToChat)) {
//       chat = chatBox;
//       break;
//     }
//   }

//   // const textbox = document.querySelector(
//   //   'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.x1iyjqo2.x1gh3ibb.xisnujt.xeuugli.x1odjw0f.notranslate'
//   // );
//   if (chatBubbleObserver !== undefined) {
//     chatBubbleObserver.disconnect();
//   }
//   if (chat !== undefined && messageGrid !== undefined) {
//     handleOpenChat(chat, messageGrid);
//   }
// };

// const handleChatOpener = (opener, domInfo) => {
//   opener.addEventListener('click', () => {
//     const openerAriaLabel = opener.getAttribute('aria-label');
//     let withWhomToChat;
//     if (openerAriaLabel.startsWith('Open chat with')) {
//       withWhomToChat = openerAriaLabel.substring(15);
//     }
//     if (openerAriaLabel.startsWith('Open chat titled')) {
//       withWhomToChat = openerAriaLabel.substring(17);
//     }
//     console.log(`withWhomToChat = ${withWhomToChat}`);

//     setTimeout(() => {
//       domInfo.setChatBoxes();
//       console.log(`${domInfo.getChatBoxes().length} chatBoxes after 200 ms`);
//       getMessageGrid(domInfo, withWhomToChat);
//     }, 200);
//   });
// };

class DomInfo {
  #chat = null;
  #messengerButton = null;
  // #chatOpenerContainer = null;
  // #chatOpeners = [];
  // #chatOpenerObserver = new MutationObserver((mutations) => {
  //   mutations.forEach((mutation) => {
  //     mutation.addedNodes.forEach((node) => {
  //       const label = node.getAttribute('aria-label');
  //       if (label !== null && label.startsWith('Open chat')) {
  //         if (!this.#chatOpeners.includes(node)) {
  //           this.#chatOpeners.push(node);
  //           handleChatOpener(node, this);
  //         }
  //       }
  //     });
  //     mutation.removedNodes.forEach((node) => {
  //       const i = this.#chatOpeners.indexOf(node);
  //       if (i !== -1) {
  //         this.#chatOpeners.splice(i, 1);
  //       }
  //     });
  //   });
  // });
  #chatBoxContainer = null;
  #chatBoxContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        const messageGrid = node.querySelector(
          '[aria-label^="Messages in conversation"]'
        );
        if (messageGrid !== null) {
          if (!this.#chatBoxes.includes(node)) {
            this.#chatBoxes.push(node);
            handleOpenChat(node, messageGrid);
          }
        }
      });
      mutation.removedNodes.forEach((node) => {
        const i = this.#chatBoxes.indexOf(node);
        if (i !== -1) {
          this.#chatBoxes.splice(i, 1);
        }
      });
    });
  });
  #chatBoxes = [];

  getChat() {
    return this.#chat;
  }

  setChat(chatBox) {
    if (arguments.length === 0) {
      this.#chat = document.querySelector(
        'div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq'
      );
    }
    if (arguments.length === 1) {
      this.#chat = chatBox;
    }
    console.log(`chat has aria label ${this.#chat.getAttribute('aria-label')}`);
  }

  getMessengerButton() {
    return this.#messengerButton;
  }

  setMessengerButton() {
    this.#messengerButton = document.querySelector(
      'div[aria-label="Messenger"][role="button"].x1i10hfl.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x6s0dn4.xzolkzo.x12go9s9.x1rnf11y.xprq8jg.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x78zum5.xl56j7k.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x1vqgdyp.x100vrsf.x1qhmfi1'
    );
  }

  // getChatOpenerContainer() {
  //   return this.#chatOpenerContainer;
  // }

  // setChatOpenerContainer() {
  //   this.#chatOpenerContainer = document.querySelector(
  //     'div.x9f619.x1n2onr6.x1ja2u2z > div > div.x1ey2m1c.xds687c.xixxii4.x1vjfegm > div.xuk3077.x78zum5.xc8icb0 > div > div.x191j7n5.x92rtbv.x10l6tqk.x1useyqa'
  //   );
  // }

  // getChatOpeners() {
  //   return this.#chatOpeners;
  // }

  // setChatOpeners() {
  //   const openers = this.#chatOpenerContainer.querySelectorAll(
  //     'div[aria-label^="Open chat"][role="button"].x1i10hfl.x1qjc9v5.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.xjyslct.xjbqb8w.x14yjl9h.xudhj91.x18nykt9.xww2gxu.xsdox4t.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xx6bhzk.x11xpdln.x9lcvmn.x1useyqa'
  //   );
  //   for (const opener of openers) {
  //     this.#chatOpeners.push(opener);
  //   }
  // }

  // observeChatOpeners() {
  //   if (this.#chatOpenerContainer !== null) {
  //     this.#chatOpenerObserver.observe(this.#chatOpenerContainer, {
  //       childList: true,
  //       subtree: true,
  //     });
  //   }
  // }

  getChatBoxContainer() {
    return this.#chatBoxContainer;
  }

  setChatBoxContainer() {
    this.#chatBoxContainer = document.querySelector(
      'div.x1ey2m1c.x78zum5.x164qtfw.xixxii4.x1vjfegm'
    );
  }

  observeChatBoxContainer() {
    if (this.#chatBoxContainer !== null) {
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

const parsedBubbles = [];

const parseContent = (bubble) => {
  if (!parsedBubbles.includes(bubble)) {
    const msg = bubble.querySelector(
      '.html-div.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x11i5rnm.x12nagc.x1mh8g0r.x1yc453h.x126k92a.xyk4ms5'
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
    parsedBubbles.push(bubble);
  }
};

const getNewChatBubble = (sendStatusTxtNode) => {
  let searchNode = sendStatusTxtNode.parentNode;

  while (
    !(
      searchNode.classList.contains('html-div') &&
      searchNode.classList.contains('xdj266r') &&
      searchNode.classList.contains('x11i5rnm') &&
      searchNode.classList.contains('xat24cr') &&
      searchNode.classList.contains('x1mh8g0r') &&
      searchNode.classList.contains('xexx8yu') &&
      searchNode.classList.contains('x4uap5') &&
      searchNode.classList.contains('x4uap5') &&
      searchNode.classList.contains('x18d9i69') &&
      searchNode.classList.contains('xkhd6sd') &&
      searchNode.classList.contains('x1eb86dx') &&
      searchNode.classList.contains('x78zum5') &&
      searchNode.classList.contains('x13a6bvl')
    )
  ) {
    searchNode = searchNode.parentNode;
  }

  return searchNode.previousSibling;
};

const sendStatusObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const characterData = mutation.target;
    if (characterData.data === 'Sent') {
      const bubble = getNewChatBubble(mutation.target);
      parseContent(bubble);

      sendStatusObserver.disconnect();
    }
  });
});

const handleMessageGrid = (grid) => {
  chatBubbleObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if ('querySelectorAll' in node) {
          const yourChatBubbles = node.querySelectorAll(
            '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xat24cr.xdj266r.xeuugli.x1vjfegm'
          );
          const theirChatBubbles = node.querySelectorAll(
            '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x12nagc.x1yc453h.x126k92a.x18lvrbx'
          );
          [...yourChatBubbles, ...theirChatBubbles].forEach(parseContent);
        }
      });
    });
  });

  chatBubbleObserver.observe(grid, {
    childList: true,
    subtree: true,
  });
};

const listenForNewMessages = (chat, textbox) => {
  const messageGrid = chat.querySelector(
    'div[aria-label^="Messages in conversation"][role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
  );
  textbox.addEventListener('keydown', (keystroke) => {
    if (
      messageGrid !== undefined &&
      messageGrid !== null &&
      keystroke.key === 'Enter'
    ) {
      setTimeout(() => {
        const sendStatus = messageGrid.querySelector(
          'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
        );
        if (sendStatus !== null) {
          if (sendStatus.firstChild.nodeValue === 'Sent') {
            const bubble = getNewChatBubble(sendStatus.firstChild);
            parseContent(bubble);
          } else {
            sendStatusObserver.observe(sendStatus.firstChild, {
              characterData: true,
            });
          }
        } else {
          console.log(
            `The message was sent too slowly for your formulas to be typeset. Try again!`
          );
        }
      }, 500);
    }
  });
};

const handleTextbox = (chat) => {
  let textbox = chat.querySelector(
    'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.notranslate'
  );
  if (textbox === null) {
    console.log(`textbox starts off null`);
    setTimeout(() => {
      textbox = chat.querySelector(
        'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.notranslate'
      );
      console.log(`But after delay textbox is ${textbox}`); // sometimes still null after 200 ms
      listenForNewMessages(chat, textbox);
    }, 500);
  } else {
    listenForNewMessages(chat, textbox);
  }

  // TODO: Listen for clicks on send button, not just keypresses on textbox. Likely still need something like sendButtonCreationObserver.
  //
  // const sendButton = document.querySelector(
  //   'div[aria-label="Press enter to send"][role="button"].x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.xe8uvvx.xdj266r.xat24cr.x2lwn1j.xeuugli.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x1c4vz4f.x2lah0s.xsgj6o6.xw3qccf.x1y1aw1k.x1sxyh0.xwib8y2.xurb0ha'
  // );
  // if (sendButton !== undefined && sendButton !== null) {
  //   console.log(`sendButton created`);
};

// const handleOpenChat = (chat) => {
const handleOpenChat = (chat, messageGrid = null) => {
  if (messageGrid === null) {
    setTimeout(() => {
      messageGrid = chat.querySelector(
        'div[aria-label^="Messages in conversation"][role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
      );
      handleMessageGrid(messageGrid);

      // Set up keydown event listener below, parse and render preexisting messages containing TeX code above

      handleTextbox(chat);
    }, 200);
  } else {
    handleMessageGrid(messageGrid);

    // Set up keydown event listener below, parse and render preexisting messages containing TeX code above

    handleTextbox(chat);
  }
};

// const handleChatOpeners = (domInfo) => {
//   // console.log(`chatOpenerContainer contains ${chatOpeners.length} chatOpeners`);
//   domInfo.getChatOpeners().forEach((opener) => {
//     handleChatOpener(opener, domInfo);
//   });
//   domInfo.observeChatOpeners();
// };

const handleChatBoxContainer = (domInfo) => {
  domInfo.setChatBoxes();
  if (domInfo.getChatBoxes() !== null) {
    // chatBoxes.forEach(handleOpenChat); // may need to replace handleOpenChat with (chat) => { handleOpenChat(chat); }
    for (const chat of domInfo.getChatBoxes()) {
      handleOpenChat(chat);
    }
  }

  // if (domInfo.getChatOpenerContainer() !== null) {
  //   domInfo.setChatOpeners();

  //   console.log(
  //     `At first there are ${domInfo.getChatOpeners().length} chatOpeners`
  //   );

  //   if (domInfo.getChatOpeners().length === 0) {
  //     // console.log('chatOpeners starts off empty');
  //     setTimeout(() => {
  //       domInfo.setChatOpeners();
  //       console.log(
  //         `But after delay there are ${
  //           domInfo.getChatOpeners().length
  //         } chatOpeners`
  //       );
  //       handleChatOpeners(domInfo);
  //     }, 250);
  //   } else {
  //     handleChatOpeners(domInfo);
  //   }
  // }

  domInfo.observeChatBoxContainer();
};

window.onload = () => {
  // console.log('Page loaded');
  // console.log(`url is ${document.location.href}`);

  const domInfo = new DomInfo();

  if (document.location.href.startsWith('https://www.facebook.com/messages')) {
    // Specific to full-screen Messenger view: .x1iyjqo2.x1gh3ibb.xisnujt.xeuugli.x1odjw0f
    domInfo.setChat();
    // let textbox = document.querySelector(
    //   'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.x1iyjqo2.x1gh3ibb.xisnujt.xeuugli.x1odjw0f.notranslate'
    // );

    // if (textbox === null) {
    if (domInfo.getChat() === undefined || domInfo.getChat() === null) {
      console.log('chat starts off null');
      setTimeout(() => {
        // Specific to full-screen Messenger view: .x1iyjqo2.x1gh3ibb.xisnujt.xeuugli.x1odjw0f
        // textbox = document.querySelector(
        //   'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.x1iyjqo2.x1gh3ibb.xisnujt.xeuugli.x1odjw0f.notranslate'
        // );
        domInfo.setChat();
        // handleFullScreenChat(textbox);
        handleOpenChat(domInfo.getChat());
      }, 200);
    } else {
      // handleFullScreenChat(textbox);
      console.log(
        `domInfo.getChat() = ${domInfo.getChat()} rather than null or undefined`
      );
      console.log(
        `But ${
          document.querySelectorAll(
            'div[aria-label^="Conversation"][role="main"].x1ja2u2z.x9f619.x78zum5.xdt5ytf.x193iq5w.x1l7klhg.x1iyjqo2.xs83m0k.x2lwn1j.x6prxxf.x85a59c.x1n2onr6.xjbqb8w.xuce83p.x1bft6iq'
          ).length
        } elements match query selector`
      );
      handleOpenChat(domInfo.getChat());
    }
  } else {
    domInfo.setMessengerButton();
    // domInfo.setChatOpenerContainer();
    domInfo.setChatBoxContainer();

    // console.log(
    //   `chatOpenerContainer starts off with value of ${domInfo.getChatOpenerContainer()}; chatBoxContainer starts off with value of ${domInfo.getChatBoxContainer()}`
    // );
    console.log(
      `chatBoxContainer starts off with value of ${domInfo.getChatBoxContainer()}`
    );

    if (domInfo.getChatBoxContainer() === null) {
      // console.log('chatOpenerContainer starts off null');
      setTimeout(() => {
        domInfo.setChatBoxContainer();
        // domInfo.setChatOpenerContainer();
        // console.log(
        //   `But after 200 ms chatOpenerContainer is ${domInfo.getChatOpenerContainer()} and chatBoxContainer is ${domInfo.getChatBoxContainer()}`
        // ); // sometimes still both null after 100 ms
        console.log(
          `But after 200 ms chatBoxContainer is ${domInfo.getChatBoxContainer()}`
        ); // sometimes still null after 100 ms
        handleChatBoxContainer(domInfo);
      }, 200);
    } else {
      // if (domInfo.getChatOpenerContainer() === null) {
      //   setTimeout(() => {
      //     domInfo.setChatOpenerContainer();
      //     console.log(
      //       `But after 10 ms chatOpenerContainer is ${domInfo.getChatOpenerContainer()}`
      //     );
      //     handleChatBoxContainer(domInfo);
      //   }, 10);
      // } else {
      handleChatBoxContainer(domInfo);
      // }
    }
  }
};

// const chatOpenerObserver = () => {

// };

// chatOpenerObserver.observe(document.'', {  });

// const urlChangeObserver = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {});
// });

// urlChangeObserver.observe();
