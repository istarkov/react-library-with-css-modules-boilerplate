export default ({types: t}) => {
  return {
    visitor: {
      CallExpression: (path) => {
        if (path.get('callee').matchesPattern('console.log')) {
          path.replaceWith(
            t.callExpression(
              t.identifier('__log__'),
              [
                t.objectExpression([
                  t.objectProperty(t.identifier('start'), t.numericLiteral(path.node.start)),
                  t.objectProperty(t.identifier('end'), t.numericLiteral(path.node.end)),
                ]),
              ].concat(path.node.arguments)
            )
          );
        }
      },
    },
  };
};
