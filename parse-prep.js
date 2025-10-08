import { getTexBounds } from './parse.js';

// const wrapTextNodes = (root, msgParts) => {
const wrapTextNodes = (root, msgPartToTexBounds) => {
  for (const node of root.childNodes) {
    if (node.nodeName !== 'CODE') {
      const texBounds = getTexBounds(node);
      if (node.constructor.name === 'Text' && texBounds.length > 0) {
        const span = document.createElement('span');
        span.textContent = node.textContent;

        node.parentNode.insertBefore(span, node);
        node.remove();

        // msgParts.push(span);
        msgPartToTexBounds.set(span, texBounds);
      } else {
        // wrapTextNodes(node, msgParts);
        wrapTextNodes(node, msgPartToTexBounds);
      }
    }
  }
};

export { wrapTextNodes };
