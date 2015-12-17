import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapPropsOnChange from 'recompose/mapPropsOnChange';

import PlaygroundComponent from '../src/PlaygroundComponent';
import styles from './TextareaExample.sass';

const textareaExample = ({code, onCodeChange}) => (
  <div className={styles.main}>
    <div className={styles.left}>
      <h5 className={styles.header}>Textarea</h5>
      <textarea className={styles.textarea} value={code} onChange={onCodeChange} />
    </div>
    <div className={styles.center}>
      <h5 className={styles.header}>Component</h5>
      <PlaygroundComponent code={code} />
    </div>
    <div className={styles.right}>
      <h5 className={styles.header}>Log</h5>
    sdsd
    </div>
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
