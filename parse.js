import { render } from 'katex';
import { removeNewlines, makeFit } from './aesthetex.js';
import { wrapTextNodes } from './parse-prep.js';
import { extractDescendants } from './dom-cleanup.js';
// import { DomInfo } from './DomInfo.js';
import { isOfTheClasses } from './util.js';

const isOpeningDelim = (delim) => {
  if (delim.length === 0) {
    return false;
  }
  return delim[0] === '$' || delim[1] === '(' || delim[1] === '[';
};

const pairsWith = (delim1, delim2) => {
  if (delim1[0] === '$') {
    return delim1 === delim2;
  } else {
    if (delim1[1] === '(') {
      return delim2[1] === ')';
    }
    if (delim1[1] === '[') {
      return delim2[1] === ']';
    }
  }
  return false;
};

const getTexBounds = (msg, escapeCharIndices = []) => {
  const txt = msg.textContent;
  const bounds = [];

  const delimAt = (i) => {
    let delim = '';
    if ((txt[i] === '$' || txt[i] === '\\') && i > 0 && txt[i - 1] === '\\') {
      escapeCharIndices.push(i - 1);
    } else {
      if (txt[i] === '$') {
        delim += '$';
        if (txt[i + 1] === '$') {
          delim += '$';
        }
      }
      if (txt[i] === '\\') {
        if (
          txt[i + 1] === '(' ||
          txt[i + 1] === ')' ||
          txt[i + 1] === '[' ||
          txt[i + 1] === ']'
        ) {
          delim = `${txt[i]}${txt[i + 1]}`;
        }
      }
    }
    return delim;
  };

  let l = 0,
    r = 0;
  while (l < txt.length) {
    let leftDelim = delimAt(l);
    let rightDelim;
    if (isOpeningDelim(leftDelim)) {
      r = l + 2;
      rightDelim = delimAt(r);

      while (r + 1 < txt.length && !pairsWith(leftDelim, rightDelim)) {
        if (leftDelim === rightDelim) {
          l = r;
          r += 2;
          leftDelim = delimAt(l);
          rightDelim = delimAt(r);
        } else {
          rightDelim = delimAt(++r);
        }
      }

      if (pairsWith(leftDelim, rightDelim)) {
        bounds.push([l, r]);
      }
    }

    if (bounds.length === 0 || l > bounds[bounds.length - 1][1]) {
      l++;
    } else {
      l = bounds[bounds.length - 1][1] + rightDelim.length;
    }
  }

  return bounds;
};

const removeEscapeChars = (msgPart, escapeCharIndices, texBounds = []) => {
  if (texBounds.length > 0) {
    const outerEscapeCharIndices = [];
    for (let i = 0; i < escapeCharIndices.length; i++) {
      for (let j = 0; j < texBounds.length; j++) {
        if (
          escapeCharIndices[i] > texBounds[j][0] &&
          escapeCharIndices[i] < texBounds[j][1]
        ) {
          break;
        } else {
          if (j === texBounds.length - 1) {
            if (!outerEscapeCharIndices.includes(escapeCharIndices[i])) {
              outerEscapeCharIndices.push(escapeCharIndices[i]);
            }
          }
        }
      }
    }
    escapeCharIndices = outerEscapeCharIndices;
  }

  for (let i = 0; i < escapeCharIndices.length; i++) {
    msgPart.textContent = `${msgPart.textContent.substring(
      0,
      escapeCharIndices[i]
    )}${msgPart.textContent.substring(escapeCharIndices[i] + 1)}`;

    if (texBounds.length > 0) {
      for (let j = 0; j < texBounds.length; j++) {
        for (let k = 0; k < 2; k++) {
          if (texBounds[j][k] > escapeCharIndices[i]) {
            texBounds[j][k]--;
          }
        }
      }
    }

    for (let j = i + 1; j < escapeCharIndices.length; j++) {
      if (escapeCharIndices[i] < escapeCharIndices[j]) {
        escapeCharIndices[j]--;
      }
    }
  }

  escapeCharIndices.length = 0;
};

