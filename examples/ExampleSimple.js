import React, { Component } from 'react';
import SimplePlayground from './SimplePlayground';

const CODE = `// Textarea input
console.log('Hello', 'World');

for (let i = 0; i !== 5; ++i) {
  console.log(\`hello-\${i}\`);
}

console.log(\`Scoped var: \${scopedExampleVar}\`);
`;

// not for performance here, but just to show how `busy` prop works
const DEBOUNCE_WAIT = 500;

// to support hmr make it as component
export default class App extends Component {
  state = {code: CODE, debounce: true}

  onChange = ({target: {value}}) => this.setState({code: value});

  onDebounce = ({target: {checked}}) => this.setState({debounce: checked});

  render() {
    return (
      <div style={{padding: 5}}>
        <h3>Simple example</h3>
        <p>
          console.log output is added to code,
          all playground operations could be debounced with some
          wait, now it equals to {this.state.debounce ? DEBOUNCE_WAIT : 0} (look at busy spinner
          when you type if wait is not 0)
        </p>
        <label>
          <input type="checkbox" checked={this.state.debounce} onChange={this.onDebounce} />
          &nbsp;Toggle debounce wait
        </label>
        <textarea
          style={{width: '100%', height: 150, marginTop: 10, outline: 'none'}}
          value={this.state.code}
          onChange={this.onChange}
        />
        <SimplePlayground
          debounceTime={this.state.debounce ? DEBOUNCE_WAIT : 0}
          scope={{scopedExampleVar: 'I\'m scoped var'}}
          code={this.state.code}
        />
      </div>
    );
  }
}
