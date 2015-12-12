import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapPropsOnChange from 'recompose/mapPropsOnChange';

import PlaygroundComponent from './PlaygroundComponent';

const textareaExample = ({code, onCodeChange}) => (
  <div>
    <PlaygroundComponent code={code} />
    <textarea value={code} onChange={onCodeChange} />
  </div>
);

export default compose(
  withState(
    'code',
    'setCode',
    `
    const MyComponent = ({title}) => <div>{title}</div>;
    console.log('HELLO WORLD');
    ReactDOM.render(
      <MyComponent
        title="jopa"
      />,
      mountNode
    );
    `
  ),
  mapPropsOnChange(
    ['setCode'],
    ({...props, setCode}) => ({
      ...props,
      onCodeChange(e) {
        setCode(e.target.value);
      },
    })
  )
)(textareaExample);
