const preventDefault = (e) => e.preventDefault();

const makeCopyable = (katexSpan) => {
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

  const interactionBlocker = document.createElement('div');

  document.body.appendChild(interactionBlocker);

  const customMenu = document.createElement('div');

  const menuList = document.createElement('ul');

  const copyOption = document.createElement('li');
  copyOption.textContent = 'Copy LaTeX';
  copyOption.addEventListener('click', copy);

  document.body.appendChild(customMenu);
  customMenu.appendChild(menuList);
  menuList.appendChild(copyOption);

  const showCustomMenu = (rightClick) => {
    rightClick.preventDefault();

    document.body.addEventListener('touchmove', preventDefault, {
      passive: false,
    });
    document.body.addEventListener('wheel', preventDefault, {
      passive: false,
    });

    document.body.addEventListener('click', hideCustomMenu);

    interactionBlocker.id = 'interaction-blocker';

    customMenu.id = 'custom-context-menu';
    customMenu.style.left = `${
      rightClick.clientX + 90.36 < document.documentElement.clientWidth
        ? rightClick.clientX
        : document.documentElement.clientWidth - 90.36
    }px`;
    customMenu.style.top = `${rightClick.clientY}px`;
  };

  katexSpan.addEventListener('contextmenu', showCustomMenu);

  const hideCustomMenu = () => {
    customMenu.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 100 });
    customMenu.style.opacity = 0;
    setTimeout(() => {
      customMenu.removeAttribute('style');
      customMenu.removeAttribute('id');
      document.body.removeEventListener('touchmove', preventDefault);
      document.body.removeEventListener('wheel', preventDefault);
      interactionBlocker.removeAttribute('id');

      document.body.removeEventListener('click', hideCustomMenu);
    }, 100);
  };
};

export { makeCopyable };
