import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapPropsOnChange from 'recompose/mapPropsOnChange';

import playground from 'react-babel-playground';
import styles from './TextareaExample.sass';

const textareaExample = ({code, onCodeChange, component, error, busy}) => (
  <div className={styles.main}>
    <div className={styles.item}>
      <h5>Textarea</h5>
      <textarea className={styles.textarea} value={code} onChange={onCodeChange} />
    </div>
    <div className={styles.item}>
      <h5>Component {busy ? 'busy' : 'done'}</h5>
      <div>
        {
          error
            ? <pre>{[error.type, error.message, error.error.stack].join('\n')}</pre>
            : component
        }
      </div>
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
      onCodeChange: (e) => setCode(e.target.value),
    })
  ),
  playground(500)
)(textareaExample);
