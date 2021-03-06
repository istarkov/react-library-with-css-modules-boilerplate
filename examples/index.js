import 'babel-polyfill';
import 'normalize.css';
import './index.sass';

import React from 'react';
import { render } from 'react-dom';
import ExampleTextarea from './ExampleTextarea';
import ExampleSimple from './ExampleSimple';
import ExampleCodemirror from './ExampleCodemirror';

import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
const history = createBrowserHistory();
import '../server/koaDevHotMiddlewares/client.js';

render(
  <Router history={history}>
    <Route path="/" component={ExampleCodemirror} />
    <Route path="/codemirror" component={ExampleCodemirror} />
    <Route path="/textarea" component={ExampleTextarea} />
    <Route path="/simple" component={ExampleSimple} />
  </Router>,
  document.getElementById('root')
);
