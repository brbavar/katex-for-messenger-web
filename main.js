class DomInfo {
  #chat = null;
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
            handleChat(node, messageGrid);
          }
          // const chatSettingsButton = node.querySelector(
          //   'div[aria-label="Chat settings"][role="button"].x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.xe8uvvx.xdj266r.xat24cr.x1mh8g0r.x2lwn1j.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.xs83m0k.x1emribx.xeuugli'
          // );
          // if (!this.#chatSettingsButtons.includes(chatSettingsButton)) {
          //   this.#chatSettingsButtons.push(chatSettingsButton);

          //   chatSettingsButton.addEventListener('click', () => {
          //     setTimeout(() => {
          //       console.log(
          //         `delaying queries and addition of event listener for 10 ms`
          //       );
          //       const chatMenu = document.querySelector(
          //         'div[aria-label="Chat tab settings"][role="menu"].x1n2onr6.x1jqylkn.xe5xk9h'
          //       );
          //       const openInMessengerButton = chatMenu.querySelector(
          //         '[href^="/messages"][role="menuitem"].x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.xe8uvvx.x1hl2dhg.xggy1nq.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x87ps6o.x1lku1pv.x1a2a7pz.xjyslct.x9f619.x1ypdohk.x78zum5.x1q0g3np.x2lah0s.x1i6fsjq.xfvfia3.xnqzcj9.x1gh759c.x1n2onr6.x16tdsg8.x1ja2u2z.x6s0dn4.x1y1aw1k.xwib8y2.x1q8cg2c.xnjli0'
          //       );
          //       openInMessengerButton.addEventListener(
          //         'click',
          //         () => {
          //           console.log(`delaying startUp for 10 ms`);
          //           setTimeout(startUp, 10);
          //         } /* () => {
          //                 this.reset();
          //                 this.setChat();
          //               } */
          //       );
          //     }, 10);
          //   });
          // }
        }
      });
      mutation.removedNodes.forEach((node) => {
        let i = this.#chatBoxes.indexOf(node);
        if (i !== -1) {
          this.#chatBoxes.splice(i, 1);
          this.#chatSettingsButtons.splice(i, 1);
        }
      });
    });
  });
  #chatBoxes = [];
  #chatSettingsButtons = [];
  #chatSettingsButton = null;
  #chatMenu = null;
  #openInMessengerButton = null;

  // reset() {
  //   [this.#chat, this.#chatBoxContainer, this.#chatSettingsButton, this.#chatMenu, this.#openInMessengerButton].forEach((el) => {
  //     el = null;
  //   });
  //   [(this.#chatBoxes, this.#chatSettingsButtons)].forEach((arr) => {
  //     arr.length = 0;
  //   });
  // }

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
  }

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
    this.#chatBoxes.length = 0;
    console.log(`${this.#chatBoxContainer.children.length} chatBoxes found`);
    for (const chatBox of this.#chatBoxContainer.children) {
      this.#chatBoxes.push(chatBox);

      this.setChatSettingsButton(chatBox);
      console.log(
        `chatSettingsButton starts off with a value of ${
          this.#chatSettingsButton
        }`
      );
      if (this.#chatSettingsButton === null) {
        // console.log(`chatSettingsButton starts off null`);

        setTimeout(() => {
          this.setChatSettingsButton(chatBox);
          console.log(
            `But after 300 ms chatSettingsButton is ${this.#chatSettingsButton}`
          ); // sometimes still null after 200 ms

          this.handleChatSettingsButtons();
        }, 300);
      } else {
        this.handleChatSettingsButtons();
      }
    }
  }

  getChatSettingsButtons() {
    return this.#chatSettingsButtons;
  }

  setChatSettingsButtons() {
    this.#chatSettingsButtons.length = 0;
    for (const chatBox of this.#chatBoxes) {
      this.#chatSettingsButtons.push(
        chatBox.querySelector(
          'div[aria-label="Chat settings"][role="button"].x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.xe8uvvx.xdj266r.xat24cr.x1mh8g0r.x2lwn1j.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.xs83m0k.x1emribx.xeuugli'
        )
      );
    }
  }

  handleChatSettingsButtons() {
    this.#chatSettingsButtons.push(this.#chatSettingsButton);

    this.#chatSettingsButton.addEventListener('click', () => {
      this.setChatMenu();
      if (this.#chatMenu === null) {
        console.log(`chatMenu starts off null`);
        setTimeout(() => {
          this.setChatMenu();
          console.log(`But after 50 ms chatMenu is ${this.#chatMenu}`);
          this.setOpenInMessengerButton();

          this.#openInMessengerButton.addEventListener('click', () => {
            setTimeout(startUp, 50);
          });
        }, 50);
      } else {
        console.log(
          `chatMenu starts off not null but with a value of ${this.#chatMenu}`
        );
        this.setOpenInMessengerButton();

        this.#openInMessengerButton.addEventListener('click', () => {
          setTimeout(startUp, 10);
        });
      }
    });
  }

  getChatSettingsButton() {
    return this.#chatSettingsButton;
  }

  setChatSettingsButton(chatBox) {
    this.#chatSettingsButton = chatBox.querySelector(
      'div[aria-label="Chat settings"][role="button"].x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.xe8uvvx.xdj266r.xat24cr.x1mh8g0r.x2lwn1j.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.xs83m0k.x1emribx.xeuugli'
    );
  }

  getChatMenu() {
    return this.#chatMenu;
  }

  setChatMenu() {
    this.#chatMenu = document.querySelector(
      'div[aria-label="Chat tab settings"][role="menu"].x1n2onr6.x1jqylkn.xe5xk9h'
    );
  }

  getOpenInMessengerButton() {
    return this.#openInMessengerButton;
  }

  setOpenInMessengerButton() {
    this.#openInMessengerButton = this.#chatMenu.querySelector(
      '[href^="/messages"][role="menuitem"].x1i10hfl.xjbqb8w.x1ejq31n.xd10rxx.x1sy0etr.x17r0tee.x972fbf.xcfux6l.x1qhh985.xm0m39n.xe8uvvx.x1hl2dhg.xggy1nq.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x87ps6o.x1lku1pv.x1a2a7pz.xjyslct.x9f619.x1ypdohk.x78zum5.x1q0g3np.x2lah0s.x1i6fsjq.xfvfia3.xnqzcj9.x1gh759c.x1n2onr6.x16tdsg8.x1ja2u2z.x6s0dn4.x1y1aw1k.xwib8y2.x1q8cg2c.xnjli0'
    );
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

