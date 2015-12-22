/* @flow */
import type {Playground} from './types';

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
import compile from './compile';
import PlaygroundRenderer from './PlaygroundRenderer';
import debounceBuffer from './utils/debounceBuffer';

const playground: Playground = (argDebounceTime = 500, argScope = {}) => compose(
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
  }),
  mapPropsOnChange(
    ['scope'],
    ({scope, baseScope}) => ({
      scope: {...baseScope, ...argScope, ...scope},
    })
  ),
  withState(
    'runtimeError',
    'setRuntimeError',
    undefined,
  ),
  withState(
    'log',
    'setLog',
    [],
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
        setRuntimeError(error);
      },
      setBusy: debounce(
        (val) => {
          const {setBusy} = getProps();
          setBusy(val);
        },
        2 * 1000 / 60, // two frame
        {trailing: true}
      ),
      onLog: debounceBuffer(
        (log) => getProps().setLog((prev) => [...prev, ...log]),
        0,
        {trailing: true}
      ),
    })
  ),
  withState(
    'compiled',
    'setCompiled',
    ({code, scope, onLog}) => compile({code, scope: {...scope, __log__: onLog}})
  ),
  mapPropsOnChange(
    ['debounceTime'],
    ({setCompiled, onLog, setLog, setBusy, debounceTime, setRuntimeError}) => ({
      compileDebounced: debounce(
        ({code, scope}) => {
          setBusy(false);
          onLog.cancel();
          unstable_batchedUpdates(() => {
            setLog([]);
            setCompiled(compile({code, scope: {...scope, __log__: onLog}}));
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
    ({compileDebounced, code, scope, setBusy}) => {
      setBusy(true);
      compileDebounced({code, scope});
    }
  ),
  lifecycle(
    () => {},
    ({props: {compileDebounced, setBusy, onLog}}) => {
      compileDebounced.cancel();
      setBusy.cancel();
      onLog.cancel();
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
