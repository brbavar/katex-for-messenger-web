console.log('render.js executing!');

// const messages = document.querySelectorAll(
//   '.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xeuugli.x1vjfegm'
// );

// const messages = document.querySelectorAll(
//   'html-div.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x11i5rnm.x12nagc.x1mh8g0r.x1yc453h.x126k92a.xyk4ms5'
// );

// messages.forEach((msg) => {
//   const txt = msg.textContent;

//   console.log(txt);

//   const texStart = txt.indexOf('$$');
//   const texEnd = txt.indexOf('$$', texStart + 2);

//   if (texStart != -1 && texEnd != -1) {
//     console.log(txt.substring(texStart + 2, texEnd));

//     // while (!('katex' in window)) {
//     //   setTimeout(() => {
//     //     console.log('still no window.katex!');
//     //   }, 50);
//     // }
//     // window.katex.render(txt.substring(texStart + 2, texEnd), msg);

//     window.katex.render(txt.substring(texStart + 2, texEnd), msg);
//   }
// });

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

            console.log(
              'katex is ' + ('katex' in window ? '' : 'NOT ') + 'in window'
            );

            // while (!('katex' in window)) {
            //   setTimeout(() => {
            //     console.log('still no window.katex');
            //   }, 50);
            // }

            // while (!('render' in window.katex)) {
            //   setTimeout(() => {
            //     console.log('still no window.katex.render');
            //   }, 50);
            // }

            // window.katex.render(txt.substring(texStart + 2, texEnd), msg);
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
