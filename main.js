const injectCss = (filePath) => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = chrome.runtime.getURL(filePath);
  css.type = 'text/css';
  document.head.appendChild(css);
};

for (filePath of ['katex/katex.min.css', 'fb.katex.css']) injectCss(filePath);

const getTexBounds = (openingDelim, txt) => {
  let dlmChar1 = openingDelim[0],
    dlmChar2 = openingDelim[1];

  const displayTexEnclosed = dlmChar1 === '$';

  for (let i = 0; i < txt.length; i++) {
    let j = 0;

    if (txt[i] === dlmChar1 && txt[i + 1] === dlmChar2) {
      j = i + 2;

      while (
        j + 1 < txt.length &&
        !(
          txt[j] === dlmChar1 && txt[j + 1] === (displayTexEnclosed ? '$' : ')')
        )
      ) {
        j++;
      }

      if (
        txt[j] === dlmChar1 &&
        txt[j + 1] === (displayTexEnclosed ? '$' : ')')
      ) {
        return [i, j];
      } else {
        return;
      }
    }
  }
};

const renderTex = (renderType, msg, texBounds) => {
  for (let pair of texBounds[renderType]) {
    if (pair != null && pair.length > 1) {
      katex.render(msg.textContent.substring(pair[0] + 2, pair[1]), msg, {
        displayMode: renderType,
      });
    }
  }
};

const childListObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const nodeType = node.constructor.name;
      if (nodeType === 'HTMLDivElement') {
        const messages = node.querySelectorAll(
          '.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xeuugli.x1vjfegm'
        );

        messages.forEach((msg) => {
          const txt = msg.textContent;

          const texBounds = [[], []];

          texBounds[0].push(getTexBounds('\\(', txt));
          texBounds[1].push(getTexBounds('$$', txt));

          const inlineTexFound =
            texBounds[0].length > 0 && texBounds[0][0] !== undefined;
          const displayTexFound =
            texBounds[1].length > 0 && texBounds[1][0] !== undefined;

          if (inlineTexFound || displayTexFound) {
            let parent = msg.parentNode;

            while (parent != null) {
              if (parent.role === 'row') break;
              parent = parent.parentNode;
            }

            parent.style.border =
              '14px solid var(--mwp-message-row-background)';

            renderTex(0, msg, texBounds);
            renderTex(1, msg, texBounds);
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
