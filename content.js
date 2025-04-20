// import katex from 'katex';

// (async () => {
//   //   const katex = await import('katex');
//   const katex = await import(
//     'https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js'
//   );
// })();

console.log('katex-for-facebook is running');

const childListObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const nodeType = node.constructor.name;
      //   console.log('node of type ' + nodeType + ' was added');
      if (nodeType === 'HTMLDivElement') {
        const divDescendants = node.querySelectorAll(
          'html-div xdj266r x11i5rnm xat24cr x1mh8g0r xexx8yu x4uap5 x18d9i69 xkhd6sd xeuugli x1vjfegm'
        );
        // console.log(
        //   'classList: ' +
        //     node.classList +
        //     '; found ' +
        //     divDescendants.length +
        //     ' descendants; textContent: ' +
        //     node.textContent
        // );

        divDescendants.forEach((desc) => {
          if (
            desc.textContent.indexOf('You sent') === -1 &&
            desc.textContent.indexOf('Enter') === -1
          )
            console.log(
              'classList: ' + desc.classList + '; text: ' + desc.textContent
            );
        });

        // const msgStart = node.textContent.indexOf('You sent');
        // const msgEnd = node.textContent.indexOf('Enter');

        // if (msgStart != -1 && msgEnd != -1) {
        //   console.log(node.textContent.substring(msgStart + 8, msgEnd));
        // }

        // for (let msg of messages) console.log(msg.textContent);
      }
    });
  });
});

childListObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

// const messages = document.querySelectorAll(
//   'html-div xexx8yu x4uap5 x18d9i69 xkhd6sd x1gslohp x11i5rnm x12nagc x1mh8g0r x1yc453h x126k92a xyk4ms5'
// );

// console.log('found ' + messages.length + ' messages');

// messages.forEach((msg) => {
//   console.log('in forEach handler');

//   const txt = msg.textContent;

//   console.log(txt);

//   const texStart = txt.indexOf('$$');
//   const texEnd = txt.indexOf('$$', texStart + 2);

//   if (texStart != -1 && texEnd != -1) {
//     console.log(txt.substring(texStart + 2, texEnd));

//     const katexScript = document.createElement('script');
//     katexScript.src = chrome.runtime.getURL('katex/katex.min.js');
//     katexScript.onload = () => {
//       console.log('KaTeX loaded!');
//       katex.render(txt.substring(texStart + 2, texEnd), msg);
//     };
//   }
// });
