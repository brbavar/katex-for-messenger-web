import { scrollbarColor } from './scroll-config.js';
import manifest from './manifest.json';

const injectCss = () => {
  for (const resource of manifest.web_accessible_resources[0].resources) {
    if (resource.endsWith('.css')) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      // Should not use chrome.runtime API in Safari (and should use cautiously in Firefox)
      css.href = chrome.runtime.getURL(resource);
      css.type = 'text/css';
      document.head.appendChild(css);
    }
  }
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
  const baseSpans = span.querySelectorAll('span.base');
  let collectiveSpanWidth = 0;
  let baseSpanWidth = 0;

  // console.log(`${baseSpans.length} base spans found:`);
  for (let baseSpan of baseSpans) {
    // console.log(baseSpan);
    // console.log(
    //   `baseSpan.getBoundingClientRect().width = ${
    //     baseSpan.getBoundingClientRect().width
    //   }, baseSpan.style.width = ${baseSpan.style.width}, baseSpan.width = ${
    //     baseSpan.width
    //   }`
    // );
    if ((baseSpanWidth = baseSpan.getBoundingClientRect().width) <= 0) {
      // const baseSpanClone = baseSpan.cloneNode();
      // // document.body.append([baseSpanClone]);
      // document.body.appendChild(baseSpanClone);
      // baseSpanWidth = baseSpanClone.getBoundingClientRect().width;
      // baseSpanClone.remove();
      // const zeroWidthState = baseSpan.style.visibility;

      baseSpan.style.visibility = 'hidden';
      baseSpanWidth = baseSpan.getBoundingClientRect().width;
      // console.log(
      //   `zeroWidthState = ${zeroWidthState}, baseSpan.style.display = ${baseSpan.style.display}, baseSpanWidth = ${baseSpanWidth}`
      // );
      // console.log(`baseSpanWidth = ${baseSpanWidth}`);
      baseSpan.style.visibility = '';

      // baseSpan.style.visibility = zeroWidthState;
    }

    // // collectiveSpanWidth += baseSpan.getBoundingClientRect().width;
    // collectiveSpanWidth +=
    //   baseSpan.getBoundingClientRect().width > 0
    //     ? baseSpan.getBoundingClientRect().width
    //     : baseSpan.style.width;
    collectiveSpanWidth += baseSpanWidth;
  }

  // console.log(`collectiveSpanWidth = ${collectiveSpanWidth}`);

  let partialSumOfSpanWidths = collectiveSpanWidth;
  if (baseSpans.length > 0) {
    let oversizedBaseFound = false;
    for (const baseSpan of baseSpans) {
      if (
        baseSpan.getBoundingClientRect().width >
        span.parentNode.getBoundingClientRect().width
      ) {
        oversizedBaseFound = true;
        break;
      }
    }

    // // const getStoredItems = () => {
    // //   let storedItems = null;
    // //   chrome.storage.sync.get(
    // //     { longFormulaFormat: 'Add scroll bar' },
    // //     (items) => {
    // //       // longFormulaFormat = items.longFormulaFormat;
    // //       // console.log(`longFormulaFormat = ${longFormulaFormat}`);
    // //       storedItems = items;
    // //       console.log(`storedItems inside = ${storedItems}`);
    // //     }
    // //   );
    // //   return storedItems;
    // // };

    // const getStoredItems = async () => {
    //   storedItems = await chrome.storage.sync.get({
    //     longFormulaFormat: 'Add scroll bar',
    //   });
    // };
    // // const storedItems = getStoredItems();
    // let storedItems = null;
    // getStoredItems(storedItems);
    // let longFormulaFormat = '';
    // // console.log(`storedItems outside = ${storedItems}`);
    // if (storedItems !== null) {
    //   longFormulaFormat = storedItems.longFormulaFormat;
    //   console.log(`longFormulaFormat = ${longFormulaFormat}`);
    // }

    // const storage =
    //   browser.storage !== undefined ? browser.storage : chrome.storage;
    const storage =
      globalThis.browser?.storage.sync || globalThis.chrome?.storage.sync;

    // const storedItems = await chrome.storage.sync.get({
    //   longFormulaFormat: 'Add scroll bar',
    // });
    const storedItems = await storage.get({
      longFormulaFormat: 'Add scroll bar',
    });

    // console.log(`inside makeFit`);

    // console.log(
    //   `collectiveSpanWidth = ${collectiveSpanWidth}, span.parentNode.getBoundingClientRect().width = ${
    //     span.parentNode.getBoundingClientRect().width
    //   }`
    // );
    if (collectiveSpanWidth > span.parentNode.getBoundingClientRect().width) {
      // console.log(
      //   `collectiveSpanWidth > span.parentNode.getBoundingClientRect().width`
      // );
      // console.log(
      //   `storedItems.longFormulaFormat = ${storedItems.longFormulaFormat}, oversizedBaseFound = ${oversizedBaseFound}`
      // );
      if (
        storedItems.longFormulaFormat === 'line-breaks' &&
        !oversizedBaseFound
      ) {
        // console.log(`inserting line breaks`);
        let i = baseSpans.length - 1;
        let j = 0;

        const insertLineBreak = () => {
          if (
            collectiveSpanWidth > span.parentNode.getBoundingClientRect().width
          ) {
            if (i > j) {
              if (
                partialSumOfSpanWidths -
                  baseSpans[i].getBoundingClientRect().width <=
                  span.parentNode.getBoundingClientRect().width - 10 ||
                i - j === 1
              ) {
                const spacer = document.createElement('div');
                spacer.style.margin = '10px 0px';
                baseSpans[0].parentNode.insertBefore(spacer, baseSpans[i]);

                if (
                  collectiveSpanWidth -
                    (partialSumOfSpanWidths -
                      baseSpans[i].getBoundingClientRect().width) >
                  span.parentNode.getBoundingClientRect().width - 10
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
        // console.log(`making scrollable`);
        span.classList.add('katex-scrollable');

        if (span.getAttribute('class') === 'katex katex-scrollable') {
          span.style.display = 'inline-block';
        }
        span.style.width = `${span.parentNode.getBoundingClientRect().width}px`;
        span.style.overflowX = 'scroll';
        span.style.overflowY = 'hidden';
        span.style.scrollbarWidth = 'thin';
        span.style.scrollbarColor = scrollbarColor;
      }
    }
    // else {
    //   console.log(
    //     `collectiveSpanWidth <= span.parentNode.getBoundingClientRect().width`
    //   );
    // }
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
