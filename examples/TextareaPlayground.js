import React from 'react';
import cx from 'classnames';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withState from 'recompose/withState';
import mapPropsOnChange from 'recompose/mapPropsOnChange';

import playground from 'react-babel-playground';
import textareaStyles from './TextareaPlayground.sass';
import combineCodeAndLog from './utils/combineCodeAndLog';
import Highlight from './Highlight';

const textareaPlayground = ({
  styles, // css modules styles
  code, onCodeChange, // withState props
  component, error, busy, log, // playground HOC props
}) => (
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
    <div className={styles.item}>
      <h3>Code with console.log output</h3>
      <div className={cx({[styles.busy]: true, [styles.visible]: busy})}></div>
      <Highlight styles={styles}>
        {combineCodeAndLog(code, log)}
      </Highlight>
    </div>
  </div>
);

// can be overwritten at component props level <MyPlayground debounceTime={debTime} />
const DEFAULT_DEBOUNCE_TIME = 500;

export default compose(
  defaultProps({
    styles: textareaStyles,
  }),
  withState('code', 'setCode', ({code}) => code || ''),
  mapPropsOnChange(
    ['setCode'],
    ({setCode}) => ({
      onCodeChange: (e) => setCode(e.target.value),
    })
  ),
  // 500 default debounce time, could be overwritten
  playground(DEFAULT_DEBOUNCE_TIME)
)(textareaPlayground);
