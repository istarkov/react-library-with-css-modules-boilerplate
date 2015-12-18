import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapPropsOnChange from 'recompose/mapPropsOnChange';

import playground from 'react-babel-playground';
import styles from './TextareaExample.sass';

const textareaExample = ({code, onCodeChange, component, error, busy, log}) => (
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
            ? <pre>
              {
                [
                  error.type,
                  error.message,
                  (error.error.stack || '').split('\n')[1],
                ].join('\n')
              }
            </pre>
            : component
        }
      </div>
    </div>
    <div className={styles.item}>
      <h5>Log</h5>
      <pre>
        {JSON.stringify(log)}
      </pre>
    </div>
  </div>
);

export default compose(
  withState('code', 'setCode', ({code}) => code || ''),
  mapPropsOnChange(
    ['setCode'],
    ({setCode}) => ({
      onCodeChange: (e) => setCode(e.target.value),
    })
  ),
  // 500 default debounce time, could be overwritten
  playground(500)
)(textareaExample);
