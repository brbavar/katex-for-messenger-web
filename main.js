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

// const parseContent = (node) => {
//   const nodeType = node.constructor.name;
//   if (nodeType === 'HTMLDivElement') {
//     const yourChatBubbles = node.querySelectorAll(
//       '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xat24cr.xdj266r.xeuugli.x1vjfegm'
//     );
//     const theirChatBubbles = node.querySelectorAll(
//       '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x12nagc.x1yc453h.x126k92a.x18lvrbx'
//     );

//     [...yourChatBubbles, ...theirChatBubbles].forEach((bubble) => {
//       const msg = bubble.querySelector(
//         '.html-div.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x11i5rnm.x12nagc.x1mh8g0r.x1yc453h.x126k92a.xyk4ms5'
//       );
//       let texBounds;

//       if (msg !== null && msg.textContent != '') {
//         texBounds = getTexBounds(msg);
//       }

//       if (texBounds !== undefined) {
//         for (let i = 0; i < texBounds.length; i++) {
//           const offset = 32 * i;

//           msg.textContent = `${msg.textContent.substring(
//             0,
//             texBounds[i][0] + offset
//           )}<span class='renderable'>${msg.textContent.substring(
//             texBounds[i][0] + offset,
//             texBounds[i][1] + 2 + offset
//           )}</span>${msg.textContent.substring(texBounds[i][1] + 2 + offset)}`;
//         }

//         msg.innerHTML = msg.textContent;

//         msg.querySelectorAll('span.renderable').forEach((span) => {
//           katex.render(
//             span.textContent.substring(2, span.textContent.length - 2),
//             span,
//             {
//               displayMode: span.textContent[0] === '$',
//             }
//           );

//           const baseSpans = span.querySelectorAll(
//             'span:where(.katex, .katex-display) span.katex-html > span.base'
//           );
//           let collectiveSpanWidth = 0;

//           for (let baseSpan of baseSpans) {
//             collectiveSpanWidth += baseSpan.getBoundingClientRect().width;
//           }

//           let partialSumOfSpanWidths = collectiveSpanWidth;
//           if (
//             collectiveSpanWidth >
//             baseSpans[0].parentNode.getBoundingClientRect().width
//           ) {
//             for (let i = baseSpans.length - 1; i > -1; i--) {
//               if (
//                 partialSumOfSpanWidths -
//                   baseSpans[i].getBoundingClientRect().width <=
//                 baseSpans[0].parentNode.getBoundingClientRect().width - 10
//               ) {
//                 const spacer = document.createElement('div');
//                 spacer.style.lineHeight = '2px';
//                 baseSpans[0].parentNode.insertBefore(spacer, baseSpans[i]);
//                 if (
//                   collectiveSpanWidth - partialSumOfSpanWidths <=
//                   baseSpans[0].parentNode.getBoundingClientRect().width - 10
//                 ) {
//                   break;
//                 } else {
//                   collectiveSpanWidth = partialSumOfSpanWidths;
//                   // Recursively call the function this code belongs in, to deal
//                   // with cases where arbitrarily many line breaks are needed
//                 }
//               } else {
//                 partialSumOfSpanWidths -=
//                   baseSpans[i].getBoundingClientRect().width;
//               }
//             }
//           }
//         });
//       }
//     });
//   }
// };

// const chatBubbleObserver = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     mutation.addedNodes.forEach(parseContent);
//   });
// });

// // Don't observe whole DOM tree if you can help it
// chatBubbleObserver.observe(document.documentElement, {
//   childList: true,
//   subtree: true,
// });

// const sendStatusObserver = new MutationObserver((mutationRecord) => {
//   console.log('send status updated');
//   const characterData = mutationRecord.target;
//   if (characterData.data === 'Sent') {
//     console.log('sendStatus is now "Sent"');

//     const grid = document.querySelector(
//       'div[aria-label^="Messages in conversation with"][role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
//     );
//     parseContent(grid);

//     chatBubbleObserver.observe(document.documentElement, {
//       childList: true,
//       subtree: true,
//     });

