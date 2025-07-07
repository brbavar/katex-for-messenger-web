class DomInfo {
  #accountControlsAndSettings = null;
  #chat = null;
  #messengerChatContainer = null;
  #chatBoxContainer = null;
  #chatMenu = null;
  #openInMessengerButton = null;
  #messageGrid = null;
  #bubbleSource = null;
  #bubble = null;
  #chatBoxes = [];
  #parsedBubbles = [];
  #handledChats = [];

  #accountControlsAndSettingsObserver = new MutationObserver((mutations) => {
    console.log(`accountControlsAndSettings mutated`);
    let messengerControlSeen = false;
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        const messengerControl = node.querySelector('[aria-label="Messenger"]');
        if (messengerControl !== null) {
          console.log(`messenger control added`);
          this.#accountControlsAndSettingsObserver.disconnect();
          startUp();
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
          handleChat(this);
        }
      });
    });
  });

  #chatBoxContainerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        const messageGrid = node.querySelector(
          '[aria-label^="Messages in conversation"]'
        );
        if (messageGrid !== null) {
          if (![...this.#chatBoxes, ...this.#handledChats].includes(node)) {
            this.#chatBoxes.push(node);
            this.#chat = node;
            this.#messageGrid = messageGrid;
            handleChat(this);
            this.#handledChats.push(node);
          }
        }
      });
      mutation.removedNodes.forEach((node) => {
        let i = this.#chatBoxes.indexOf(node);
        if (i !== -1) {
          this.#chatBoxes.splice(i, 1);
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
    // Condition below never satisfied in actual use of method
    if (arguments.length === 1) {
      this.#chat = chat;
    }
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

  getChatBoxContainer() {
    return this.#chatBoxContainer;
  }

  setChatBoxContainer() {
    this.#chatBoxContainer = document.querySelector(
      'div.x1ey2m1c.x78zum5.xixxii4.x1vjfegm'
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
    this.#chatBoxes.length = 0;
    console.log(`${this.#chatBoxContainer.children.length} chatBoxes found`);
    for (const chatBox of this.#chatBoxContainer.children) {
      if (!this.#handledChats.includes(chatBox)) {
        this.#chatBoxes.push(chatBox);
      }
    }
  }

  getChatMenu() {
    return this.#chatMenu;
  }

  setChatMenu() {
    this.#chatMenu = document.querySelector(
      'div[aria-label="Chat tab settings"][role="menu"].x1n2onr6.xe5xk9h'
    );
  }

  getOpenInMessengerButton() {
    return this.#openInMessengerButton;
  }

  setOpenInMessengerButton() {
    this.#openInMessengerButton = this.#chatMenu.querySelector(
      '[href^="/messages"][role="menuitem"].x1i10hfl.xjbqb8w.x1ejq31n.x1sy0etr.x972fbf.x1qhh985.xe8uvvx.x1hl2dhg.xggy1nq.x87ps6o.x1lku1pv.x1a2a7pz.xjyslct.x9f619.x1ypdohk.x78zum5.x1q0g3np.x2lah0s.x1i6fsjq.xfvfia3.x1n2onr6.x16tdsg8.x1ja2u2z.x6s0dn4.x1y1aw1k.xwib8y2'
    );
  }

  getMessageGrid() {
    return this.#messageGrid;
  }

  setMessageGrid() {
    this.#messageGrid = this.#chat.querySelector(
      'div[aria-label^="Messages in conversation"][role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
    );
  }

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

const parseContent = (domInfo = null) => {
  if (
    domInfo === null ||
    !domInfo.getParsedBubbles().includes(domInfo.getBubble())
  ) {
    const msg = domInfo
      .getBubble()
      .querySelector('.html-div.xexx8yu.x18d9i69.x1gslohp.x12nagc.x1yc453h');
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
      domInfo.markAsParsed(domInfo.getBubble());
    }
  }
};

const isOfTheClasses = (el, theCs) => {
  for (const c of theCs) {
    if (!'classList' in el || !el.classList.contains(c)) return false;
  }
  return true;
};

const getNewChatBubble = (sendStatusTxtNode) => {
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

// const sendStatusObserver = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     const characterData = mutation.target;
//     if (characterData.data === 'Sent') {
//       const bubble = getNewChatBubble(mutation.target);
//       parseContent(bubble);

//       sendStatusObserver.disconnect();
//     }
//   });
// });

let chatBubbleObserver;

const handleChatBubbles = (domInfo) => {
  if (
    domInfo.getBubbleSource() !== null &&
    'querySelectorAll' in domInfo.getBubbleSource()
  ) {
    const chatBubbles = domInfo
      .getBubbleSource()
      .querySelectorAll(
        '.html-div.xexx8yu.x18d9i69.xat24cr.xdj266r.xeuugli.x1vjfegm'
      );

    chatBubbles.forEach((bubble) => {
      domInfo.setBubble(bubble);
      parseContent(domInfo);
    });
  }
};

const handleMessageGrid = (domInfo = null) => {
  domInfo.setBubbleSource(domInfo.getMessageGrid());
  handleChatBubbles(domInfo);

  chatBubbleObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        domInfo.setBubbleSource(node);
        handleChatBubbles(domInfo);
      });
    });
  });

  chatBubbleObserver.observe(domInfo.getMessageGrid(), {
    childList: true,
    subtree: true,
  });
};

