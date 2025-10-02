import { isOfTheClasses } from './util.js';

const scrollbarColor = 'rgba(226, 225, 225, 0.2) transparent';

const emptyBubbleMessage =
  'LaTeX for Messenger failed to render your LaTeX, so your message had no visible content. Try again. (Check console for any parsing errors.)';

const isGridChunk = (el) => {
  return (
    !el.hasAttribute('class') &&
    isOfTheClasses(el.parentNode, [
      'x78zum5',
      'xdt5ytf',
      'x1iyjqo2',
      'x2lah0s',
      'xl56j7k',
      'x121v3j4',
    ])
  );
};

export { scrollbarColor, emptyBubbleMessage, isGridChunk };
