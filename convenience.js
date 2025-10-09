// // // let cursorX = -1;
// // // let cursorY = -1;
// let elementsUnderCursor = [];
// // let elementUnderCursor = null;
// let katexSpans = [];

// document.addEventListener('mousemove', (finalPos) => {
//   //   //   cursorX = finalPos.clientX;
//   //   //   cursorY = finalPos.clientY;
//   //   console.log(
//   //     `finalPos.clientX = ${finalPos.clientX}, finalPos.clientY = ${finalPos.clientY}`
//   //   );
//   elementsUnderCursor.length = 0;
//   for (const el of document.elementsFromPoint(
//     finalPos.clientX,
//     finalPos.clientY
//   )) {
//     elementsUnderCursor.push(el);
//   }
//   //   elementUnderCursor = document.elementFromPoint(
//   //     finalPos.clientX,
//   //     finalPos.clientY
//   //   );
// });

// document.addEventListener('keydown', (event) => {
//   if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c') {
//     console.log(`CMD+C pressed!`);
//     console.log(`elementsUnderCursor:`);
//     console.log(elementsUnderCursor);
//     //   console.log(`elementUnderCursor:`);
//     //   console.log(elementUnderCursor);
//     console.log(`katexSpans:`);
//     console.log(katexSpans);
//     for (const katexSpan of katexSpans) {
//       if (elementsUnderCursor.includes(katexSpan)) {
//         //   if (elementUnderCursor === katexSpan) {
//         globalCopy(katexSpan);
//         break;
//       }
//     }
//   }
// });

const preventDefault = (e) => e.preventDefault();

// const globalCopy = async (katexSpan) => {
//   const annotation = katexSpan.querySelector('annotation');
//   if (annotation !== undefined && annotation !== null) {
//     const tex = `\\${
//       katexSpan.classList.contains('katex-display') ? '[' : '('
//     }${annotation.textContent}\\${
//       katexSpan.classList.contains('katex-display') ? ']' : ')'
//     }`;
//     try {
//       await navigator.clipboard.writeText(tex);
//     } catch (error) {
//       console.error('Caught ' + error);
//     }
//   }
// };

const makeCopyable = (katexSpan) => {
  //   katexSpans.push(katexSpan);

  const customMenu = document.getElementById('custom-context-menu');
  const menuList = customMenu.childNodes[0];
  const copyOption = menuList.childNodes[0];
  const interactionBlocker = document.getElementById('interaction-blocker');

  const copy = async () => {
    const annotation = katexSpan.querySelector('annotation');
    if (annotation !== undefined && annotation !== null) {
      const tex = `\\${
        katexSpan.classList.contains('katex-display') ? '[' : '('
      }${annotation.textContent}\\${
        katexSpan.classList.contains('katex-display') ? ']' : ')'
      }`;
      try {
        await navigator.clipboard.writeText(tex);
      } catch (error) {
        console.error('Caught ' + error);
      }
    }
  };
  //   const localCopy = globalCopy(katexSpan);

  //   //   document.addEventListener('keydown', (event) => {
  //   //     if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c') {
  //   //       console.log(`CMD+C pressed!`);
  //   //       console.log(`elementsUnderCursor:`);
  //   //       console.log(elementsUnderCursor);
  //   //       //   console.log(`elementUnderCursor:`);
  //   //       //   console.log(elementUnderCursor);
  //   //       if (elementsUnderCursor.includes(katexSpan)) {
  //   //         //   if (elementUnderCursor === katexSpan) {
  //   //         copy();
  //   //       }
  //   //     }
  //   //   });

  const showCustomMenu = (rightClick) => {
    rightClick.preventDefault();
    document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });
    document.body.addEventListener('wheel', preventDefault, {
      passive: false,
    });

    document.body.addEventListener('click', hideCustomMenu);

    customMenu.style.left = `${
      rightClick.clientX + 98.36 < document.documentElement.clientWidth
        ? rightClick.clientX
        : document.documentElement.clientWidth - 98.36
    }px`;
    customMenu.style.top = `${rightClick.clientY}px`;

    interactionBlocker.style.display = 'block';
    customMenu.style.display = 'block';

    copyOption.addEventListener('click', copy);
    // copyOption.addEventListener('click', localCopy);
  };

  katexSpan.addEventListener('contextmenu', showCustomMenu);

  const hideCustomMenu = () => {
    customMenu.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100 });
    customMenu.style.opacity = 0;

    setTimeout(() => {
      customMenu.removeAttribute('style');
      interactionBlocker.removeAttribute('style');

      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('wheel', preventDefault);

      copyOption.removeEventListener('click', copy);
      //   copyOption.removeEventListener('click', localCopy);
      document.body.removeEventListener('click', hideCustomMenu);
    }, 100);
  };
};

export { makeCopyable };
