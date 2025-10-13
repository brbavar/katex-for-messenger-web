import manifest from './manifest.json';

const injectCss = () => {
  const waitForRuntime = () => {
    const runtime = globalThis.browser?.runtime || globalThis.chrome?.runtime;
    console.log(`runtime = ${runtime}`);
    if (runtime === undefined) {
      setTimeout(waitForRuntime, 100);
    } else {
      for (const resource of manifest.web_accessible_resources[0].resources) {
        if (resource.endsWith('.css')) {
          console.log(`appending ${resource} to document head's child list`);
          const css = document.createElement('link');
          css.rel = 'stylesheet';
          css.href = runtime.getURL(resource);
          css.type = 'text/css';
          document.head.appendChild(css);
        }
      }
    }
  };
  waitForRuntime();
};

const removeNewlines = (msg) => {
  const inlineNodeIndices = [];
  let i = 0;
  while (i < msg.childNodes.length) {
    let msgPart = msg.childNodes[i];

    if (
      'hasAttribute' in msgPart &&
      msgPart.hasAttribute('class') &&
      msgPart.classList.contains('katex-display')
    ) {
      if (inlineNodeIndices.length > 0) {
        const lastInlineNodeIndex =
          inlineNodeIndices[inlineNodeIndices.length - 1];
        const lastInlineNode = msg.childNodes[lastInlineNodeIndex];
        let j;
        if (lastInlineNode.nodeValue !== null) {
          for (
            j = lastInlineNode.nodeValue.length - 1;
            j >= 0 && lastInlineNode.nodeValue[j] === '\n';
            j--
          ) {}
          if (lastInlineNode.nodeValue[++j] === '\n') {
            lastInlineNode.nodeValue = lastInlineNode.nodeValue.substring(0, j);
          }
        }
      }

      inlineNodeIndices.length = 0;
    } else {
      inlineNodeIndices.push(i);
    }
    i++;
  }

  if (inlineNodeIndices.length > 0) {
    const firstInlineNode = msg.childNodes[inlineNodeIndices[0]];
    let j;
    if (firstInlineNode.nodeValue !== null) {
      for (
        j = 0;
        j < firstInlineNode.nodeValue.length &&
        firstInlineNode.nodeValue[j] === '\n';
        j++
      ) {}
      if (firstInlineNode.nodeValue[j - 1] === '\n') {
        firstInlineNode.nodeValue = firstInlineNode.nodeValue.substring(j);
      }
    }
  }
};

const makeFit = async (span) => {
  const spanGrandparentWidth =
    span.parentNode.parentNode.getBoundingClientRect().width;

  const baseSpans = span.querySelectorAll('span.base');
  let collectiveSpanWidth = 0;
  for (let baseSpan of baseSpans) {
    collectiveSpanWidth += baseSpan.getBoundingClientRect().width;
  }
  let partialSumOfSpanWidths = collectiveSpanWidth;

  if (baseSpans.length > 0) {
    let oversizedBaseFound = false;
    for (const baseSpan of baseSpans) {
      if (baseSpan.getBoundingClientRect().width > spanGrandparentWidth) {
        oversizedBaseFound = true;
        break;
      }
    }

    const storage = globalThis.browser?.storage || globalThis.chrome?.storage;
    console.log(`storage = ${storage}`);
    let storedItems = null;
    if (
      storage !== undefined &&
      storage !== null &&
      storage.sync !== undefined &&
      storage.sync !== null
    ) {
      try {
        storedItems = await storage.sync.get({
          longFormulaFormat: 'Add scroll bar',
        });
      } catch (error) {
        console.error('Caught ' + error);
      }
    }

    if (collectiveSpanWidth > spanGrandparentWidth) {
      if (
        storedItems !== null &&
        storedItems.longFormulaFormat === 'line-breaks' &&
        !oversizedBaseFound
      ) {
        let i = baseSpans.length - 1;
        let j = 0;

        const insertLineBreak = () => {
          if (collectiveSpanWidth > spanGrandparentWidth) {
            if (i > j) {
              if (
                partialSumOfSpanWidths -
                  baseSpans[i].getBoundingClientRect().width <=
                  spanGrandparentWidth - 10 ||
                i - j === 1
              ) {
                const spacer = document.createElement('div');
                spacer.style.margin = '10px 0px';
                baseSpans[0].parentNode.insertBefore(spacer, baseSpans[i]);

                if (
                  collectiveSpanWidth -
                    (partialSumOfSpanWidths -
                      baseSpans[i].getBoundingClientRect().width) >
                  spanGrandparentWidth - 10
                ) {
                  partialSumOfSpanWidths =
                    collectiveSpanWidth -
                    (partialSumOfSpanWidths -
                      baseSpans[i].getBoundingClientRect().width);
                  collectiveSpanWidth = partialSumOfSpanWidths;
                  j = i;
                  i = baseSpans.length - 1;

                  insertLineBreak();
                }
              } else {
                partialSumOfSpanWidths -=
                  baseSpans[i--].getBoundingClientRect().width;

                insertLineBreak();
              }
            }
          }
        };
        insertLineBreak();
      } else {
        span.classList.add('katex-scrollable');

        if (span.getAttribute('class') === 'katex katex-scrollable') {
          span.style.display = 'inline-block';
        }
        span.style.width = `${spanGrandparentWidth}px`;
        span.style.overflowX = 'scroll';
        span.style.overflowY = 'hidden';
        span.style.scrollbarWidth = 'thin';

        const defaultScrollbarColor = window
          .getComputedStyle(span)
          .getPropertyValue('scrollbar-color');

        if (defaultScrollbarColor === 'auto') {
          const spanTextColor = window
            .getComputedStyle(span)
            .getPropertyValue('color');

          span.style.scrollbarColor = `${spanTextColor.substring(
            0,
            3
          )}a${spanTextColor.substring(
            3,
            spanTextColor.length - 1
          )}, 0.4) transparent`;
        }
      }
    }
  }
};

const undoMakeFit = (span) => {
  span.querySelectorAll('div').forEach((div) => {
    if (div.style.margin === '10px 0px' && div.attributes.length === 1) {
      div.remove();
    }
  });

  span.classList.remove('katex-scrollable');
  span.removeAttribute('style');
};

export { injectCss, removeNewlines, makeFit, undoMakeFit };
