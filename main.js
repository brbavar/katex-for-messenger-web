const katexMinCss = document.createElement('link');
katexMinCss.rel = 'stylesheet';
katexMinCss.href = chrome.runtime.getURL('katex/katex.min.css');
katexMinCss.type = 'text/css';
document.head.appendChild(katexMinCss);

const fbKatexCss = document.createElement('link');
fbKatexCss.rel = 'stylesheet';
fbKatexCss.href = chrome.runtime.getURL('fb.katex.css');
fbKatexCss.type = 'text/css';
document.head.appendChild(fbKatexCss);

const getTexBounds = (openingDelim, txt) => {
  let dlmChar1 = openingDelim[0],
    dlmChar2 = openingDelim[1];

  for (let i = 0; i < txt.length; i++) {
    let j = 0;

    if (txt[i] === dlmChar1 && txt[i + 1] === dlmChar2) {
      j = i + 2;

      while (
        j + 1 < txt.length &&
        !(txt[j] === dlmChar1 && txt[j + 1] === (dlmChar1 === '$' ? '$' : ')'))
      ) {
        j++;
      }

      if (
        txt[j] === dlmChar1 &&
        txt[j + 1] === (dlmChar1 === '$' ? '$' : ')')
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

          if (texBounds[0].length > 0 || texBounds[1].length > 0) {
            let parent = msg.parentNode;

            while (parent != null) {
              if (parent.role === 'row') break;
              parent = parent.parentNode;
            }

            parent.style.border =
              '14px solid var(--mwp-message-row-background)';

            renderTex(0, msg, texBounds);
            renderTex(1, msg, texBounds);

            const spans = msg.querySelectorAll('span');
            spans.forEach((span) => {
              span.classList.add('katex-span');
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
