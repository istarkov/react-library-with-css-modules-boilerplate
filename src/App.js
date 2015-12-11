import React, { Component } from 'react';
import Func from './func';

export default class App extends Component {
  tmp_ = 102;

  render() {
    return (
      <div>
      koko
      {this.tmp_}
      <Func />
      </div>
    );
  }
}
