import React from 'react';
import defaultProps from 'recompose/defaultProps';
import compose from 'recompose/compose';
import withAttachedProps from 'recompose/withAttachedProps';
import mapPropsOnChange from 'recompose/mapPropsOnChange';
import mapProps from 'recompose/mapProps';
import doOnPropsChange from './recompose/doOnPropsChange';
import lifecycle from 'recompose/lifecycle';

import withState from 'recompose/withState';
import debounce from 'lodash/function/debounce';
import babelCompile from './babelCompile';
import PlaygroundRenderer from './PlaygroundRenderer';

/*
export const playgroundComponent = ({component, error, busy}) => (
  <div>
    <div>{busy ? 'busy' : 'done'}</div>
    <div>
    {
      error
        ? <pre>{[error.type, error.message, error.error.stack].join('\n')}</pre>
        : component
    }
    </div>
  </div>
);
*/

// TODO MOVE debounceTime and scope to HOC fn
const playground = (argDebounceTime = 500, argScope = {}) => compose(
  mapProps((props) => ({
    code: props.code,
    saveProps: props,
  })),
  defaultProps({
    debounceTime: argDebounceTime,
    baseScope: {
      React,
    },
    scope: argScope,
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
  withState(
    'runtimeError',
    'setRuntimeError',
    undefined,
  ),
  withState(
    'busy',
    'setBusy',
    false,
  ),
  withAttachedProps(
    (getProps) => ({
      onError(error) {
        const {setRuntimeError} = getProps();
        setRuntimeError({
          type: 'runtime',
          error,
          message: error.message,
        });
      },
      setBusy: debounce(
        (val) => {
          const {setBusy} = getProps();
          setBusy(val);
        },
        2 * 1000 / 60, // two frame
        {trailing: true}
      ),
    })
  ),
  mapPropsOnChange(
    [],
    ({setCompiled, setBusy, debounceTime}) => ({
      compile: debounce(
        ({code, scope}) => {
          setBusy(false);
          setCompiled(babelCompile({code, scope}));
        },
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
    ['compiled', 'runtimeError'],
    ({...props, uidGen, compiled, runtimeError}) => ({
      ...props,
      uid: uidGen(),
      error: runtimeError,
      ...compiled,
    })
  ),
  mapPropsOnChange(
    ['component'],
    ({component, error, onError}) => ({
      component: error
       ? undefined
       : <PlaygroundRenderer onError={onError}>{component}</PlaygroundRenderer>,
    })
  ),
  doOnPropsChange(
    ['code', 'scope'],
    ({compile, code, scope, setRuntimeError, setBusy}) => {
      setRuntimeError(undefined);
      setBusy(true);
      compile({code, scope});
    }
  ),
  lifecycle(
    () => {},
    ({props: {compile, setBusy}}) => {
      compile.cancel();
      setBusy.cancel();
    }
  ),
  mapProps(({saveProps, component, error, busy}) => ({
    ...saveProps,
    component,
    error,
    busy,
  }))
);

export default playground;

// export default playgroundComponentHOC(playgroundComponent);
