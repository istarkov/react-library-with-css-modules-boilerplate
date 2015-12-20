import { Component } from 'react';
import pick from 'lodash/object/pick';
import shallowEqual from 'recompose/shallowEqual';
import createHelper from 'recompose/createHelper';
import createElement from 'recompose/createElement';

const doOnPropsChange = (depdendentPropKeys, callback, BaseComponent) => {
  const pickDependentProps = props => pick(props, depdendentPropKeys);

  return class extends Component {
    componentWillReceiveProps(nextProps) {
      if (!shallowEqual(
        pickDependentProps(this.props),
        pickDependentProps(nextProps)
      )) {
        callback(nextProps);
      }
    }

    render() {
      return createElement(BaseComponent, this.props);
    }
  };
};

export default createHelper(doOnPropsChange, 'doOnPropsChange');
