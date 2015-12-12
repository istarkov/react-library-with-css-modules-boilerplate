import { transform } from 'babel-core';
import babelPresetEs2015 from 'babel-preset-es2015';
import babelPresetReact from 'babel-preset-react';
import babelPresetStage0 from 'babel-preset-stage-0';
import babelLogPlugin from './babelLogPlugin';
import babelReactDOMPlugin from './babelReactDOMPlugin';

const babelCompile = ({code, scope}) => { // eslint-disable-line
  const log = [];
  const localScope = {
    ...scope,
    __log__: (...args) => console.log('local__log__', ...args),
  };

  try {
    const codeE = transform(
      `
      ({${Object.keys(localScope).join(', ')}}) => {
        ${code}
      }
      `,
      {
        presets: [
          babelPresetReact,
          babelPresetEs2015,
          babelPresetStage0,
        ],
        plugins: [
          babelLogPlugin,
          babelReactDOMPlugin,
        ],
      }
    ).code;

    const component = eval(codeE)(localScope);  // eslint-disable-line

    return {
      component,
      log,
    };
  } catch (error) {
    return {
      error,
      log,
    };
  }
};

export default babelCompile;
