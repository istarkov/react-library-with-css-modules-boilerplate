import React, { Component } from 'react';
import TextareaExample from './TextareaExample.js';

const CODE = `// example
const MyComponent = ({title}) => <div>{title}</div>;
console.log('hello');
<MyComponent title="world" />;
`;


export default class App extends Component {
  render() {
    return (
      <div style={{padding: 10}}>
        <TextareaExample debounceTime={0} code={CODE}/>
      </div>
    );
  }
}
