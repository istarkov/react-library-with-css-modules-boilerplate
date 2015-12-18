/*
converts last jsx occurence
`<MyComponent />`
into this
`return <MyComponent />;`
*/

export default ({types: t}) => {
  return {
    visitor: {
      ExpressionStatement: (path) => {
        if (path.isCompletionRecord(true)) {
          if (path.get('expression').type === 'JSXElement') {
            path.replaceWith(t.returnStatement(path.get('expression').node));
          }
        }
      },
    },
  };
};
