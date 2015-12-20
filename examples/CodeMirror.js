import React, { PropTypes, Component } from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import './assets/neoice.css';

const CODE_EDITOR_OPTIONS = {
  extraKeys: {
    Tab: (cm) => cm.replaceSelection(Array(cm.getOption('indentUnit') + 1).join(' ')),
  },
  indentWithTabs: false,
  lineNumbers: true,
  mode: 'javascript',
  tabSize: 2,
  theme: 'neoice',
};

class CodeMirror extends Component {
  static propTypes = {
    options: PropTypes.any,
    onChange: PropTypes.func,
    value: PropTypes.string,
  };

  componentDidMount() {
    const {
      props: {
        options,
        value,
      },
      textareaRef_,
      _onChange,
    } = this;

    this.codemirror_ = codemirror.fromTextArea(textareaRef_, options);
    this.codemirror_.on('change', _onChange);
    this.codemirror_.setValue(value);
  }

  _onChange = (doc) => {
    const { onChange } = this.props;
    onChange(doc.getValue());
  }

  _setRef = (ref) => {
    this.textareaRef_ = ref;
  }

  textareaRef_ = null;
  codemirror_ = null;

  render() {
    const {
      _setRef,
    } = this;

    return (
      <div>
        <textarea ref={_setRef} autoComplete={'off'} />
      </div>
    );
  }
// options = { mode: 'javascript' }
}

export default compose(
  defaultProps({
    options: CODE_EDITOR_OPTIONS,
  })
)(CodeMirror);
