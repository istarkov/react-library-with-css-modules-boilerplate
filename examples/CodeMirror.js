import React, { PropTypes, Component } from 'react';
import debounce from 'lodash/function/debounce';
import groupBy from 'lodash/collection/groupBy';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';
import './assets/neoice.css';

const CODE_EDITOR_OPTIONS = { // thank you relay playground
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
    log: PropTypes.any,
  };

  componentDidMount() {
    const {
      props: {
        options,
        value,
        log,
      },
      textareaRef_,
      _onChange,
    } = this;

    this.codemirror_ = codemirror.fromTextArea(textareaRef_, options);
    this.codemirror_.on('change', _onChange);
    this.codemirror_.setValue(value);
    this.value_ = value;
    this._updateLog(log);
  }

  componentWillReceiveProps(nextProps) {
    if (this.value_ !== nextProps.value) {
      this.codemirror_.setValue(nextProps.value);
    }

    if (this.props.log !== nextProps.log) {
      this._updateLogDebounced(nextProps.log);
    }
  }

  _updateLog = (log) => {
    this.codemirror_.operation(() => {

      this.lineWidgets_.forEach((w) => this.codemirror_.removeLineWidget(w));
      this.lineWidgets_.length = 0;

      const groupedLog = groupBy(log, 'line');

      const codeLines = this.value_.split('\n');

      Object.keys(groupedLog)
        .map((key) => [+key, groupedLog[key]])
        .map(([line, lineLog]) =>
          [
            line,
            '// ' +
            lineLog.map((l) => l.args.map((arg) => JSON.stringify(arg)).join(', ')).join('; '),
          ]
        )
        .forEach(([line, comment]) => {
          const msg = document.createElement('div');
          msg.className = 'cm-s-neoice cm-comment cm-pre-wrap';
          const pre = document.createElement('pre');
          const codeLine = codeLines[line];
          const paddingLength = codeLine.length - codeLine.replace(/^\s+/, '').length;

          pre.appendChild(document.createTextNode(codeLine.substr(0, paddingLength)));
          pre.style.display = 'inline';
          msg.appendChild(pre);
          msg.appendChild(document.createTextNode(comment));
          this.lineWidgets_.push(
            this.codemirror_
              .addLineWidget(line, msg, {coverGutter: false, noHScroll: false})
          );
        });
    });
  }

  _updateLogDebounced = debounce(
    (log) => this._updateLog(log),
    2 * 1000 / 60,
    {trailing: true}
  )

  _onChange = (doc) => {
    const { onChange } = this.props;
    this.value_ = doc.getValue();
    onChange(this.value_);
  }

  _setRef = (ref) => {
    this.textareaRef_ = ref;
  }

  textareaRef_ = null;
  codemirror_ = null;
  value_ = null;
  lineWidgets_ = [];

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
}

export default compose(
  defaultProps({
    options: CODE_EDITOR_OPTIONS,
    value: '',
    onChange: () => {},
  })
)(CodeMirror);
