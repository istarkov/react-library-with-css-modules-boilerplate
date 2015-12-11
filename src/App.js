import React, { Component } from 'react';
import Func from './func';

export default class App extends Component {
  tmp_ = 101;

  render() {
    return (
      <div>
      {this.tmp_}
      <Func />
      </div>
    );
  }
}
