import React, { Component } from 'react';
import CodeMirrorPlayground from './CodeMirrorPlayground';

const CODE = `const MyComponent = ({title, children}) => (
  console.log(\`Title is \${title}\`),
  <div>
    <h1>
      {title}
    </h1>
    <p>
      {children}
    </p>
  </div>
);

for(let i = 0; i !== 3; ++i) {
  console.log('hello', i);
}

// setTimeout(() => console.log('delayed log'), 1000); // uncomment me

<MyComponent title="Wow">
  It works!
</MyComponent>`;

// to support hmr make it as component
export default class App extends Component {
  render() {
    return (
      <CodeMirrorPlayground
        // debounceTime={0}
        // scope={{x: 2}}
        code={CODE}
      />
    );
  }
}
