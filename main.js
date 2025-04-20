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

// const allNodes = document.querySelectorAll('*');
// for (node of allNodes) {
//   const style = window.getComputedStyle(node);
//   for (let i = 0; i < style.length; i++) {
//     const propertyName = style[i];
//     // console.log('propertyName is ' + propertyName);
//     if (propertyName.startsWith('--')) {
//       // console.log('test 1');
//       console.log(propertyName + ' has value ' + window.getComputedStyle(parent).getPropertyValue(propertyName));
//       node.style.setProperty(propertyName) = 'none';
//       // console.log('test 2');
//     }
//   }
// }

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

            // while (parent != null && 'parentNode' in parent) {
            //   if ('style' in parent)
            //     if ('backgroundColor' in parent.style)
            //       parent.style.backgroundColor = 'none';
            //   parent = parent.parentNode;
            // }

            // const wrapper = document.createElement('div');
            // wrapper.classList.add('katex-wrapper');

            // parent.appendChild(wrapper);
            // msg.remove();
            // wrapper.appendChild(msg);

            katex.render(txt.substring(texStart + 2, texEnd), msg, {
              displayMode: true,
              output: 'html',
            });

            // const divs = document.querySelectorAll(
            //   'div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xeuugli.x1vjfegm'
            // );
            // const height = window
            //   .getComputedStyle(divs[0])
            //   .getPropertyValue('height');
            // const width = window
            //   .getComputedStyle(divs[0])
            //   .getPropertyValue('width');
            // console.log('height: ' + height + '\nwidth: ' + width);

            const spans = msg.querySelectorAll('span');
            spans.forEach((span) => {
              span.classList.add('katex-span');
            });

            // const katexDivs = document.querySelectorAll(
            //   'div.html-div.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xeuugli.x1vjfegm:has(> .katex-span)'
            // );
            // katexDivs.forEach((div) => {
            //   div.classList.remove(
            //     'html-div',
            //     'xdj266r',
            //     'x11i5rnm',
            //     'xat24cr',
            //     'x1mh8g0r',
            //     'xexx8yu',
            //     'x4uap5',
            //     'x18d9i69',
            //     'xkhd6sd',
            //     'xeuugli',
            //     'x1vjfegm'
            //   );

            //   const divDescendants = div.querySelectorAll('*');
            //   divDescendants.forEach((desc) => {
            //     desc.classList.remove(
            //       'html-div',
            //       'xdj266r',
            //       'x11i5rnm',
            //       'xat24cr',
            //       'x1mh8g0r',
            //       'xexx8yu',
            //       'x4uap5',
            //       'x18d9i69',
            //       'xkhd6sd',
            //       'xeuugli',
            //       'x1vjfegm'
            //     );
            //   });

            // console.log(window.getComputedStyle(div));
            // });

            parent = msg.parentNode;

            // while (parent != null && 'parentNode' in parent) {
            //   // if ('style' in parent)
            //   //   if ('backgroundColor' in parent.style)
            //   //     if (
            //   //       window
            //   //         .getComputedStyle(parent)
            //   //         .getPropertyValue('background-color') ===
            //   //       'rgb(242, 244, 247)'
            //   //     )
            //   //       console.log(parent.constructor.name);

            //   if (parent instanceof Element) {
            //     const parentStyle = window.getComputedStyle(parent);
            //     for (let i = 0; i < parentStyle.length; i++) {
            //       const propertyName = parentStyle[i];
            //       console.log('propertyName is ' + propertyName);
            //       if (propertyName.startsWith('--')) {
            //         console.log('test 1');
            //         console.log(propertyName + ' has value ' + window.getComputedStyle(parent).getPropertyValue(propertyName));
            //         parent.style.setProperty(propertyName) = 'none';
            //         console.log('test 2');
            //       }
            //     }
            //   }

            //   parent = parent.parentNode;
            // }
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
