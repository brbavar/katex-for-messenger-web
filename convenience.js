const preventDefault = (e) => e.preventDefault();

const makeCopyable = (katexSpan) => {
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
      document.body.removeEventListener('click', hideCustomMenu);
    }, 100);
  };
};

export { makeCopyable };