const listenForNewMessages = (chat, textbox, domInfo) => {
  const messageGrid = chat.querySelector(
    'div[aria-label^="Messages in conversation"][role="grid"].x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
  );
  textbox.addEventListener('keydown', (keystroke) => {
    if (
      messageGrid !== undefined &&
      messageGrid !== null &&
      keystroke.key === 'Enter'
    ) {
      // setTimeout(() => {
      //   const sendStatus = messageGrid.querySelector(
      //     'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.xat24cr.xexx8yu.x18d9i69.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x18d9i69.x1n2onr6.x12nagc.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.xat24cr.xexx8yu.x18d9i69.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
      //   );
      //   if (sendStatus !== null) {
      //     if (sendStatus.firstChild.nodeValue === 'Sent') {
      //       domInfo.setBubble(getNewChatBubble(sendStatus.firstChild));
      //       parseContent(domInfo);
      //     } else {
      //       sendStatusObserver.observe(sendStatus.firstChild, {
      //         characterData: true,
      //       });
      //     }
      //   } else {
      //     console.log(
      //       `The message was sent too slowly for your formulas to be typeset. Try again!`
      //     );
      //   }
      // }, 2000);

      const oldSendStatus = messageGrid.querySelector(
        'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.xat24cr.xexx8yu.x18d9i69.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x18d9i69.x1n2onr6.x12nagc.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.xat24cr.xexx8yu.x18d9i69.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
      );
      let sendStatus = oldSendStatus;
      const waitForNewSendStatus = () => {
        if (sendStatus === oldSendStatus) {
          setTimeout(() => {
            sendStatus = messageGrid.querySelector(
              'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.xat24cr.xexx8yu.x18d9i69.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x18d9i69.x1n2onr6.x12nagc.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.xat24cr.xexx8yu.x18d9i69.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
            );
            waitForNewSendStatus();
          }, 100);
        } else {
          const waitToParseContent = () => {
            if (sendStatus === null) {
              console.log(`sendStatus is still null...`);
              setTimeout(() => {
                sendStatus = messageGrid.querySelector(
                  'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.xat24cr.xexx8yu.x18d9i69.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x18d9i69.x1n2onr6.x12nagc.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.xat24cr.xexx8yu.x18d9i69.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
                );
                waitToParseContent();
              }, 100);
            } else {
              if (sendStatus.firstChild.nodeValue !== 'Sent') {
                console.log(
                  `Not done sending yet... (nodeValue = ${sendStatus.firstChild.nodeValue})`
                );
                setTimeout(waitToParseContent, 100);
              } else {
                console.log(`Sent!`);
                domInfo.setBubble(getNewChatBubble(sendStatus.firstChild));
                parseContent(domInfo);
              }
            }
          };
          waitToParseContent();
        }
      };
      waitForNewSendStatus();
    }
  });
};

const handleTextbox = (chat, domInfo) => {
  let textbox = chat.querySelector(
    'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.notranslate'
  );
  // if (textbox === null) {
  //   setTimeout(() => {
  //     textbox = chat.querySelector(
  //       'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.notranslate'
  //     );

  //     listenForNewMessages(chat, textbox, domInfo);
  //   }, 500);
  // } else {
  //   listenForNewMessages(chat, textbox, domInfo);
  // }

  const waitToListenForNewMessages = () => {
    if (textbox === null) {
      setTimeout(() => {
        textbox = chat.querySelector(
          'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.notranslate'
        );
      }, 100);
    } else {
      listenForNewMessages(chat, textbox, domInfo);
    }
  };
  waitToListenForNewMessages();

  // TODO: Listen for clicks on send button, not just keypresses on textbox. Likely still need something like sendButtonCreationObserver.
  //
  // const sendButton = document.querySelector(
  //   'div[aria-label="Press enter to send"][role="button"].x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.xe8uvvx.xdj266r.xat24cr.x2lwn1j.xeuugli.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x1c4vz4f.x2lah0s.xsgj6o6.xw3qccf.x1y1aw1k.x1sxyh0.xwib8y2.xurb0ha'
  // );
  // if (sendButton !== undefined && sendButton !== null) {
  //   console.log(`sendButton created`);
};

