import React, { Component } from 'react';
import TextareaPlayground from './TextareaPlayground';

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

console.log('hello');

<MyComponent title="Wow">
  It works!
</MyComponent>`;

// to support hmr make it as component
export default class App extends Component {
  render() {
    return (
      <TextareaPlayground
        // debounceTime={0}
        // scope={{x: 2}}
        code={CODE}
      />
    );
  }
}
