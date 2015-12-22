/* @flow */
// mainly copypasted from
// https://github.com/facebook/relay/blob/master/website-prototyping-tools/RelayPlayground.js
// ReactDOM.render needed to intercept runtime errors.
// Also without it, after some errors, internal react state could be broken
// without ability to restore normal work
import type { PlaygroundError } from './types';

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import defer from 'lodash/function/defer';

class PlaygroundRenderer extends Component {
  static propTypes = {
    children: PropTypes.any,
    onError: PropTypes.func,
  };

  componentDidMount() {
    this.container_ = document.createElement('div');
    if (this.ref_ !== null) {
      this.ref_.appendChild(this.container_);
    }
    this.updateTimeoutId_ = defer(this._update);
  }

  componentDidUpdate() {
    clearTimeout(this.updateTimeoutId_);
    this.updateTimeoutId_ = defer(this._update);
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimeoutId_);
    try {
      ReactDOM.unmountComponentAtNode(this.container_);
    } catch (e) {} // eslint-disable-line
  }

  ref_: any = null;

  _update: () => void = () => {
    try {
      if (this.props.children) {
        ReactDOM.render(React.Children.only(this.props.children), this.container_);
      }
    } catch (e) {
      if (this.props.onError) {
        const re = /:\d+:\d+/;
        const [str] = e.stack.match(re) || [];
        const [, line] = str ? str.split(':').map((v) => +v) : [];

        const err: PlaygroundError = {
          line: line - 2,
          nativeError: e,
          message: e.message,
          type: 'runtime',
        };

        this.props.onError(err);
      }
    }
  };

  _setRef: (ref: any) => void = (ref) => {
    this.ref_ = ref;
  };

  render(): ReactElement<any, any, any> {
    return (
      <div ref={this._setRef} />
    );
  }
}

export default PlaygroundRenderer;
