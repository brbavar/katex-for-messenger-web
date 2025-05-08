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

const wrapTexInSpans = (msg) => {
  const txt = msg.textContent;

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

      while (r + 1 < txt.length && !closingDelimAt(r)) {
        if (openingDelimAt(r)) {
          l = r;
          r += 2;
        } else {
          r++;
        }
      }

      if (closingDelimAt(r)) {
        return [l, r];
      } else {
        return [];
      }
    } else {
      l++;
    }
  }

  return [];
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
          wrapTexInSpans(msg);

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