const handleChat = (domInfo = null) => {
  const chat = domInfo.getChat();
  // TODO: Make sure chat is not null
  if (
    domInfo !== null &&
    domInfo.getChat() !== null &&
    'querySelector' in domInfo.getChat()
  ) {
    // if (domInfo.getMessageGrid() === null) {
    //   console.log(`messageGrid starts off null`);
    //   setTimeout(() => {
    //     domInfo.setChat(chat);
    //     domInfo.setMessageGrid();
    //     console.log(
    //       `But after 1250 ms messageGrid is ${domInfo.getMessageGrid()}`
    //     ); // sometimes still null after 1000 ms
    //     handleMessageGrid(domInfo);

    //     // Set up keydown event listener below, parse and render preexisting messages containing TeX code above

    //     handleTextbox(chat, domInfo);
    //   }, 1250);
    // } else {
    //   handleMessageGrid(domInfo);

    //   // Set up keydown event listener below, parse and render preexisting messages containing TeX code above

    //   handleTextbox(chat, domInfo);
    // }

    const waitToHandleMessages = () => {
      if (domInfo.getMessageGrid() === null) {
        setTimeout(() => {
          domInfo.setChat(chat);
          domInfo.setMessageGrid();
          waitToHandleMessages();
        }, 100);
      } else {
        handleMessageGrid(domInfo);
        handleTextbox(chat, domInfo);
      }
    };
    waitToHandleMessages();
  }
};

const handleChatBoxContainer = (domInfo) => {
  domInfo.setChatBoxes();
  if (domInfo.getChatBoxes().length !== 0) {
    for (const chat of domInfo.getChatBoxes()) {
      if (!domInfo.getHandledChats().includes(chat)) {
        domInfo.setChat(chat);
        handleChat(domInfo);
        domInfo.markAsHandled(chat);
      }
    }
  }
  domInfo.observeChatBoxContainer();
};

// const waitTo = (
//   handle,
//   args,
//   condition,
//   doBeforeWait,
//   doAfterWait /*, reset*/
// ) => {
//   console.log(`inside waitTo`);
//   if (condition) {
//     doBeforeWait();
//     setTimeout(() => {
//       doAfterWait();
//       // reset(condition);
//       waitTo(handle, args, condition, doBeforeWait, doAfterWait /*, reset*/);
//     }, 100);
//   } else {
//     handle(...args);
//   }
// };

const startUp = () => {
  const domInfo = new DomInfo();

  domInfo.setAccountControlsAndSettings();
  domInfo.observeAccountControlsAndSettings();

  if (window.location.href.startsWith('https://www.facebook.com/messages')) {
    domInfo.setMessengerChatContainer();
    domInfo.observeMessengerChatContainer();
    console.log(
      `messengerChatContainer starts off as ${domInfo.getMessengerChatContainer()}`
    );

    domInfo.setChat();

    // if (domInfo.getChat() === null) {
    //   console.log('chat starts off null');
    //   domInfo.ignoreMessengerChatContainer();
    //   setTimeout(() => {
    //     domInfo.setMessengerChatContainer();
    //     domInfo.observeMessengerChatContainer();

    //     domInfo.setChat();
    //     console.log(
    //       `But after 1500 ms chat is ${domInfo.getChat()} and messengerChatContainer is ${domInfo.getMessengerChatContainer()}`
    //     ); // sometimes chat is still null after 1250 ms

    //     handleChat(domInfo);
    //   }, 1500);
    // } else {
    //   handleChat(domInfo);
    // }

    const waitToHandleChat = () => {
      if (domInfo.getChat() === null) {
        // console.log('chat is null');
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
    waitToHandleChat();

    // // let condition = domInfo.getChat() === null;

    // const doBeforeWait = () => {
    //   domInfo.ignoreMessengerChatContainer();
    // };

    // const doAfterWait = () => {
    //   domInfo.setMessengerChatContainer();
    //   domInfo.observeMessengerChatContainer();

    //   domInfo.setChat();
    // };

    // // const reset = (condition) => {
    // //   condition = domInfo.getChat() === null;
    // // };

    // waitTo(
    //   handleChat,
    //   [domInfo],
    //   domInfo.getChat === null,
    //   doBeforeWait,
    //   doAfterWait /*,
    //   reset*/
    // );
  } else {
    domInfo.setChatBoxContainer();
    // console.log(
    //   `chatBoxContainer starts off with value of ${domInfo.getChatBoxContainer()}`
    // );

    // if (domInfo.getChatBoxContainer() === null) {
    //   setTimeout(() => {
    //     domInfo.setChatBoxContainer();
    //     console.log(
    //       `But after 1750 ms chatBoxContainer is ${domInfo.getChatBoxContainer()}`
    //     ); // sometimes still null after 1500 ms
    //     handleChatBoxContainer(domInfo);
    //   }, 1750);
    // } else {
    //   handleChatBoxContainer(domInfo);
    // }

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

window.onload = () => {
  console.log('Page loaded');
  startUp();
};