const parse = (msgPart) => {
  const escapeCharIndices = [];
  let texBounds;

  if (msgPart !== null && msgPart.textContent !== '') {
    texBounds = getTexBounds(msgPart, escapeCharIndices);
  }

  if (texBounds !== undefined && texBounds.length) {
    removeEscapeChars(msgPart, escapeCharIndices, texBounds);

    for (let i = 0; i < texBounds.length; i++) {
      const offset = 32 * i;
      const delimLen =
        msgPart.textContent[texBounds[i][0] + offset] === '$' &&
        msgPart.textContent[texBounds[i][0] + offset + 1] !== '$'
          ? 1
          : 2;

      msgPart.textContent = `${msgPart.textContent.substring(
        0,
        texBounds[i][0] + offset
      )}<span class='renderable'>${msgPart.textContent.substring(
        texBounds[i][0] + offset,
        texBounds[i][1] + delimLen + offset
      )}</span>${msgPart.textContent.substring(
        texBounds[i][1] + delimLen + offset
      )}`;
    }

    msgPart.innerHTML = msgPart.textContent;

    msgPart.querySelectorAll('span.renderable').forEach((span) => {
      try {
        const hasDollarDelim = span.textContent[0] === '$';
        const hasSingleDollarDelim =
          hasDollarDelim && span.textContent[1] !== '$';
        const delimLen = hasSingleDollarDelim ? 1 : 2;

        render(
          span.textContent.substring(
            delimLen,
            span.textContent.length - delimLen
          ),
          span,
          {
            displayMode:
              (hasDollarDelim && !hasSingleDollarDelim) ||
              span.textContent[1] === '[',
          }
        );
      } catch (error) {
        console.error('Caught ' + error);
      }

      extractDescendants(span);
    });

    removeNewlines(msgPart);

    // console.log(`about to make spans from this msgPart fit:`);
    // console.log(msgPart);
    // setTimeout(() => {
    msgPart
      .querySelectorAll(
        'span:where(:not(.katex-display) > .katex, .katex-display)'
      )
      .forEach((span) => {
        // console.log(`making this span fit:`);
        // console.log(span);
        makeFit(span);
      });
    // }, 0);
  } else {
    removeEscapeChars(msgPart, escapeCharIndices);
  }
};

// const findGridcell = (descendant) => {
//   let ancestor = descendant;

//   while (
//     ancestor !== null &&
//     (!ancestor.hasAttribute('role') ||
//       ancestor.getAttribute('role') !== 'gridcell' ||
//       !isOfTheClasses(ancestor, ['x78zum5', 'xdt5ytf', 'x1n2onr6']))
//   ) {
//     ancestor = ancestor.parentNode;

//     if (ancestor !== null && ancestor.constructor.name === 'HTMLBodyElement') {
//       return null;
//     }
//   }

//   return ancestor;
// };

const findGridChunk = (descendant) => {
  if (
    !descendant.hasAttribute('class') &&
    isOfTheClasses(descendant.parentNode, [
      'x78zum5',
      'xdt5ytf',
      'x1iyjqo2',
      'x2lah0s',
      'xl56j7k',
      'x121v3j4',
    ])
  ) {
    return descendant;
  }

  let ancestor = descendant.parentNode;

  while (
    ancestor !== null &&
    (ancestor.hasAttribute('class') ||
      !isOfTheClasses(ancestor.parentNode, [
        'x78zum5',
        'xdt5ytf',
        'x1iyjqo2',
        'x2lah0s',
        'xl56j7k',
        'x121v3j4',
      ]))
  ) {
    ancestor = ancestor.parentNode;

    if (ancestor !== null && ancestor.constructor.name === 'HTMLBodyElement') {
      return null;
    }
  }

  return ancestor;
};

const parseParts = (bubble) => {
  const msgParts = [];
  if (bubble.querySelectorAll('.katex').length === 0) {
    // console.log(`about to parse this bubble:`);
    // console.log(bubble);
    wrapTextNodes(bubble, msgParts);
  } else {
    // console.log(
    //   `would have parsed this bubble if there weren't already katex elements in it:`
    // );
    // console.log(bubble);
    bubble
      .querySelectorAll(
        'span:where(:not(.katex-display) > .katex, .katex-display)'
      )
      .forEach((span) => {
        // console.log(`making this span fit:`);
        // console.log(span);
        makeFit(span);
      });
  }
  for (const msgPart of msgParts) {
    parse(msgPart);
    // // setTimeout(() => {
    // if (msgPart.querySelectorAll('.katex').length === 0) {
    //   // // const domInfo = new DomInfo();
    //   // // // domInfo.findGridcell(msgPart).remove();
    //   // // domInfo.findGridcell(msgPart).style.display = 'none';
    //   // findGridcell(msgPart).style.display = 'none';
    //   findGridChunk(msgPart).style.display = 'none';
    // }
    // // }, 1000);
  }
  if (bubble.textContent === '') {
    findGridChunk(bubble).style.display = 'none';
  }
};

export { parseParts, getTexBounds, findGridChunk };
