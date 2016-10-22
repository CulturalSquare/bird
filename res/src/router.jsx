import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';

import MainComponent from './common/main.jsx';

import Choose from './choose.jsx';
import Game from './game.jsx';

ReactDOM.render((
  <Router history={hashHistory}>
    <Route path="/" component={MainComponent}>
      <Route path="/choose" component={Choose} />
      <Route path="/game/:img" component={Game} />
    </Route>
  </Router>),
  document.querySelector('#wrapper')
);