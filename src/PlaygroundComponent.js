import React from 'react';
import defaultProps from 'recompose/defaultProps';
import compose from 'recompose/compose';
import mapPropsOnChange from 'recompose/mapPropsOnChange';
import doOnPropsChange from './recompose/doOnPropsChange';

import withState from 'recompose/withState';
import debounce from 'lodash/function/debounce';
import babelCompile from './babelCompile';

export const playgroundComponent = ({compiled}) => (
  <div>
    {compiled.component}
  </div>
);

export const playgroundComponentHOC = compose(
  defaultProps({
    code: '',
    debounceTime: 0,
    baseScope: {
      React,
    },
    scope: {},
  }),
  mapPropsOnChange(
    ['scope'],
    ({scope, baseScope}) => ({
      scope: {...baseScope, ...scope},
    })
  ),
  withState(
    'compiled',
    'setCompiled',
    ({code, scope}) => babelCompile({code, scope})
  ),
  mapPropsOnChange(
    [],
    ({setCompiled, debounceTime}) => ({
      compile: debounce(
        ({code, scope}) => setCompiled(babelCompile({code, scope})),
        debounceTime,
        {trailing: true}
      ),
      uidGen: (() => {
        let uid_ = 0;
        return () => uid_++;
      })(),
    })
  ),
  mapPropsOnChange(
    ['compiled'],
    ({...props, uidGen}) => ({
      ...props,
      uid: uidGen(),
    })
  ),
  doOnPropsChange(
    ['code', 'scope'],
    ({compile, code, scope}) => compile({code, scope})
  )
);

export default playgroundComponentHOC(playgroundComponent);
