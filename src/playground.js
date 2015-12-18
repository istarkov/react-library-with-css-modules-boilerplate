import React, { PropTypes } from 'react';
import { unstable_batchedUpdates } from 'react-dom'; // eslint-disable-line
import defaultProps from 'recompose/defaultProps';
import compose from 'recompose/compose';
import lifecycle from 'recompose/lifecycle';
import mapPropsOnChange from 'recompose/mapPropsOnChange';
import mapProps from 'recompose/mapProps';
import setPropTypes from 'recompose/setPropTypes';
import withAttachedProps from 'recompose/withAttachedProps';
import withState from 'recompose/withState';
import doOnPropsChange from './recompose/doOnPropsChange';
import debounce from 'lodash/function/debounce';
import babelCompile from './babelCompile';
import PlaygroundRenderer from './PlaygroundRenderer';

const playground = (argDebounceTime = 500, argScope = {}) => compose(
  setPropTypes({
    code: PropTypes.string.isRequired,
  }),
  // save original component props
  mapProps((props) => ({
    code: props.code,
    scope: props.scope,
    debounceTime: props.debounceTime,
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
    ({setCompiled, setBusy, debounceTime, setRuntimeError}) => ({
      compile: debounce(
        ({code, scope}) => {
          setBusy(false);
          unstable_batchedUpdates(() => {
            setCompiled(babelCompile({code, scope}));
            setRuntimeError(undefined);
          });
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
    ['component', 'error'],
    ({...props, component, error, onError}) => ({
      ...props,
      component: error
       ? undefined
       : <PlaygroundRenderer onError={onError}>{component}</PlaygroundRenderer>,
    })
  ),
  doOnPropsChange(
    ['code', 'scope'],
    ({compile, code, scope, setBusy}) => {
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
  // restore original component props
  mapProps(({saveProps, component, error, busy, log}) => ({
    ...saveProps,
    component,
    error,
    busy,
    log,
  }))
);

export default playground;
