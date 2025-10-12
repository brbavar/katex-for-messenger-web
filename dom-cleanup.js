import {
  emptyBubbleMessage /*, isGridChunk*/ /*, has, lacks */,
} from './config.js';
import * as selector from './selector.js';

const extractDescendants = (span) => {
  const childOfSpan = span.firstElementChild;
  if (childOfSpan !== null) {
    childOfSpan.remove();
    span.parentNode.insertBefore(childOfSpan, span);
  }
  span.remove();
};

// // const findGridChunk = (descendant) => {
// //   let ancestor = descendant;

// //   while (ancestor !== null && !isGridChunk(ancestor)) {
// //     if (ancestor.constructor.name === 'HTMLBodyElement') {
// //       return null;
// //     }
// //     ancestor = ancestor.parentNode;

// //     // if (ancestor !== null && ancestor.constructor.name === 'HTMLBodyElement') {
// //     //   return null;
// //     // }
// //   }

// //   return ancestor;
// // };

// const findAncestor = (
//   node,
//   // // rightFeatures = [new Map(), []],
//   // // wrongFeatures = [new Map(), []]
//   // nodesRelatedTo = [],
//   // nodeToRightFeatures = new Map(),
//   // nodeToWrongFeatures = new Map()
//   expectedFeatures,
//   unexpectedFeatures
// ) => {
//   let ancestor = node;

//   while (
//     ancestor !== null &&
//     // (!has(nodesRelatedTo(ancestor), rightFeatures) ||
//     //   !lacks(nodesRelatedTo(ancestor), wrongFeatures))
//     !(
//       has(ancestor, expectedFeatures(ancestor)) &&
//       lacks(ancestor, unexpectedFeatures(ancestor))
//     )
//   ) {
//     if (ancestor.constructor.name === 'HTMLBodyElement') {
//       return null;
//     }
//     ancestor = ancestor.parentNode;
//   }

//   return ancestor;
// };

const notifyUserIfFailed = (bubble) => {
  if (
    /^\s*$/.test(bubble.textContent) &&
    bubble.querySelector('img, [aria-label$="sticker"], [role="img"]') === null
  ) {
    // // // const bubbleClone = bubble.cloneNode();
    // // // bubbleClone.classList.add('empty-bubble-message');
    // // // bubbleClone.textContent = emptyBubbleMessage;

    // // // bubble.parentNode.insertBefore(bubbleClone, bubble);
    // // // bubble.remove();

    // // // console.log(`bubbleClone:`);
    // // // console.log(bubbleClone);
    // // // console.log(
    // // //   `window.getComputedStyle(bubbleClone).getPropertyValue('color') = ${window
    // // //     .getComputedStyle(bubbleClone)
    // // //     .getPropertyValue('color')}`
    // // // );

    // bubble.classList.add('empty-bubble-message');
    // bubble.textContent = emptyBubbleMessage;

    // console.log(`bubble:`);
    // console.log(bubble);
    // console.log(
    //   `window.getComputedStyle(bubble).getPropertyValue('color') = ${window
    //     .getComputedStyle(bubble)
    //     .getPropertyValue('color')}`
    // );

    // // const innerBubble = bubble.querySelector(selector.innerChatBubble);
    // // innerBubble.classList.add('empty-bubble-message');
    // // innerBubble.textContent = emptyBubbleMessage;

    // // console.log(`innerBubble:`);
    // // console.log(innerBubble);
    // // console.log(
    // //   `window.getComputedStyle(innerBubble).getPropertyValue('color') = ${window
    // //     .getComputedStyle(innerBubble)
    // //     .getPropertyValue('color')}`
    // // );

    const bubbleText = bubble.querySelector(selector.chatBubbleText);
    if (bubbleText !== null) {
      bubbleText.classList.add('empty-bubble-message');
      bubbleText.textContent = emptyBubbleMessage;

      // // console.log(`bubbleText:`);
      // // console.log(bubbleText);
      // // console.log(
      // //   `window.getComputedStyle(bubbleText).getPropertyValue('color') = ${window
      // //     .getComputedStyle(bubbleText)
      // //     .getPropertyValue('color')}`
      // // );

      // const bubbleTextColor = window
      //   .getComputedStyle(bubbleText)
      //   .getPropertyValue('color');

      // bubbleText.style.color = `${bubbleTextColor.substring(
      //   0,
      //   3
      // )}a${bubbleTextColor.substring(3, bubbleTextColor.length - 1)}, 0.6)`;
    }
  }
};

export {
  extractDescendants,
  notifyUserIfFailed /*, findGridChunk*/ /*, findAncestor*/,
};
