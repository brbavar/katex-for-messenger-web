import { emptyBubbleMessage } from './config.js';
import * as selector from './selector.js';

const extractDescendants = (span) => {
  const childOfSpan = span.firstElementChild;
  if (childOfSpan !== null) {
    childOfSpan.remove();
    span.parentNode.insertBefore(childOfSpan, span);
  }
  span.remove();
};

const notifyUserIfFailed = (bubble) => {
  if (
    /^\s*$/.test(bubble.textContent) &&
    bubble.querySelector('img, [aria-label$="sticker"], [role="img"]') === null
  ) {
    const bubbleText = bubble.querySelector(selector.chatBubbleText);
    if (bubbleText !== null) {
      bubbleText.classList.add('empty-bubble-message');
      bubbleText.textContent = emptyBubbleMessage;
    }
  }
};

export { extractDescendants, notifyUserIfFailed };
