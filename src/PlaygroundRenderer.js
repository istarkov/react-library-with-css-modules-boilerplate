
// mainly copypasted from
// https://github.com/facebook/relay/blob/master/website-prototyping-tools/RelayPlayground.js
// ReactDOM.render needed to intercept runtime errors.
// Also without it, after some errors, internal react state could be broken
// without ability to restore normal work

import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import defer from 'lodash/function/defer';

class PlaygroundRenderer extends Component {
  static propTypes = {
    children: PropTypes.any,
    onError: PropTypes.func,
  }

  componentDidMount() {
    this.container_ = document.createElement('div');
    this.ref_.appendChild(this.container_);
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

  _update = () => {
    try {
      if (this.props.children) {
        ReactDOM.render(React.Children.only(this.props.children), this.container_);
      }
    } catch (e) {
      if (this.props.onError) {
        this.props.onError(e);
      }
    }
  }

  _setRef = (ref) => {
    this.ref_ = ref;
  }

  render() {
    return <div ref={this._setRef} />;
  }
}

export default PlaygroundRenderer;
