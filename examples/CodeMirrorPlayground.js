import React from 'react';
import cx from 'classnames';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withState from 'recompose/withState';
import playground from 'react-babel-playground';
import codemirrorStyles from './CodeMirrorPlayground.sass';
import CodeMirror from './CodeMirror';

const codemirrorPlayground = ({
  styles, // css modules styles
  code, onCodeChange, // withState props
  component, error, busy, log, // playground HOC props
}) => (
  <div className={styles.main}>
    <div className={styles.item}>
      <h3>Code</h3>
      <div className={cx({[styles.busy]: true, [styles.visible]: busy})}></div>
      <CodeMirror
        className={styles.textarea}
        value={code}
        log={log}
        error={error}
        onChange={onCodeChange}
      />
    </div>
    <div className={styles.item}>
      <h3>Component</h3>
      <div className={cx({[styles.busy]: true, [styles.visible]: busy})}></div>
      <div className={styles.component}>
        {
          error
            ? <pre>{[error.type, error.message, error.nativeError.stack].join('\n')}</pre>
            : <div>{component}</div>
        }
      </div>
    </div>
  </div>
);

// can be overwritten at component props level <MyPlayground debounceTime={debTime} />
const DEFAULT_DEBOUNCE_TIME = 500;

export default compose(
  defaultProps({
    styles: codemirrorStyles,
  }),
  withState('code', 'onCodeChange', ({code}) => code || ''),
  // 500 default debounce time, could be overwritten
  playground(DEFAULT_DEBOUNCE_TIME)
)(codemirrorPlayground);
