import React from 'react';
import defaultProps from 'recompose/defaultProps';
import compose from 'recompose/compose';

const app = ({hello}) => (
  <div>
    Hi opopko "{hello}"
  </div>
);

export default compose(
  defaultProps({
    hello: 'opworld',
  })
)(app);
