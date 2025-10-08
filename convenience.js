import * as selector from './selector.js';

// const copy = async (click) => {
//   console.log(`click.target:`);
//   console.log(click.target);
//   const annotation = click.target.querySelector('annotation');
//   console.log(`annotation:`);
//   console.log(annotation);
//   if (annotation !== undefined && annotation !== null) {
//     const tex = `\\${
//       click.target.classList.contains('katex-display') ? '[' : '('
//     }${annotation.textContent}\\${
//       click.target.classList.contains('katex-display') ? ']' : ')'
//     }`;
//     console.log(`tex = ${tex}`);
//     try {
//       await navigator.clipboard.writeText(tex);
//     } catch (error) {
//       console.error('Caught ' + error);
//     }
//   }
// };

const preventDefault = (e) => e.preventDefault();

const makeCopyable = (katexSpan) => {
  //   console.log('katexSpan:');
  //   console.log(katexSpan);

  const copy = async () => {
    console.log(`copying LaTeX`);
    const annotation = katexSpan.querySelector('annotation');
    console.log(`annotation:`);
    console.log(annotation);
    if (annotation !== undefined && annotation !== null) {
      //   const tex = `\\${
      //     katexSpan.classList.contains('katex-display') ? '[' : '('
      //   }${annotation.textContent}\\${
      //     katexSpan.classList.contains('katex-display') ? ']' : ')'
      //   }`;
      console.log(`katexSpan:`);
      console.log(katexSpan);
      console.log(
        `katexSpan.classList.contains('katex-display') === ${katexSpan.classList.contains(
          'katex-display'
        )}`
      );
      console.log(`annotation.textContent = ${annotation.textContent}`);
      let tex =
        '\\' + (katexSpan.classList.contains('katex-display') ? '[' : '(');
      tex += annotation.textContent + '\\';
      tex += katexSpan.classList.contains('katex-display') ? ']' : ')';
      console.log(`tex = ${tex}`);
      try {
        await navigator.clipboard.writeText(tex);
        console.log(
          `clipboard now contains this text: ${await navigator.clipboard.readText()}`
        );
      } catch (error) {
        console.error('Caught ' + error);
      }
    }
  };

  //   katexSpan.addEventListener('click', copy);

  //   // Add tooltip
  //   const tooltip = document.createElement('span');
  //   tooltip.textContent = 'Copy LaTeX';
  //   tooltip.classList.add('tooltip');
  //   tooltip.style.display = 'none';

  //   katexSpan.addEventListener('mouseover', () => {
  //     tooltip.classList.add('tooltip');
  //     tooltip.style.display = '';
  //   });

  //   katexSpan.addEventListener('mouseout', () => {
  //     tooltip.style.display = 'none';
  //     tooltip.classList.remove('tooltip');
  //   });

  //   katexSpan.style.position = 'relative';
  //   katexSpan.appendChild(tooltip);

  const interactionBlocker = document.createElement('div');
  //   interactionBlocker.id = 'interaction-blocker';

  document.body.appendChild(interactionBlocker);

  const customMenu = document.createElement('div');
  //   customMenu.id = 'custom-context-menu';

  const menuList = document.createElement('ul');

  const copyOption = document.createElement('li');
  copyOption.textContent = 'Copy LaTeX';
  copyOption.addEventListener('click', copy);

  document.body.appendChild(customMenu);
  customMenu.appendChild(menuList);
  menuList.appendChild(copyOption);

  //   const htmlEl = document.querySelector('html');

  const showCustomMenu = (rightClick) => {
    // let clickedOnTex = false;

    // const elementsUnderCursor = document.elementsFromPoint(
    //   rightClick.clientX,
    //   rightClick.clientY
    // );
    // for (const el of elementsUnderCursor) {
    //   if (
    //     el.classList.contains('katex') ||
    //     el.classList.contains('katex-display')
    //   ) {
    //     clickedOnTex = true;
    //     break;
    //   }
    // }

    // if (clickedOnTex) {
    //   // const scrollPos = window.pageYOffset;
    //   // console.log(`scrollPos = ${scrollPos}`);

    rightClick.preventDefault();
    console.log(`default prevented`);
    // katexSpan.appendChild(menu);

    // document.body.style.overflow = 'hidden';
    // document.body.style.position = 'fixed';
    // document.body.style.top = `-${scrollPos}px`;

    document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });
    document.body.addEventListener('wheel', preventDefault, {
      passive: false,
    });
    // //   //   document.body.addEventListener('mouseover', preventDefault, {
    // //   //     passive: false,
    // //   //   });
    // //   document.body.style.pointerEvents = 'none';

    // //   document.querySelector(selector.mount).inert = true;
    // //   document.querySelector(selector.mount).setAttribute('inert', '');

    // // const mount = document.querySelector(selector.mount);
    // // const makeInert = (root) => {
    // //   for (const node of root.childNodes) {
    // //     if (
    // //       !(
    // //         node.classList === undefined ||
    // //         node.classList.contains('katex') ||
    // //         node.classList.contains('katex-display')
    // //       )
    // //     ) {
    // //       node.inert = true;
    // //       makeInert(node);
    // //     }
    // //   }
    // // };
    // // makeInert(mount);

    // copyOption.addEventListener('click', copy);

    // // // // // const htmlEl = document.querySelector('html');
    // // // // htmlEl.style.scrollbarGutter = 'stable';
    // // // // // htmlEl.style.overflow = 'hidden';
    // // // htmlEl.style.position = 'fixed';
    // // // document.body.style.marginLeft = '15px';
    // // htmlEl.classList.add('unscrollable-page');
    // htmlEl.style.overflow = 'hidden';
    // document.body.style.overflowY = 'scroll';
    // document.body.style.height = '100vh';
    // // // // // document.body.style.overflow = 'hidden !important';
    // // // // htmlEl.addEventListener('touchmove', preventDefault, {
    // // // //   passive: false,
    // // // // });
    // // // // htmlEl.addEventListener('wheel', preventDefault, {
    // // // //   passive: false,
    // // // // });

    document.body.addEventListener('click', hideCustomMenu);

    interactionBlocker.id = 'interaction-blocker';

    customMenu.id = 'custom-context-menu';
    customMenu.style.left = `${
      rightClick.clientX + 90.36 < document.documentElement.clientWidth
        ? rightClick.clientX
        : document.documentElement.clientWidth - 90.36
    }px`;
    customMenu.style.top = `${rightClick.clientY}px`;
    //   customMenu.style.display = 'block';

    console.log(`customMenu:`);
    console.log(customMenu);

    console.log(`customMenu.parentNode:`);
    console.log(customMenu.parentNode);
    // }
  };

  katexSpan.addEventListener('contextmenu', showCustomMenu);
  //   document.addEventListener('contextmenu', showCustomMenu);

  const hideCustomMenu = (/*e*/) => {
    //   let clickedOutsideMenu = true;

    //   if (e.target === customMenu) {
    //     clickedOutsideMenu = false;
    //   } else {
    //     for (const menuDescendant of customMenu.querySelectorAll('*')) {
    //       if (e.target === menuDescendant) {
    //         clickedOutsideMenu = false;
    //       }
    //     }
    //   }

    //   if (clickedOutsideMenu) {
    //     customMenu.style.display = 'none';
    //     // copyOption.removeEventListener('click', copy);
    //     document.body.removeEventListener('touchmove', preventDefault);
    //     document.body.removeEventListener('wheel', preventDefault);
    //   }
    customMenu.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100 });
    customMenu.style.opacity = 0;
    setTimeout(() => {
      //   customMenu.style.display = 'none';
      customMenu.removeAttribute('style');
      customMenu.removeAttribute('id');
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('wheel', preventDefault);
      //   //   //   //   //   //   document.body.removeEventListener('mouseover', preventDefault);
      //   //   //   //   //   document.body.style.pointerEvents = '';
      //   //   //   //   htmlEl.removeEventListener('touchmove', preventDefault);
      //   //   //   //   htmlEl.removeEventListener('wheel', preventDefault);
      //   //   //   htmlEl.style.scrollbarGutter = '';
      //   //   htmlEl.style.position = '';
      //   //   document.body.style.marginLeft = '';
      //   htmlEl.classList.remove('unscrollable-page');
      interactionBlocker.removeAttribute('id');
      //   //   document.querySelector(selector.mount).inert = false;
      //   //   document.querySelector(selector.mount).removeAttribute('inert');
      //   // katexSpan.addEventListener('contextmenu', showCustomMenu);

      document.body.removeEventListener('click', hideCustomMenu);

      //   copyOption.removeEventListener('click', copy);
    }, 100);
  };
};

export { makeCopyable };
