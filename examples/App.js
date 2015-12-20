import React, { Component } from 'react';
import TextareaExample from './TextareaExample.js';

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


export default class App extends Component {
  render() {
    return (
      <div style={{padding: 10}}>
        <TextareaExample
          // debounceTime={0}
          // scope={{x: 2}}
          code={CODE}
        />
      </div>
    );
  }
}
