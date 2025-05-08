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
    if (openingDelimAt(l)) {
      r = l + 2;

      // Warn user that a sequence of symbols visually indistinguishable from a(n opening)
      // delimiter will be interpreted as one unless characters are escaped. Actually, MAYBE NO NEED
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

          for (let i = 0; i < texBounds.length; i++) {
            const offset = 32 * i;
            console.log(
              `i = ${i}\noffset = ${offset}\ntexBounds[i][0] = ${
                texBounds[i][0]
              }\ntexBounds[i][1] = ${
                texBounds[i][1]
              }\npreTex = ${msg.innerHTML.substring(
                0,
                texBounds[i][0] + offset
              )}\ntex = ${msg.innerHTML.substring(
                texBounds[i][0] + offset,
                texBounds[i][1] + 2 + offset
              )}\npostTex = ${msg.innerHTML.substring(
                texBounds[i][1] + 2 + offset
              )}`
            );

            msg.innerHTML = `${msg.innerHTML.substring(
              0,
              texBounds[i][0] + offset
            )}<span class='renderable'>${msg.innerHTML.substring(
              texBounds[i][0] + offset,
              texBounds[i][1] + 2 + offset
            )}</span>${msg.innerHTML.substring(texBounds[i][1] + 2 + offset)}`;
          }

          let parent = bubble.parentNode;

          while (parent != null) {
            if (parent.role === 'row') break;
            parent = parent.parentNode;
          }

          parent.style.border = '14px solid var(--mwp-message-row-background)';
        });
      }
    });
  });
});

childListObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
