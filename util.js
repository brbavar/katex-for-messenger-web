const isInAll = (node, classes) => {
  for (const c of classes) {
    // console.log(`c = ${c}, node = ${node}`);
    // if (node !== null) {
    //   console.log(`'classList' in node = ${'classList' in node}`);
    //   console.log(`node.classList.contains(c) = ${node.classList.contains(c)}`);
    // }
    if (
      node === null ||
      !('classList' in node) ||
      !node.classList.contains(c)
    ) {
      return false;
    }
  }
  return true;
};

const has = (node, expectedFeatures) => {
  let attributesPresent = true;
  let classesPresent = true;

  if (expectedFeatures !== null) {
    for (const nodeFeaturesPair of expectedFeatures(node)) {
      const relatedNode = nodeFeaturesPair[0];

      let classes = [];
      let attributes = null;
      if (nodeFeaturesPair[1] !== undefined) {
        if (nodeFeaturesPair[1].length > 0) {
          classes = nodeFeaturesPair[1][0];
        }
        if (nodeFeaturesPair[1].length > 1) {
          attributes = nodeFeaturesPair[1][1];
        }
      }

      // console.log(`relatedNode:`);
      // console.log(relatedNode);
      // console.log(`classes:`);
      // console.log(classes);
      // console.log(`attributes:`);
      // console.log(attributes);

      if (attributes !== null) {
        for (const attrValPair of attributes) {
          // console.log(`attrValPair:`);
          // console.log(attrValPair);
          // console.log(
          //   `relatedNode.hasAttribute(${
          //     attrValPair[0]
          //   }) = ${relatedNode.hasAttribute(attrValPair[0])}`
          // );
          // console.log(
          //   `relatedNode.getAttribute(${attrValPair[0]}) === ${
          //     attrValPair[1]
          //   }: ${relatedNode.getAttribute(attrValPair[0]) === attrValPair[1]}`
          // );
          if (
            !(
              relatedNode.hasAttribute(attrValPair[0]) &&
              relatedNode.getAttribute(attrValPair[0]) === attrValPair[1]
            )
          ) {
            attributesPresent = false;
            break;
          }
        }
        if (!attributesPresent) {
          return false;
        }
      }

      if (!isInAll(relatedNode, classes)) {
        classesPresent = false;
        break;
      }
    }
  }

  // return attributesPresent && classesPresent;
  return classesPresent;
};

const lacks = (node, unexpectedFeatures) => {
  let attributesAbsent = true;
  let classesAbsent = true;

  if (unexpectedFeatures !== null) {
    for (const nodeFeaturesPair of unexpectedFeatures(node)) {
      const relatedNode = nodeFeaturesPair[0];

      let classes = [];
      let attributes = null;
      if (nodeFeaturesPair[1] !== undefined) {
        if (nodeFeaturesPair[1].length > 0) {
          classes = nodeFeaturesPair[1][0];
        }
        if (nodeFeaturesPair[1].length > 1) {
          attributes = nodeFeaturesPair[1][1];
        }
      }

      if (attributes !== null) {
        for (const attrValPair of attributes) {
          if (
            relatedNode.hasAttribute(attrValPair[0]) &&
            relatedNode.getAttribute(attrValPair[0]) === attrValPair[1]
          ) {
            attributesAbsent = false;
            break;
          }
        }
        if (!attributesAbsent) {
          return false;
        }
      }

      for (const className of classes) {
        if (relatedNode.classList.contains(className)) {
          classesAbsent = false;
          break;
        }
      }
    }
  }

  // return attributesAbsent && classesAbsent;
  return classesAbsent;
};

const findAncestor = (node, expectedFeatures, unexpectedFeatures = null) => {
  let ancestor = node;

  while (
    ancestor !== null &&
    !(has(ancestor, expectedFeatures) && lacks(ancestor, unexpectedFeatures))
  ) {
    if (ancestor.constructor.name === 'HTMLBodyElement') {
      return null;
    }
    // console.log(`ancestor:`);
    // console.log(ancestor);
    // console.log(`ancestor.parentNode:`);
    // console.log(ancestor.parentNode);
    // console.log(
    //   `has(ancestor, expectedFeatures) = ${has(ancestor, expectedFeatures)}`
    // );
    // console.log(
    //   `lacks(ancestor, unexpectedFeatures) = ${lacks(
    //     ancestor,
    //     unexpectedFeatures
    //   )}`
    // );
    ancestor = ancestor.parentNode;
  }

  // console.log(`returning ancestor, which is:`);
  // console.log(ancestor);

  return ancestor;
};

export { isInAll, findAncestor /*, has, lacks */ };
