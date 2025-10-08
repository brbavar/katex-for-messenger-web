import { emptyBubbleMessage, isGridChunk } from './config.js';
// import * as selector from './selector.js';

const extractDescendants = (span) => {
  const childOfSpan = span.firstElementChild;
  if (childOfSpan !== null) {
    childOfSpan.remove();
    span.parentNode.insertBefore(childOfSpan, span);
  }
  span.remove();
};

const findGridChunk = (descendant) => {
  let ancestor = descendant;

  while (ancestor !== null && !isGridChunk(ancestor)) {
    ancestor = ancestor.parentNode;

    if (ancestor !== null && ancestor.constructor.name === 'HTMLBodyElement') {
      return null;
    }
  }

  return ancestor;
};

const removeIfEmpty = (bubble) => {
  console.log(bubble);
  console.log(
    `bubble.querySelector('img, [aria-label$="sticker"], [role="img"]') = ${bubble.querySelector(
      'img, [aria-label$="sticker"], [role="img"]'
    )}`
  );
  if (
    /^\s*$/.test(bubble.textContent) &&
    bubble.querySelector('img, [aria-label$="sticker"], [role="img"]') === null
  ) {
    // // // const gridChunk = findGridChunk(bubble);
    // // // if (gridChunk !== null) {
    // // //   for (const node of gridChunk.childNodes) {
    // // //     node.remove();
    // // //   }
    // // //   gridChunk.classList.add('empty-bubble-message');
    // // //   gridChunk.innerHTML = emptyBubbleMessage;
    // // // }

    // bubble.classList.add('empty-bubble-message');
    // bubble.textContent = emptyBubbleMessage;
    const bubbleClone = bubble.cloneNode();
    bubbleClone.classList.add('empty-bubble-message');
    bubbleClone.textContent = emptyBubbleMessage;

    bubble.parentNode.insertBefore(bubbleClone, bubble);
    bubble.remove();
    // // const innerBubble = bubble.querySelector(selector.innerChatBubble);
    // // if (innerBubble !== null) {
    // //   innerBubble.classList.add('empty-bubble-message');
    // //   innerBubble.textContent = emptyBubbleMessage;
    // // }
    // [
    //   'html-div',
    //   'xdj266r',
    //   'x14z9mp',
    //   'xat24cr',
    //   'x1lziwak',
    //   'x14ctfv',
    //   'x13sv91t',
    //   'x6ikm8r',
    //   'x10wlt62',
    //   'xerhiuh',
    //   'x1pn3fxy',
    //   'x10zy8in',
    //   'xm9bcq3',
    //   'x1n2onr6',
    //   'x1vjfegm',
    //   'x1k4qllp',
    //   'x1mzt3pk',
    //   'x13faqbe',
    //   'x13fuv20',
    //   'x18b5jzi',
    //   'x1q0q8m5',
    //   'x1t7ytsu',
    //   'xaymx6s',
    //   'xofb2d2',
    // ].forEach((className) => bubble.classList.remove(className));
  }
};

export { extractDescendants, removeIfEmpty, findGridChunk };
