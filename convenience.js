const preventDefault = (e) => e.preventDefault();

const makeCopyable = (katexSpan) => {
  const customMenu = document.getElementById('custom-context-menu');
  const menuList = customMenu.childNodes[0];
  const copyOption = menuList.childNodes[0];
  const interactionBlocker = document.getElementById('interaction-blocker');

  const copy = async () => {
    console.log(`copying span:`);
    console.log(katexSpan);
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
      //   navigator.clipboard.writeText(tex).then(
      //     () => copyOption.removeEventListener('click', copy),
      //     (error) => {
      //       copyOption.removeEventListener('click', copy);
      //       console.error('Caught ' + error);
      //     }
      //   );
    }
  };

  console.log(`copy (outside showCustomMenu):`);
  console.log(copy);

  //   //   const interactionBlocker = document.createElement('div');

  //   //   document.body.appendChild(interactionBlocker);

  //   //   const customMenu = document.createElement('div');

  //   //   const menuList = document.createElement('ul');

  //   //   const copyOption = document.createElement('li');
  //   //   copyOption.textContent = 'Copy LaTeX';
  //   const copyOption = document.querySelector('#custom-context-menu > ul > li');
  //   copyOption.addEventListener('click', copy);

  //   //   // //   document.body.appendChild(customMenu);
  //   //   //   customMenu.appendChild(menuList);
  // //   const menuList = document.getElementById('custom-context-menu').childNodes[0];
  //   //   //   menuList.appendChild(copyOption);

  const showCustomMenu = (rightClick) => {
    rightClick.preventDefault();

    document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });
    document.body.addEventListener('wheel', preventDefault, {
      passive: false,
    });

    document.body.addEventListener('click', hideCustomMenu);

    // // interactionBlocker.id = 'interaction-blocker';
    interactionBlocker.style.display = 'block';

    // const copyOption = document.querySelector('#custom-context-menu > ul > li');
    console.log(`copyOption:`);
    console.log(copyOption);
    console.log(`copy (inside showCustomMenu):`);
    console.log(copy);

    // copyOption.addEventListener('click', copy);

    // // document.body.appendChild(customMenu);
    // // customMenu.id = 'custom-context-menu';
    customMenu.style.left = `${
      rightClick.clientX + 90.36 < document.documentElement.clientWidth
        ? rightClick.clientX
        : document.documentElement.clientWidth - 90.36
    }px`;
    customMenu.style.top = `${rightClick.clientY}px`;

    customMenu.style.display = 'block';
    // // menuList.style.display = 'block';
    // // copyOption.style.display = 'list-item';
    // customMenu.classList.add('show');

    copyOption.addEventListener('click', copy);
  };

  katexSpan.addEventListener('contextmenu', showCustomMenu);

  const hideCustomMenu = () => {
    customMenu.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100 });
    customMenu.style.opacity = 0;
    setTimeout(() => {
      copyOption.removeEventListener('click', copy);

      //   //   customMenu.remove();

      //   copyOption.removeAttribute('style');
      //   menuList.removeAttribute('style');
      customMenu.removeAttribute('style');
      //   customMenu.classList.remove('show');

      //   customMenu.removeAttribute('id');
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('wheel', preventDefault);
      //   //   interactionBlocker.removeAttribute('id');
      interactionBlocker.removeAttribute('style');

      document.body.removeEventListener('click', hideCustomMenu);
    }, 100);
  };
};

export { makeCopyable };