//     sendStatusObserver.disconnect();
//   }
// });

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
    console.log('send status updated');
    const characterData = mutation.target;
    if (characterData.data === 'Sent') {
      console.log('sendStatus is now "Sent"');

      // const grid = document.querySelector(
      //   'div[aria-label^="Messages in conversation with"][role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
      // );
      // const chatBubbleJustSent = grid.querySelector(
      //   '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xat24cr.xdj266r.xeuugli.x1vjfegm:last-child'
      // );

      const bubble = getNewChatBubble(mutation.target);
      // parseContent(bubble.querySelector('.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xat24cr.xdj266r.xeuugli.x1vjfegm'));
      parseContent(bubble);

      // chatBubbleObserver.observe(document.documentElement, {
      //   childList: true,
      //   subtree: true,
      // });

      sendStatusObserver.disconnect();
    }
  });
});

// const sendStatusObserver = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     console.log(
//       `${mutation.addedNodes.length} nodes added to send-status span`
//     );
//     console.log(
//       `${mutation.removedNodes.length} nodes removed from send-status span`
//     );
//   });
// });

// const sendStatusCreationObserver = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     console.log(
//       `send-status span's parent gained ${mutation.addedNodes.length} child nodes`
//     );
//     console.log(
//       `send-status span's parent lost ${mutation.removedNodes.length} child nodes`
//     );
//     mutation.addedNodes.forEach((node) => {
//       if (
//         node.classList.contains('html-span') &&
//         node.classList.contains('xdj266r') &&
//         node.classList.contains('x11i5rnm') &&
//         node.classList.contains('xat24cr') &&
//         node.classList.contains('x1mh8g0r') &&
//         node.classList.contains('xexx8yu') &&
//         node.classList.contains('x4uap5') &&
//         node.classList.contains('x18d9i69') &&
//         node.classList.contains('xkhd6sd') &&
//         node.classList.contains('x1hl2dhg') &&
//         node.classList.contains('x16tdsg8') &&
//         node.classList.contains('x1vvkbs') &&
//         node.classList.contains('x1xf6ywa')
//       ) {
//         console.log('send status created');
//         // sendStatusObserver.observe(node, { characterData: true });
//       }
//     });
//   });
// });

// const sendButtonCreationObserver = new MutationObserver((mutations) => {
//   mutations.forEach(() => {
//     const sendButton = document.querySelector(
//       'div[aria-label="Press enter to send"][role="button"].x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.xe8uvvx.xdj266r.xat24cr.x2lwn1j.xeuugli.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x1c4vz4f.x2lah0s.xsgj6o6.xw3qccf.x1y1aw1k.x1sxyh0.xwib8y2.xurb0ha'
//     );
//     if (sendButton !== undefined && sendButton !== null) {
//       console.log(`sendButton created`);

//       const textbox = document.querySelector(
//         'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.x1iyjqo2.x1gh3ibb.xisnujt.xeuugli.x1odjw0f.notranslate'
//       );

//       textbox.addEventListener('keydown', (keystroke) => {
//         chatBubbleObserver.disconnect();

//         const grid = document.querySelector(
//           'div[aria-label^="Messages in conversation with"][role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
//         );

//         if (grid !== undefined && grid !== null && keystroke.key === 'Enter') {
//           console.log('Enter key pressed');

//           // // const sendStatusParent = grid.querySelector(
//           // //   'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r'
//           // // );
//           // // console.log(
//           // //   `sendStatusParent === undefined? ${sendStatusParent === undefined}`
//           // // );
//           // // console.log(
//           // //   `sendStatusParent === null? ${sendStatusParent === null}`
//           // // );

//           // // sendStatusCreationObserver.observe(
//           // //   grid.querySelector(
//           // //     'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r'
//           // //   ),
//           // //   { childList: true, subtree: true }
//           // // );

//           // const sendStatus = grid.querySelector(
//           //   'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//           // );
//           // console.log(`sendStatus === undefined? ${sendStatus === undefined}`);
//           // console.log(`sendStatus === null? ${sendStatus === null}`);

