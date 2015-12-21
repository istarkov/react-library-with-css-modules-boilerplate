import React, { Component, PropTypes } from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapProps from 'recompose/mapProps';
import CodeMirrorPlayground from './CodeMirrorPlayground';

const CODE = `const MyComponent = ({title, children}) => (
  console.log(\`Title is '\${title}'\`),
  <div>
    <h1>
      {title}
    </h1>
    <div>
      {children}
    </div>
  </div>
);

for (let i = 0; i !== 3; ++i) {
  console.log('hello', i);
}

// Last jsx element will be shown
<MyComponent title="CodeMirror example">
  <p>It works!</p>
  <p>
    Get playground HOC at&nbsp;
    <a href="/sss">github</a>
  </p>
</MyComponent>`;

// to support hmr make it as component
class ExampleCodeMirror extends Component {
  static propTypes = {
    debounce: PropTypes.bool,
    debounceTime: PropTypes.number,
    toggleDebounce: PropTypes.func,
  }

  render() {
    const {
      debounce,
      debounceTime,
      toggleDebounce,
    } = this.props;

    return (
      <div style={{margin: 10}}>
        <p>
          console.log output is added to CodeMirror.
        </p>
        <p>
          All playground operations could be debounced with some
          wait, now it equals to {debounceTime} (look at busy spinner
          when you type if wait is not 0)
        </p>
        <p>
          <label>
            <input type="checkbox" checked={debounce} onChange={toggleDebounce} />
            &nbsp;Toggle debounce wait
          </label>
        </p>
        <CodeMirrorPlayground
          debounceTime={debounceTime}
          // scope={{x: 2}}
          code={CODE}
        />
      </div>
    );
  }
}


export default compose(
  withState('debounce', 'setDebounce', false),
  mapProps(({...props, debounce, setDebounce}) => ({
    ...props,
    toggleDebounce: () => setDebounce((v) => !v),
    debounceTime: debounce ? 500 : 0,
  })),
)(ExampleCodeMirror);
