// import { isInAll } from './util.js';

const scrollbarColor = 'rgba(226, 225, 225, 0.2) transparent';

const emptyBubbleMessage =
  'LaTeX for Messenger failed to render the LaTeX, so the message had no visible content. Try again, sender. (Check console for any parsing errors.)';

// const isGridChunk = (el) => {
//   return (
//     !el.hasAttribute('class') &&
//     isInAll(el.parentNode, [
//       'x78zum5',
//       'xdt5ytf',
//       'x1iyjqo2',
//       'x2lah0s',
//       'xl56j7k',
//       'x121v3j4',
//     ])
//   );
// };

const gridChunkFeatures = (node) =>
  new Map([
    [
      node.parentNode,
      [['x78zum5', 'xdt5ytf', 'x1iyjqo2', 'x2lah0s', 'xl56j7k', 'x121v3j4']],
    ],
  ]);

const gridChunkNonFeatures = (node) =>
  new Map([[node, [[], new Map([['class', null]])]]]);

export {
  scrollbarColor,
  emptyBubbleMessage,
  /*isGridChunk*/ gridChunkFeatures,
  gridChunkNonFeatures,
};
