const injectCss = (filePath) => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = chrome.runtime.getURL(filePath);
  css.type = 'text/css';
  document.head.appendChild(css);
};

for (filePath of ['katex/katex.min.css', 'fb.katex.css']) injectCss(filePath);

// const renderTex = (renderType, container) => {
//     katex.render(tex, container, {
//       displayMode: renderType,
//     });
// };

const getTexBounds = (msg) => {
  const txt = msg.textContent;
  const bounds = [];

  console.log(`txt = ${txt}`);

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
    if (l > 1664 && l < 1671) {
      console.log(`l before = ${l}, txt[l] = ${l < txt.length ? txt[l] : ''}`);
    }
    if (
      openingDelimAt(l) &&
      (bounds.length === 0 || l !== bounds[bounds.length - 1][1])
    ) {
      if (l > 1664 && l < 1671) console.log(`opening delim detected at ${l}`);
      r = l + 2;

      // Warn user that a sequence of symbols visually indistinguishable from a(n opening)
      // delimiter will be interpreted as one unless characters are escaped. Actually, MAYBE NO NEED
      while (r + 1 < txt.length && !(closingDelimAt(r) && txt[l] == txt[r])) {
        if (l > 1664 && l < 1671) {
          console.log(`r = ${r}, txt[r] = ${r < txt.length ? txt[r] : ''}`);
          console.log(`no matching closing delim detected at ${r}`);
        }
        if (openingDelimAt(r) && txt[l] == txt[r]) {
          if (l > 1664 && l < 1671)
            console.log(`but identical opening delim was detected at ${r}`);
          l = r;
          r += 2;
        } else {
          if (l > 1664 && l < 1671)
            console.log(`no identical opening delim at ${r} either`);
          r++;
        }
      }

      if (closingDelimAt(r) && txt[l] == txt[r]) {
        console.log(
          `bounds[bounds.length - 1][0] = ${
            bounds.length > 0 ? bounds[bounds.length - 1][1] : ''
          }`
        );
        console.log(
          `matching closing delim ${txt[r]}${txt[r + 1]} detected at ${r}`
        );
        console.log(`putting [${l}, ${r}] in bounds array`);
        bounds.push([l, r]);
        // return;
      }
    }
    l++;
    if (l > 1665 && l < 1672)
      console.log(`l after = ${l}, txt[l] = ${l < txt.length ? txt[l] : ''}`);
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
        const theirChatBubbles = node.querySelectorAll(
          '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x12nagc.x1yc453h.x126k92a.x18lvrbx'
        );

        // const messages = node.querySelectorAll(
        //   '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd'
        // );
        [...yourChatBubbles, ...theirChatBubbles].forEach((bubble) => {
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
              // console.log(
              //   `i = ${i}\noffset = ${offset}\ntexBounds[i][0] = ${
              //     texBounds[i][0]
              //   }\ntexBounds[i][1] = ${
              //     texBounds[i][1]
              //   }\npreTex = ${msg.innerHTML.substring(
              //     0,
              //     texBounds[i][0] + offset
              //   )}\ntex = ${msg.innerHTML.substring(
              //     texBounds[i][0] + offset,
              //     texBounds[i][1] + 2 + offset
              //   )}\npostTex = ${msg.innerHTML.substring(
              //     texBounds[i][1] + 2 + offset
              //   )}`
              // );

              // const newHTML = `${msg.innerHTML.substring(
              //   0,
              //   texBounds[i][0] + offset
              // )}<span class='renderable'>${msg.innerHTML.substring(
              //   texBounds[i][0] + offset,
              //   texBounds[i][1] + 2 + offset
              // )}</span>${msg.innerHTML.substring(
              //   texBounds[i][1] + 2 + offset
              // )}`;
              // console.log(
              //   `opening delim is ${msg.innerHTML[texBounds[i][0] + offset]}${
              //     msg.innerHTML[texBounds[i][0] + offset + 1]
              //   }`
              // );
              // console.log(
              //   `closing delim is ${msg.innerHTML[texBounds[i][1] + offset]}${
              //     msg.innerHTML[texBounds[i][1] + offset + 1]
              //   }`
              // );

              // console.log(`newHTML.length = ${newHTML.length}`);

              msg.textContent = `${msg.textContent.substring(
                0,
                texBounds[i][0] + offset
              )}<span class='renderable'>${msg.textContent.substring(
                texBounds[i][0] + offset,
                texBounds[i][1] + 2 + offset
              )}</span>${msg.textContent.substring(
                texBounds[i][1] + 2 + offset
              )}`;
              // console.log(`msg.innerHTML.length = ${msg.innerHTML.length}`);

              // if (i === 0) return;

              // if (i === 1) return;

              // if (i === 2) return;
            }

            msg.innerHTML = msg.textContent;

            msg.querySelectorAll('span.renderable').forEach((span) => {
              console.log(`span.textContent = ${span.textContent}`);
              console.log(
                `span.textContent.substring(2, span.innerHTML.length - 2) = ${span.textContent.substring(
                  2,
                  span.textContent.length - 2
                )}`
              );
              katex.render(
                span.textContent.substring(2, span.textContent.length - 2),
                span,
                {
                  displayMode: span.textContent[0] === '$',
                }
              );
            });
          }
        });
      }
    });
  });
});

childListObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
