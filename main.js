const injectCss = (filePath) => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = chrome.runtime.getURL(filePath);
  css.type = 'text/css';
  document.head.appendChild(css);
};

for (filePath of ['katex/katex.min.css', 'fb.katex.css']) injectCss(filePath);

const getTexBounds = (openingDelim, txt) => {
  let char1open = openingDelim[0],
    char2open = openingDelim[1];

  const displayTexEnclosed = char1open === '$';

  const openingDlmFound = (l) => {
    return txt[l] === char1open && txt[l + 1] === char2open;
  };

  const closingDlmFound = (r) => {
    return (
      txt[r] === char1open && txt[r + 1] === (displayTexEnclosed ? '$' : ')')
    );
  };

  let l = 0,
    r = 0;
  while (l < txt.length) {
    if (openingDlmFound(l)) {
      r = l + 2;

      while (r + 1 < txt.length && !closingDlmFound(r)) {
        if (openingDlmFound(r)) {
          l = r;
          r += 2;
        } else {
          r++;
        }
      }

      if (closingDlmFound(r)) {
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

const preserveNonTex = (txt, precedesTex, div, renderType) => {
  if (txt !== '') {
    const newDiv = document.createElement('div');
    newDiv.classList.add(`${precedesTex ? 'pre' : 'post'}-tex`);
    newDiv.textContent = txt;
    if (precedesTex) div.insertBefore(newDiv, div.children[0]);
    else {
      div.appendChild(newDiv);

      let bounds = [[], []];
      bounds[renderType].push(...getTexBounds(renderType ? '$$' : '\\(', txt));
      if (bounds[renderType].length > 0) {
        renderTex(renderType, newDiv, bounds);
      }
    }
  }
};

const renderTex = (renderType, msg, texBounds) => {
  const bounds = texBounds[renderType];
  if (bounds.length > 1) {
    const origTxt = msg.textContent;
    const preTex = origTxt.substring(0, bounds[0]);
    const postTex = origTxt.substring(bounds[1] + 2);

    katex.render(origTxt.substring(bounds[0] + 2, bounds[1]), msg, {
      displayMode: renderType,
    });

    preserveNonTex(preTex, true, msg, renderType);
    preserveNonTex(postTex, false, msg, renderType);
  }
};

const childListObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const nodeType = node.constructor.name;
      if (nodeType === 'HTMLDivElement') {
        const yourMessages = node.querySelectorAll(
          '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xat24cr.xdj266r.xeuugli.x1vjfegm'
        );
        const theirMessages = node.querySelectorAll(
          'html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x12nagc.x1yc453h.x126k92a.x18lvrbx'
        );

        // const messages = node.querySelectorAll(
        //   '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd'
        // );
        [...yourMessages, ...theirMessages].forEach((msg) => {
          const txt = msg.textContent;

          const texBounds = [[], []];

          texBounds[0].push(...getTexBounds('\\(', txt));
          texBounds[1].push(...getTexBounds('$$', txt));

          const inlineTexFound = texBounds[0].length > 0;
          const displayTexFound = texBounds[1].length > 0;

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
