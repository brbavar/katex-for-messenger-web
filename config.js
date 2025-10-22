const emptyBubbleMessage =
  'LaTeX for Messenger failed to render the LaTeX, so the message had no visible content. Try again, sender. (Check console for any parsing errors.)';

const gridChunkFeatures = (node) =>
  new Map([
    [
      node.parentNode,
      [['x78zum5', 'xdt5ytf', 'x1iyjqo2', 'x2lah0s', 'xl56j7k', 'x121v3j4']],
    ],
  ]);

const gridChunkNonFeatures = (node) =>
  new Map([[node, [[], new Map([['class', null]])]]]);
// const gridChunkNonFeatures = null;

const gridcellFeatures = (node) =>
  new Map([
    [
      node,
      [
        ['x78zum5', 'xdt5ytf', 'x1n2onr6'],
        new Map([
          ['data-scope', 'messages_table'],
          ['role', 'gridcell'],
        ]),
      ],
    ],
  ]);

export {
  emptyBubbleMessage,
  gridChunkFeatures,
  gridChunkNonFeatures,
  gridcellFeatures,
};
