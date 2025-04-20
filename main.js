console.log('katex-for-facebook is running');

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

// const style = document.createElement('style');
// style.sheet = new CSSStyleSheet();
// // style.sheet.replaceSync(
// //   '#facebook .system-fonts--body.katex-span span { font-family: Arial, Helvetica, sans-serif; }'
// // );
// style.sheet.insertRule(
//   '#facebook .system-fonts--body.katex-span span { font-family: Arial, Helvetica, sans-serif; }'
// );
// document.head.appendChild(style);

const childListObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const nodeType = node.constructor.name;
      //   console.log('node of type ' + nodeType + ' was added');
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
            // msg.id = 'katex';
            // msg.style.fontFamily = 'Arial, Helvetica, sans-serif';

            katex.render(txt.substring(texStart + 2, texEnd), msg, {
              displayMode: true,
              output: 'html',
            });

            const spans = msg.querySelectorAll('span');
            spans.forEach((span) => {
              span.classList.add('katex-span');
            });
            // styleSheet.insertRule(
            //   '#facebook .system-fonts--body.katex-span span { font-family: Arial, Helvetica, sans-serif; }'
            // );
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

// const el = document.createElement('span');
// document.body.appendChild(el);
// el.style.fontFamily = '';
// katex.render('\\sum\\limits_{k=1}^\\infty 1/k^p', el, { displayMode: true });
