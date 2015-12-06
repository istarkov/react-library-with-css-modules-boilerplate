/* globals Meteor */
const waitWithCondition = (timeout, str, condition) => {
  const startTime_ = (new Date()).getTime();

  return new Promise( (r, reject) => {
    function waitWithCondition_() {
      if (condition()) {
        r();
        return;
      }

      const timeDelta = (new Date()).getTime() - startTime_;

      if (timeDelta < timeout) {
        setTimeout(waitWithCondition_, 16);
      } else {
        reject(str);
        return;
      }
    }

    waitWithCondition_();
  });
};

export default waitWithCondition;
