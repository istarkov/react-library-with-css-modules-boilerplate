import React from 'react';
import cx from 'classnames';
import playground from 'react-babel-playground';
import Highlight from './Highlight';
import combineCodeAndLog from './utils/combineCodeAndLog';
import styles from './SimplePlayground.sass';

// This playground just combines log and code
const simplePlayground = ({
  code,
  error, log, busy, // playground HOC props
  /* component, */ // not used in this
}) => (
  <div className={styles.main}>
    <div className={styles.item}>
      <h5>
        Code output:
        <div className={cx({[styles.busy]: true, [styles.visible]: busy})} />
      </h5>
      {
        error
        ? <pre>{[error.type, error.message, '', error.error.stack].join('\n')}</pre>
        : <Highlight>{combineCodeAndLog(code, log)}</Highlight>
      }
    </div>
  </div>
);

export default playground()(simplePlayground);
