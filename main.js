console.log('katex-for-facebook is running');

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = chrome.runtime.getURL('katex/katex.min.css');
document.head.appendChild(link);

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
            console.log(txt.substring(texStart + 2, texEnd));
            katex.render(txt.substring(texStart + 2, texEnd), msg);
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