//           // console.log(
//           //   `sendStatus.childNodes[0].nodeValue === ${sendStatus.childNodes[0].nodeValue}`
//           // );

//           // // Where "Sending..." appears in left sidebar under name and profile pic of person you're messaging:
//           // // .querySelector('span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft');

//           // // When "Sending" appears directly under message being sent, it's in same span that "Sent" later appears in

//           // // sendStatusObserver.observe(sendStatus, {
//           // //   characterData: true,
//           // // });

//           // // for (const child of sendStatus.childNodes) {
//           // //   if (child.nodeType === Node.TEXT_NODE) {
//           // //     console.log('found text node with value ' + child.nodeValue);
//           // //     sendStatusObserver.observe(child, {
//           // //       characterData: true,
//           // //     });
//           // //   }
//           // //   break;
//           // // }

//           // // sendStatusObserver.observe(sendStatus, {
//           // //   childList: true,
//           // //   subtree: true,
//           // // });

//           // // sendStatusObserver.observe(sendStatus.childNodes[0].childNodes[0], {
//           // //   characterData: true,
//           // // });

//           // // setTimeout(() => {
//           // //   sendStatusObserver.observe(sendStatus.firstChild, {
//           // //     characterData: true,
//           // //   });
//           // // }, 5000);

//           // // while (sendStatus.firstChild.nodeValue !== 'Sent') {
//           // //   setTimeout(() => {}, 100);
//           // // }

//           // let i = 0;
//           // const trackSpanReplacementProgress = () => {
//           //   i++;
//           //   const sendStatus = grid.querySelector(
//           //     'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//           //   );
//           //   if (sendStatus === null) {
//           //     console.log('Replacing span...');
//           //     setTimeout(() => {
//           //       trackSpanReplacementProgress();

//           //       console.log(
//           //         `Send-status span has been replaced after ${i * 250} ms!`
//           //       );

//           //       sendStatusObserver.observe(sendStatus.firstChild, {
//           //         characterData: true,
//           //       });
//           //     }, 250);
//           //   } else {
//           //     console.log(
//           //       `sendStatus is not null; its first child has the value ${sendStatus.firstChild.nodeValue}`
//           //     );
//           //   }
//           // };
//           // trackSpanReplacementProgress();

//           // setTimeout(() => {
//           //   let i = 1;
//           //   const trackSpanReplacementProgress = () => {
//           //     i++;
//           //     const sendStatus = grid.querySelector(
//           //       'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//           //     );
//           //     if (sendStatus === null) {
//           //       console.log('Replacing span...');
//           //       setTimeout(() => {
//           //         trackSpanReplacementProgress();
//           //         console.log(
//           //           `Send-status span has been replaced after ${i * 250} ms!`
//           //         );
//           //         sendStatusObserver.observe(sendStatus.firstChild, {
//           //           characterData: true,
//           //         });
//           //       }, 250);
//           //     }
//           //   };
//           //   trackSpanReplacementProgress();
//           // }, 250);

//           setTimeout(() => {
//             const sendStatus = grid.querySelector(
//               'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//             );
//             if (sendStatus !== null) {
//               sendStatusObserver.observe(sendStatus.firstChild, {
//                 characterData: true,
//               });
//             } else {
//               console.log(`sendStatus is null even after 10 seconds`);
//             }
//           }, 10000);

//           // // const trackSendingProgress = () => {
//           // //   const sendStatus = grid.querySelector(
//           // //     'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//           // //   );
//           // //   if (
//           // //     sendStatus === undefined ||
//           // //     sendStatus.firstChild.nodeValue === 'Sending'
//           // //   ) {
//           // //     console.log('Sending...');
//           // //     setTimeout(() => {
//           // //       trackSendingProgress();

//           // //       console.log('Sent!');

//           // //       parseContent(grid);
//           // //       chatBubbleObserver.observe(document.documentElement, {
//           // //         childList: true,
//           // //         subtree: true,
//           // //       });
//           // //     }, 100);
//           // //   }
//           // // };
//           // // trackSendingProgress();

