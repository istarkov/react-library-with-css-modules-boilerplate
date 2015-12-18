import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapPropsOnChange from 'recompose/mapPropsOnChange';

import PlaygroundComponent from '../src/PlaygroundComponent';
import styles from './TextareaExample.sass';

const textareaExample = ({code, onCodeChange}) => (
  <div className={styles.main}>
    <div className={styles.item}>
      <h5>Textarea</h5>
      <textarea className={styles.textarea} value={code} onChange={onCodeChange} />
    </div>
    <div className={styles.item}>
      <h5>Component {code.indexOf('HELLO')}</h5>
      { code.indexOf('HELLO') > 0
      ? <PlaygroundComponent code={code} />
      : null
      }
    </div>
  </div>
);

const CODE = `
const MyComponent = ({title}) => <div>{title}</div>;
console.log('HELLO WORLD');
<MyComponent title="jopa" />;
`;

export default compose(
  withState('code', 'setCode', CODE),
  mapPropsOnChange(
    ['setCode'],
    ({setCode}) => ({
      onCodeChange(e) {
        setCode(e.target.value);
      },
    })
  )
)(textareaExample);

/*
const CODE = `
const MyComponent = ({title}) => <div>{title}</div>;
console.log('HELLO WORLD');
ReactDOM.render(
  <MyComponent
    title="jopa"
  />,
  mountNode
);
`;
*/
