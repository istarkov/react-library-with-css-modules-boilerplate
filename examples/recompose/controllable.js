import omit from 'lodash/object/omit';
import curry from 'lodash/function/curry';
import isFunction from 'lodash/lang/isFunction';
import isArray from 'lodash/lang/isArray';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import mapPropsOnChange from 'recompose/mapPropsOnChange';

const getPropNames = (propNamesArg) =>
  isArray(propNamesArg)  // eslint-disable-line
    ? propNamesArg
    : isFunction(propNamesArg)
      ? getPropNames(propNamesArg({}))
      : Object.keys(propNamesArg);

const capFirst = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);
export const getEventName = (propName) => propName === 'value'
  ? 'onChange'
  : `on${capFirst(propName)}Change`;

const controllable = (propNamesArg, BaseComponent) => {
  const propNames = getPropNames(propNamesArg);

  const initialState = isArray(propNamesArg) // eslint-disable-line
    ? {}
    : isFunction(propNamesArg)
      ? propNamesArg
      : {...propNamesArg};

  const stateName = `__${propNames.join('_')}__`;
  const stateUpdaterName = `__set__${stateName}`;

  const propsMapper = (propsWithStateProps) => {
    const state = propsWithStateProps[stateName];
    const setState = propsWithStateProps[stateUpdaterName];
    const propValueSetter = (propName, callback) =>
      (value) => setState(
        (prevState) => ({
          ...prevState,
          [propName]: isFunction(value)
            ? value(prevState && prevState[propName])
            : value,
        }),
        callback && (() => callback(value))
      );
    const props = omit(propsWithStateProps, [stateName, stateUpdaterName]);

    return ({
      ...props,

      ...propNames.reduce((r, propName) => ({
        ...r,
        [propName]: propName in props
          ? props[propName]
          : state[propName],
        [getEventName(propName)]: getEventName(propName) in props // eslint-disable-line
          ? propName in props
            // component is controllable
            ? props[getEventName(propName)]
            // still uncontrollable just call user defined on{propName}Change callback
            // after internal state changed
            : propValueSetter(
                propName,
                props[getEventName(propName)]
              )
          : propValueSetter(propName), // uncontrollable

      }), {}),
    });
  };

  return compose(
    withState(stateName, stateUpdaterName, initialState),
    mapPropsOnChange([stateName], propsMapper),
  )(BaseComponent);
};

export default curry(controllable);