//           // // while (sendStatus.firstChild.nodeValue !== 'Sent') {
//           // //   console.log('Sending...');
//           // // }
//           // // console.log('Sent!');

//           // // setTimeout(() => {
//           // //   if (sendStatus.firstChild.nodeValue !== 'Sending')
//           // //     console.log(
//           // //       `after a quarter of a second, the nodeValue is not "Sending" but rather "${sendStatus.firstChild.nodeValue}"`
//           // //     );
//           // // }, 250);

//           // // setTimeout(() => {
//           // //   if (sendStatus.firstChild.nodeValue !== 'Sent')
//           // //     console.log(
//           // //       `after 10 seconds, the nodeValue is not "Sent" but rather "${sendStatus.firstChild.nodeValue}"`
//           // //     );
//           // // }, 10000);

//           // setTimeout(() => {
//           //   const sendStatus = grid.querySelector(
//           //     'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//           //   );
//           //   if (sendStatus.firstChild.nodeValue !== 'Sending')
//           //     console.log(
//           //       `after a quarter of a second, the nodeValue is not "Sending" but rather "${sendStatus.firstChild.nodeValue}"`
//           //     );
//           // }, 250);

//           // setTimeout(() => {
//           //   const sendStatus = grid.querySelector(
//           //     'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
//           //   );
//           //   if (sendStatus.firstChild.nodeValue !== 'Sent')
//           //     console.log(
//           //       `after 10 seconds, the nodeValue is not "Sent" but rather "${sendStatus.firstChild.nodeValue}"`
//           //     );
//           // }, 10000);

//           // // parseContent(grid);

//           // // chatBubbleObserver.observe(document.documentElement, {
//           // //   childList: true,
//           // //   subtree: true,
//           // // });
//         }

//         // if (keystroke.key === 'Enter') {
//         //   console.log('Enter key press detected');
//         //   setTimeout(() => {
//         //     // parseContent(
//         //     //   document.querySelector(
//         //     //     'div[role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
//         //     //   )
//         //     // );

//         //     // const grids = document.querySelectorAll(
//         //     //   'div[role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
//         //     // );

//         //     // console.log(`${grids.length} grids found`);

//         //     // for (const grid of grids) {
//         //     //   if (
//         //     //     grid['aria-label'].startsWith('Messages in conversation with')
//         //     //   ) {
//         //     //     console.log('relevant message grid found');
//         //     //     parseContent(grid);
//         //     //   }
//         //     // }

//         //     if (grid !== undefined && grid !== null) {
//         //       console.log('relevant message grid found');
//         //       parseContent(grid);
//         //     }

//         //     chatBubbleObserver.observe(document.documentElement, {
//         //       childList: true,
//         //       subtree: true,
//         //     });
//         //   }, 4000);
//         // }
//       });

//       // sendButton.addEventListener('click', () => {
//       //   chatBubbleObserver.disconnect();
//       //   console.log('click detected');
//       //   setTimeout(() => {
//       //     // parseContent(
//       //     //   document.querySelector(
//       //     //     'div[role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
//       //     //   )
//       //     // );

//       //     const grids = document.querySelectorAll(
//       //       'div[role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
//       //     );

//       //     console.log(`${grids.length} grids found`);

//       //     for (const grid of grids) {
//       //       if (
//       //         grid['aria-label'].startsWith('Messages in conversation with')
//       //       ) {
//       //         console.log('relevant message grid found');
//       //         parseContent(grid);
//       //       }
//       //     }

//       //     chatBubbleObserver.observe(document.documentElement, {
//       //       childList: true,
//       //       subtree: true,
//       //     });
//       //   }, 4000);
//       // });

//       sendButtonCreationObserver.disconnect();
//     }
//   });
// });

// sendButtonCreationObserver.observe(document.documentElement, {
//   childList: true,
//   subtree: true,
// });

