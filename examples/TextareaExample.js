import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapPropsOnChange from 'recompose/mapPropsOnChange';

import playground from 'react-babel-playground';
import styles from './TextareaExample.sass';
import combineCodeAndLog from './utils/combineCodeAndLog';
// import 'highlight.js/styles/idea.css';
// import hljs from 'highlight.js';
import Highlight from './Highlight';

const textareaExample = ({code, onCodeChange, component, error, busy, log}) => (
  <div className={styles.main}>
    <div className={styles.item}>
      <h3>Textarea</h3>
      <textarea
        className={styles.textarea}
        value={code}
        onChange={onCodeChange}
      />
    </div>
    <div className={styles.item}>
      <h3>Component {busy ? 'busy' : 'done'}</h3>
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
      <h3>Code with console.log output</h3>
      <Highlight>
        {combineCodeAndLog(code, log)}
      </Highlight>
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
