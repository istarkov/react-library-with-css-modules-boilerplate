/*
converts this
`ReactDOM.render( <MyComponent />, mountNode);`
into this
`return <MyComponent />;`
*/

export default ({types: t}) => {
  return {
    visitor: {
      ExpressionStatement: (path) => {
        if (path.get('expression').get('callee').matchesPattern('ReactDOM.render')) {
          path.replaceWith(t.returnStatement(path.get('expression').node.arguments[0]));
        }
      },
    },
  };
};
