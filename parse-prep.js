import { getTexBounds } from './parse.js';

const wrapTextNodes = (root, msgPartToTexBounds) => {
  for (const node of root.childNodes) {
    if (node.nodeName !== 'CODE') {
      const texBounds = getTexBounds(node);
      if (node.constructor.name === 'Text' && texBounds.length > 0) {
        const span = document.createElement('span');
        span.textContent = node.textContent;

        node.parentNode.insertBefore(span, node);
        node.remove();

        msgPartToTexBounds.set(span, texBounds);
      } else {
        wrapTextNodes(node, msgPartToTexBounds);
      }
    }
  }
};

export { wrapTextNodes };
