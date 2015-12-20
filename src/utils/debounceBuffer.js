import debounce from 'lodash/function/debounce';

// work as debounce but buffers internal args
export default (fn, wait, options) => {
  let argsBuffer_ = [];

  const callDone_ = debounce(() => {
    fn(argsBuffer_);
    argsBuffer_ = [];
  }, wait, options);

  const fnCallWrapper = (...args) => {
    argsBuffer_.push(...args);
    callDone_();
  };

  fnCallWrapper.cancel = () => {
    argsBuffer_ = [];
    callDone_.cancel();
  };

  return fnCallWrapper;
};