let chatBubbleObserver;

const handleChatBubbles = (node) => {
  if ('querySelectorAll' in node) {
    const yourChatBubbles = node.querySelectorAll(
      '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xat24cr.xdj266r.xeuugli.x1vjfegm'
    );
    const theirChatBubbles = node.querySelectorAll(
      '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x12nagc.x1yc453h.x126k92a.x18lvrbx'
    );
    [...yourChatBubbles, ...theirChatBubbles].forEach(parseContent);
  }
};

const handleMessageGrid = (grid) => {
  handleChatBubbles(grid);

  chatBubbleObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(handleChatBubbles);
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
    // console.log(`textbox starts off null`);
    setTimeout(() => {
      textbox = chat.querySelector(
        'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.notranslate'
      );
      // console.log(`But after delay textbox is ${textbox}`); // sometimes still null after 200 ms
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

const handleChat = (chat, messageGrid = null) => {
  if (messageGrid === null) {
    console.log(`messageGrid starts off null`);
    setTimeout(() => {
      messageGrid = chat.querySelector(
        'div[aria-label^="Messages in conversation"][role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
      );
      console.log(`But after 250 ms messageGrid is ${messageGrid}`);
      handleMessageGrid(messageGrid);

      // Set up keydown event listener below, parse and render preexisting messages containing TeX code above

      handleTextbox(chat);
    }, 250);
  } else {
    handleMessageGrid(messageGrid);

    // Set up keydown event listener below, parse and render preexisting messages containing TeX code above

    handleTextbox(chat);
  }
};

const handleChatBoxContainer = (domInfo) => {
  domInfo.setChatBoxes();
  if (domInfo.getChatBoxes() !== null) {
    for (const chat of domInfo.getChatBoxes()) {
      handleChat(chat);
    }
  } else {
    console.log(`chatBoxes starts off null`);
  }
  domInfo.observeChatBoxContainer();
};

const startUp = () => {
  const domInfo = new DomInfo();

  if (window.location.href.startsWith('https://www.facebook.com/messages')) {
    domInfo.setChat();
    if (domInfo.getChat() === undefined || domInfo.getChat() === null) {
      console.log('chat starts off null');
      setTimeout(() => {
        domInfo.setChat();
        console.log(`But after 200 ms chat is ${domInfo.getChat()}`);
        handleChat(domInfo.getChat());
      }, 200);
    } else {
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
      handleChat(domInfo.getChat());
    }
  } else {
    domInfo.setChatBoxContainer();

    // console.log(
    //   `chatBoxContainer starts off with value of ${domInfo.getChatBoxContainer()}, containing ${
    //     domInfo.getChatSettingsButtons().length
    //   } chatSettingsButtons`
    // );

    if (domInfo.getChatBoxContainer() === null) {
      setTimeout(() => {
        domInfo.setChatBoxContainer();
        // console.log(
        //   `But after 200 ms chatBoxContainer is ${domInfo.getChatBoxContainer()}, containing ${
        //     domInfo.getChatSettingsButtons().length
        //   } chatSettingsButtons`
        // ); // sometimes still null after 100 ms
        if (domInfo.getChatSettingsButtons().length === 0) {
          setTimeout(() => {
            domInfo.setChatSettingsButtons();
            // console.log(
            //   `But after 200 ms chatBoxContainer is ${domInfo.getChatBoxContainer()}, containing ${
            //     domInfo.getChatSettingsButtons().length
            //   } chatSettingsButtons`
            // );
            handleChatBoxContainer(domInfo);
          }, 200);
        } else {
          handleChatBoxContainer(domInfo);
        }
      }, 200);
    } else {
      if (domInfo.getChatSettingsButtons().length === 0) {
        setTimeout(() => {
          domInfo.setChatSettingsButtons();
          // console.log(
          //   `But after 200 ms chatBoxContainer is ${domInfo.getChatBoxContainer()}, containing ${
          //     domInfo.getChatSettingsButtons().length
          //   } chatSettingsButtons`
          // );
          handleChatBoxContainer(domInfo);
        }, 200);
      } else {
        handleChatBoxContainer(domInfo);
      }
    }
  }
};

window.onload = startUp;

(() => {
  const pushState = history.pushState;
  history.pushState = () => {
    pushState.apply(history /*, arguments */);
    window.dispatchEvent(new Event('locationchange'));
  };

  const replaceState = history.replaceState;
  history.replaceState = () => {
    replaceState.apply(history /*, arguments */);
    window.dispatchEvent(new Event('locationchange'));
  };

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'));
  });

  window.addEventListener('locationchange', () => {
    console.log('URL changed to:', window.location.href);
    startUp();
  });
})();
