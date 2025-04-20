// import katex from 'katex';

// (async () => {
//   //   const katex = await import('katex');
//   const katex = await import(
//     'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js'
//   );
// })();

console.log('katex-for-facebook is running');

// const katexScript = document.createElement('script');
// // fetch(chrome.runtime.getURL('katex/katex.min.js'))
// //   .then((r) => r.text())
// //   .then((text) => console.log('Injected script content:\n', text));
// katexScript.type = 'text/javascript';
// katexScript.src = chrome.runtime.getURL('katex/katex.min.js');
// katexScript.id = 'katex-script';
// katexScript.onload = () => {
//   console.log('KaTeX loaded!', window.katex);
// };
// document.head.appendChild(katexScript);

// const renderScript = document.createElement('script');
// // renderScript.textContent = `
// //     (() => {
// //         while (!('katex' in window)) {
// //             setTimeout(() => {
// //                 console.log('still no window.katex!');
// //             }, 50);
// //         }
// //         window.katex.render(txt.substring(texStart + 2, texEnd), msg);
// //     })()
// // `;
// // document.head.appendChild(renderScript);
// renderScript.type = 'module';
// renderScript.src = chrome.runtime.getURL('scripts/render.js');
// document.head.appendChild(renderScript);

// window.addEventListener('message', (event) => {
//   if (event.source !== window) return; // only accept messages from the page itself
//   if (event.data.type && event.data.type === 'FROM_PAGE') {
//     console.log('Content script received: ', event.data.payload);
//   }
// });

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

            // while (!('katex' in window)) {
            //   setTimeout(() => {
            //     console.log('still no window.katex!');
            //   }, 50);
            // }
            // window.katex.render(txt.substring(texStart + 2, texEnd), msg);
            katex.render(txt.substring(texStart + 2, texEnd), msg);

            // renderScript.textContent += `window.katex.render(${
            //   (txt.substring(texStart + 2, texEnd), msg)
            // });`;
          }
        });

        // document.head.appendChild(renderScript);
      }
    });
  });
});

childListObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});
