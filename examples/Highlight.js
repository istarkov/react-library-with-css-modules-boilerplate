import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import defaultProps from 'recompose/defaultProps';
import withAttachedProps from 'recompose/withAttachedProps';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import doOnPropsChange from './recompose/doOnPropsChange';
import debounce from 'lodash/function/debounce';

import hljs from 'highlight.js';
import 'highlight.js/styles/idea.css';

export const highlight = ({code}) => (
  <pre
    className={'hljs'}
    dangerouslySetInnerHTML={{
      __html: hljs.highlightAuto(
        code
      ).value,
    }}
  />
);

export default compose(
  defaultProps({
    debounceTime: 2 * 1000 / 60, // +- two frame
  }),
  withState('code', 'setCode', ({children}) => children),
  withAttachedProps((getProps) => ({
    setCode: debounce(
      (code) => getProps().setCode(code),
      getProps().debounceTime,
      {trailing: true}
    ),
  })),
  doOnPropsChange(
    ['children'],
    ({children, setCode}) => setCode(children)
  ),
  onlyUpdateForKeys(['code'])
)(highlight);
