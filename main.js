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

const childListObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const nodeType = node.constructor.name;
      if (nodeType === 'HTMLDivElement') {
        const yourChatBubbles = node.querySelectorAll(
          '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xat24cr.xdj266r.xeuugli.x1vjfegm'
        );

        // console.log(
        //   `${yourChatBubbles.length} chat bubbles of yours were just added`
        // );
        // yourChatBubbles.forEach((bubble) => {
        //   console.log(`bubble.textContent = ${bubble.textContent}`);
        // });

        // const yourChatBubbles = node.querySelectorAll(
        //   '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd:where(.xat24cr.xdj266r.xeuugli.x1vjfegm, .x1gslohp.x12nagc.x1yc453h.x126k92a.xyk4ms5)'
        // );
        const theirChatBubbles = node.querySelectorAll(
          '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x12nagc.x1yc453h.x126k92a.x18lvrbx'
        );

        [...yourChatBubbles, ...theirChatBubbles].forEach((bubble) => {
          // katex.render(`\\forall x \\forall y (y \\to x)`, bubble, {
          //   displayMode: true,
          // });

          for (const className in bubble.classList)
            bubble.classList.remove(className);

          for (const bubbleDescendant of bubble.querySelectorAll('*'))
            for (const className in bubbleDescendant.classList)
              bubbleDescendant.classList.remove(className);

          const msg = bubble.querySelector(
            '.html-div.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x11i5rnm.x12nagc.x1mh8g0r.x1yc453h.x126k92a.xyk4ms5'
          );

          // msg.classList.remove(
          //   'html-div',
          //   'xexx8yu',
          //   'x4uap5',
          //   'x18d9i69',
          //   'xkhd6sd',
          //   'x1gslohp',
          //   'x11i5rnm',
          //   'x12nagc',
          //   'x1mh8g0r',
          //   'x1yc453h',
          //   'x126k92a',
          //   'xyk4ms5'
          // );

          // katex.render(
          //   `\\forall x \\forall y (y \\to x)`,
          //   msg.parentNode.parentNode.parentNode.parentNode.parentNode
          //     .parentNode.parentNode.parentNode,
          //   {
          //     displayMode: true,
          //   }
          // );

          let texBounds;

          if (msg !== null && msg.textContent != '') {
            console.log(`msg.textContent = ${msg.textContent}`);

            texBounds = getTexBounds(msg);
          }

          if (texBounds !== undefined) {
            console.log(`texBounds.length = ${texBounds.length}`);

            for (let i = 0; i < texBounds.length; i++) {
              const offset = 32 * i;
              // const offset = 30 * i;
              console.log(`i = ${i}, offset = ${offset}`);
              console.log(`msg.textContent before: ${msg.textContent}`);

              msg.textContent = `${msg.textContent.substring(
                0,
                texBounds[i][0] + offset
              )}<span class='renderable'>${msg.textContent.substring(
                texBounds[i][0] + offset,
                texBounds[i][1] + 2 + offset
              )}</span>${msg.textContent.substring(
                texBounds[i][1] + 2 + offset
              )}`;

              // msg.textContent = `${msg.textContent.substring(
              //   0,
              //   texBounds[i][0] + offset
              // )}<div class='renderable'>${msg.textContent.substring(
              //   texBounds[i][0] + offset,
              //   texBounds[i][1] + 2 + offset
              // )}</div>${msg.textContent.substring(
              //   texBounds[i][1] + 2 + offset
              // )}`;

              console.log(`msg.textContent after: ${msg.textContent}`);
            }

            msg.innerHTML = msg.textContent;

            // console.log(`msg.innerHTML = ${msg.innerHTML}`);

            // console.log(
            //   `query selector matches ${
            //     msg.querySelectorAll('span.renderable').length
            //   } renderable spans in msg`
            // );

            msg.querySelectorAll('span.renderable').forEach((span) => {
              console.log(`inside renderer`);
              console.log(`span.textContent = ${span.textContent}`);

              // if (span.textContent === '$$\forall x \forall y (y \to x)$$')
              //   span.style.backgroundColor = 'black';

              const spanObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  // console.log(
                  //   `renderable span subtree underwent mutation of type ${mutation.type}`
                  // );
                  // console.log(span.innerHTML);

                  console.log(
                    `${mutation.addedNodes.length} nodes simultaneously observed to have been ADDED TO childList of renderable span's parent's parent's parent's parent's parent`
                  );

                  console.log(
                    `${mutation.removedNodes.length} nodes simultaneously observed to have been REMOVED FROM childList of renderable span's parent's parent's parent's parent's parent`
                  );

                  mutation.removedNodes.forEach((removedNode) => {
                    console.log(
                      `node of type ${removedNode.constructor.name} removed`
                    );
                    console.log(
                      `removedNode.textContent = ${removedNode.textContent}`
                    );
                    console.log(
                      `removedNode.innerHTML = ${removedNode.innerHTML}`
                    );
                    // for (const property in removedNode)
                    //   console.log(
                    //     `removedNode has ${property} property with value ${removedNode[property]}`
                    //   );
                    // for (const className in removedNode.classList)
                    //   console.log(`removedNode is of class ${className}`);
                  });

                  mutation.addedNodes.forEach((addedNode) => {
                    console.log(
                      `node of type ${addedNode.constructor.name} added`
                    );
                    console.log(
                      `addedNode.textContent = ${addedNode.textContent}`
                    );
                    console.log(`addedNode.innerHTML = ${addedNode.innerHTML}`);
                    // for (const property in addedNode)
                    //   console.log(
                    //     `addedNode has ${property} property with value ${addedNode[property]}`
                    //   );
                    // for (const className in addedNode.classList)
                    //   console.log(`addedNode is of class ${className}`);
                  });
                });
              });
              spanObserver.observe(
                span.parentNode.parentNode.parentNode.parentNode.parentNode,
                {
                  /* attribute: true, */
                  childList: true,
                  subtree: true,
                }
              );

              katex.render(
                span.textContent.substring(2, span.textContent.length - 2),
                span,
                {
                  displayMode: span.textContent[0] === '$',
                }
              );

              // const baseSpans = span.querySelectorAll(
              //   'span:where(.katex, .katex-display) span.katex-html > span.base'
              // );

              // msg.querySelectorAll('div.renderable').forEach((div) => {
              //   const divObserver = new MutationObserver((mutations) => {
              //     mutations.forEach((mutation) => {
              //       console.log(
              //         `renderable div subtree underwent mutation of type ${mutation.type}`
              //       );
              //       console.log(div.innerHTML);
              //     });
              //   });
              //   divObserver.observe(div, {
              //     attribute: true,
              //     childList: true,
              //     subtree: true,
              //   });

              // katex.render(
              //   div.textContent.substring(2, div.textContent.length - 2),
              //   div,
              //   {
              //     displayMode: div.textContent[0] === '$',
              //   }
              // );

              // const baseSpans = div.querySelectorAll(
              //   'span:where(.katex, .katex-display) span.katex-html > span.base'
              // );

              // let collectiveSpanWidth = 0;

              // console.log(
              //   `${baseSpans.length} base spans found inside renderable span after render attempt`
              // );

              // for (let baseSpan of baseSpans) {
              //   collectiveSpanWidth += baseSpan.getBoundingClientRect().width;
              // }

              // console.log(
              //   collectiveSpanWidth ===
              //     baseSpans[0].parentNode.getBoundingClientRect().width
              // );

              // if (
              //   collectiveSpanWidth >
              //   baseSpans[0].parentNode.getBoundingClientRect().width
              // ) {
              //   let partialSumOfSpanWidths = collectiveSpanWidth;

              //   for (let i = baseSpans.length - 1; i > -1; i--) {
              //     if (
              //       partialSumOfSpanWidths -
              //         baseSpans[i].getBoundingClientRect().width <=
              //       baseSpans[0].parentNode.getBoundingClientRect().width - 10
              //     ) {
              //       const spacer = document.createElement('div');
              //       spacer.style.lineHeight = '2px';
              //       baseSpans[0].parentNode.insertBefore(spacer, baseSpans[i]);
              //       if (
              //         collectiveSpanWidth - partialSumOfSpanWidths <=
              //         baseSpans[0].parentNode.getBoundingClientRect().width - 10
              //       ) {
              //         break;
              //       } else {
              //         collectiveSpanWidth = partialSumOfSpanWidths;
              //         // Recursively call the function this code belongs in, to deal
              //         // with cases where arbitrarily many line breaks are needed
              //       }
              //     } else {
              //       partialSumOfSpanWidths -=
              //         baseSpans[i].getBoundingClientRect().width;
              //     }
              //   }
              // }
            });
          }
        });
      }
    });
  });
});

// Don't observe whole DOM tree if you can help it
childListObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
