import { emptyBubbleMessage, isGridChunk } from './config.js';

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
  if (
    /^\s*$/.test(bubble.textContent) &&
    bubble.querySelector('img, [aria-label$="sticker"], [role="img"]') === null
  ) {
    const bubbleClone = bubble.cloneNode();
    bubbleClone.classList.add('empty-bubble-message');
    bubbleClone.textContent = emptyBubbleMessage;

    bubble.parentNode.insertBefore(bubbleClone, bubble);
    bubble.remove();
  }
};

export { extractDescendants, removeIfEmpty, findGridChunk };
