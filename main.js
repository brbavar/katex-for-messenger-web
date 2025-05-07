const injectCss = (filePath) => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = chrome.runtime.getURL(filePath);
  css.type = 'text/css';
  document.head.appendChild(css);
};

for (filePath of ['katex/katex.min.css', 'fb.katex.css']) injectCss(filePath);

const getTexBounds = (openingDelim, txt) => {
  let char1open = openingDelim[0],
    char2open = openingDelim[1];

  const displayTexEnclosed = char1open === '$';

  const openingDlmFound = (l) => {
    return txt[l] === char1open && txt[l + 1] === char2open;
  };

  const closingDlmFound = (r) => {
    return (
      txt[r] === char1open && txt[r + 1] === (displayTexEnclosed ? '$' : ')')
    );
  };

  let l = 0,
    r = 0;
  while (l < txt.length) {
    if (openingDlmFound(l)) {
      r = l + 2;

      while (r + 1 < txt.length && !closingDlmFound(r)) {
        if (openingDlmFound(r)) {
          l = r;
          r += 2;
        } else {
          r++;
        }
      }

      if (closingDlmFound(r)) {
        return [l, r];
      } else {
        return [];
      }
    } else {
      l++;
    }
  }

  return [];
};

const preserveNonTex = (txt, precedesTex, container, renderType) => {
  if (txt !== '') {
    // const newContainer = document.createElement(renderType ? 'div' : 'span');
    const newContainer = document.createElement('span');
    newContainer.classList.add(`${precedesTex ? 'pre' : 'post'}-tex`);
    newContainer.textContent = txt;
    if (precedesTex) {
      // const newContainer = document.createElement(renderType ? 'div' : 'span');
      // newContainer.classList.add('pre-tex');
      // newContainer.textContent = txt;

      container.insertBefore(newContainer, container.children[0]);

      let bounds = [[], []];
      let otherRenderType = renderType === 1 ? 0 : 1;
      bounds[otherRenderType].push(
        ...getTexBounds(otherRenderType ? '$$' : '\\(', txt)
      );
      if (bounds[otherRenderType].length > 0) {
        console.log('otherRenderType: ' + otherRenderType);
        renderTex(otherRenderType, newContainer, bounds);
      }
    } else {
      // const newContainer = document.createElement(
      //   container.classList.contains('pre-tex') ? 'span' : 'div'
      // );
      // newContainer.classList.add('post-tex');
      // newContainer.textContent = txt;

      container.appendChild(newContainer);

      let bounds = [[], []];
      bounds[renderType].push(...getTexBounds(renderType ? '$$' : '\\(', txt));
      if (bounds[renderType].length > 0) {
        renderTex(renderType, newContainer, bounds);
      }
    }
  }
};

const renderTex = (renderType, container /*, texBounds*/) => {
  // const bounds = texBounds[renderType];
  const bounds = getTexBounds(renderType ? '$$' : '\\(', container.textContent);
  if (bounds.length > 1) {
    const origTxt = container.textContent;
    const preTex = origTxt.substring(0, bounds[0]);
    const tex = origTxt.substring(bounds[0] + 2, bounds[1]);
    const postTex = origTxt.substring(bounds[1] + 2);

    // if (renderType === 0)
    console.log(
      'bounds: ' +
        bounds +
        '\n\npreTex: ' +
        preTex +
        '\n\ntex: ' +
        tex +
        '\n\npostTex: ' +
        postTex
    );

    // Add code to keep track of where bounds are as new divs/spans are introduced

    katex.render(tex, container, {
      displayMode: renderType,
    });

    // return; // Test 1

    preserveNonTex(preTex, true, container, renderType);
    // return; // Test 2
    preserveNonTex(postTex, false, container, renderType);
  }
};

const childListObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const nodeType = node.constructor.name;
      if (nodeType === 'HTMLDivElement') {
        const yourMessages = node.querySelectorAll(
          '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xat24cr.xdj266r.xeuugli.x1vjfegm'
        );
        const theirMessages = node.querySelectorAll(
          'html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1gslohp.x12nagc.x1yc453h.x126k92a.x18lvrbx'
        );

        // const messages = node.querySelectorAll(
        //   '.html-div.x11i5rnm.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd'
        // );
        [...yourMessages, ...theirMessages].forEach((msg) => {
          const txt = msg.textContent;

          const texBounds = [[], []];

          texBounds[0].push(...getTexBounds('\\(', txt));
          texBounds[1].push(...getTexBounds('$$', txt));

          if (msg.textContent.startsWith('This is related'))
            console.log('texBounds[0]: ' + texBounds[0]);

          const inlineTexFound = texBounds[0].length > 0;
          const displayTexFound = texBounds[1].length > 0;

          if (inlineTexFound || displayTexFound) {
            let parent = msg.parentNode;

            while (parent != null) {
              if (parent.role === 'row') break;
              parent = parent.parentNode;
            }

            parent.style.border =
              '14px solid var(--mwp-message-row-background)';

            // Don't render directly into msg in both invocations below
            renderTex(0, msg, texBounds);
            // return; // Test 3
            renderTex(1, msg, texBounds);
            return; // Tests 1, 2, 4
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
