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
        const theirChatBubbles = node.querySelectorAll(
          '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x12nagc.x1yc453h.x126k92a.x18lvrbx'
        );

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

              msg.textContent = `${msg.textContent.substring(
                0,
                texBounds[i][0] + offset
              )}<span class='renderable'>${msg.textContent.substring(
                texBounds[i][0] + offset,
                texBounds[i][1] + 2 + offset
              )}</span>${msg.textContent.substring(
                texBounds[i][1] + 2 + offset
              )}`;
            }

            msg.innerHTML = msg.textContent;

            msg.querySelectorAll('span.renderable').forEach((span) => {
              katex.render(
                span.textContent.substring(2, span.textContent.length - 2),
                span,
                {
                  displayMode: span.textContent[0] === '$',
                }
              );

              const baseSpans = span.querySelectorAll(
                'span:where(.katex, .katex-display) span.katex-html > span.base'
              );
              let collectiveSpanWidth = 0;

              for (let baseSpan of baseSpans) {
                collectiveSpanWidth += baseSpan.getBoundingClientRect().width;
              }

              if (
                collectiveSpanWidth >
                baseSpans[0].parentNode.getBoundingClientRect().width
              ) {
                for (let i = baseSpans.length - 1; i > -1; i--) {
                  if (
                    collectiveSpanWidth -
                      baseSpans[i].getBoundingClientRect().width <=
                    baseSpans[0].parentNode.getBoundingClientRect().width - 10
                  ) {
                    const spacer = document.createElement('div');
                    spacer.style.lineHeight = '2px';
                    baseSpans[0].parentNode.insertBefore(spacer, baseSpans[i]);
                    break;
                  } else {
                    collectiveSpanWidth -=
                      baseSpans[i].getBoundingClientRect().width;
                  }
                }
              }
            });
          }
        });
      }
    });
  });
});

// Don't observe whole DOM tree; it causes tabs to go blank (white) for a bit when you switch between them rapidly
childListObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