// document.addEventListener('DOMContentLoaded', (event) => {
window.onload = () => {
  console.log('Page loaded fully');

  let textbox = document.querySelector(
    'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.x1iyjqo2.x1gh3ibb.xisnujt.xeuugli.x1odjw0f.notranslate'
  );

  let grid = document.querySelector(
    'div[aria-label^="Messages in conversation with"][role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
  );

  console.log(`textbox = ${textbox}, grid = ${grid}`);

  setTimeout(
    () => {
      textbox = document.querySelector(
        'div[aria-label="Message"][role="textbox"][contenteditable="true"][data-lexical-editor="true"].xzsf02u.x1a2a7pz.x1n2onr6.x14wi4xw.x1iyjqo2.x1gh3ibb.xisnujt.xeuugli.x1odjw0f.notranslate'
      );

      grid = document.querySelector(
        'div[aria-label^="Messages in conversation with"][role="grid"].x1uipg7g.xu3j5b3.xol2nv.xlauuyb.x26u7qi.x19p7ews.x78zum5.xdt5ytf.x1iyjqo2.x6ikm8r.x10wlt62'
      );

      textbox.addEventListener('keydown', (keystroke) => {
        // chatBubbleObserver.disconnect();

        if (grid !== undefined && grid !== null && keystroke.key === 'Enter') {
          console.log('Enter key pressed');
          setTimeout(() => {
            const sendStatus = grid.querySelector(
              'div[role="row"].x1n2onr6 > div > div[data-release-focus-from="CLICK"][data-scope="messages_table"][role="gridcell"].x78zum5.xdt5ytf.x1n2onr6 > .html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1eb86dx.x78zum5.x13a6bvl > [role="presentation"].html-span.x1mh8g0r.x1hl2dhg.x16tdsg8.x1vvkbs.x1eb86dx.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x12nagc.xpdqn1h.x1gslohp > [dir="auto"].x193iq5w.xeuugli.x13faqbe.x1vvkbs.xlh3980.xvmahel.x1n0sxbx.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x1tu3fi.x676frb.x1pg5gke.xvq8zen.xo1l8bm.xi81zsa.xp4054r > .html-span.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1hl2dhg.x16tdsg8.x1vvkbs.x1xf6ywa'
            );
            if (sendStatus !== null) {
              if (sendStatus.firstChild.nodeValue === 'Sent') {
                console.log(`status = Sent`);
                const bubble = getNewChatBubble(sendStatus.firstChild);
                console.log('now to parse the content!');
                parseContent(bubble);
              } else {
                sendStatusObserver.observe(sendStatus.firstChild, {
                  characterData: true,
                });
              }
            } else {
              console.log(`sendStatus is null even after half a second`);
            }
          }, 500);
        }
      });

      // Set up keydown event listener above, parse and render preexisting messages with TeX below

      const chatBubbleObserver = new MutationObserver((mutations) => {
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

      // TODO: Listen for clicks on send button, not just keypresses on textbox. Likely still need something like sendButtonCreationObserver.
      //
      // const sendButton = document.querySelector(
      //   'div[aria-label="Press enter to send"][role="button"].x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.xe8uvvx.xdj266r.xat24cr.x2lwn1j.xeuugli.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x3nfvp2.x1q0g3np.x87ps6o.x1lku1pv.x1a2a7pz.x1c4vz4f.x2lah0s.xsgj6o6.xw3qccf.x1y1aw1k.x1sxyh0.xwib8y2.xurb0ha'
      // );
      // if (sendButton !== undefined && sendButton !== null) {
      //   console.log(`sendButton created`);
    },
    textbox === null ? 10 : 0
  );

  // const yourChatBubbles = grid.querySelectorAll(
  //   '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xat24cr.xdj266r.xeuugli.x1vjfegm'
  // );
  // const theirChatBubbles = grid.querySelectorAll(
  //   '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x12nagc.x1yc453h.x126k92a.x18lvrbx'
  // );

  // console.log(
  //   `${yourChatBubbles.length + theirChatBubbles.length} chat bubbles found`
  // );

  // [...yourChatBubbles, ...theirChatBubbles].forEach(parseContent);
  // // });
};
