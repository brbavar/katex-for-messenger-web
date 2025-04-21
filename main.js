const katexMinCSS = document.createElement('link');
katexMinCSS.rel = 'stylesheet';
katexMinCSS.href = chrome.runtime.getURL('katex/katex.min.css');
katexMinCSS.type = 'text/css';
document.head.appendChild(katexMinCSS);

const fbKatexCSS = document.createElement('link');
fbKatexCSS.rel = 'stylesheet';
fbKatexCSS.href = chrome.runtime.getURL('fb.katex.css');
fbKatexCSS.type = 'text/css';
document.head.appendChild(fbKatexCSS);

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

          console.log(txt);

          const texStart = txt.indexOf('$$');
          const texEnd = txt.indexOf('$$', texStart + 2);

          if (texStart != -1 && texEnd != -1) {
            let parent = msg.parentNode;

            while (parent != null) {
              if (parent.role === 'row') break;
              parent = parent.parentNode;
            }

            parent.style.border =
              '14px solid var(--mwp-message-row-background)';

            katex.render(txt.substring(texStart + 2, texEnd), msg, {
              displayMode: true,
              output: 'html',
            });

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
