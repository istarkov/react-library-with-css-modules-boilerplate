/* @flow */

import debounce from 'lodash/function/debounce';

// why flow, just to play
type CallFn = {(obj: any): void, cancel: () => void};
type CallFnBuffered = (buffer: Array<any>) => void;
type DebounceBuffer = (fn: CallFnBuffered, wait: number, options: any) => CallFn;

// work as debounce but buffers internal args
const debounceBuffer: DebounceBuffer = (fn, wait, options) => {
  let argsBuffer_ = [];

  const callDone_ = debounce(() => {
    fn(argsBuffer_);
    argsBuffer_ = [];
  }, wait, options);

  const fnCallWrapper = (...args) => {
    if (args.length > 1) {
      // simpler to parse
      argsBuffer_.push(args);
    } else {
      argsBuffer_.push(...args);
    }
    callDone_();
  };

  fnCallWrapper.cancel = () => {
    argsBuffer_ = [];
    callDone_.cancel();
  };

  return fnCallWrapper;
};

export default debounceBuffer;
