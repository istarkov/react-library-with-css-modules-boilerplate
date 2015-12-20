import 'babel-polyfill';
import 'normalize.css';
import React from 'react';
import { render } from 'react-dom';
import ExampleTextarea from './ExampleTextarea';

import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

const history = createBrowserHistory();

render(
  <Router history={history}>
    <Route path="/" component={ExampleTextarea} />
    <Route path="/test" component={ExampleTextarea} />
  </Router>,
  document.getElementById('root')
);
