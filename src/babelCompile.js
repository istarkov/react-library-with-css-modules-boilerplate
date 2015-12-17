import { transform } from 'babel-core';
import babelPresetEs2015 from 'babel-preset-es2015';
import babelPresetReact from 'babel-preset-react';
import babelPresetStage0 from 'babel-preset-stage-0';
import babelLogPlugin from './babelLogPlugin';
import babelReactDOMPlugin from './babelReactDOMPlugin';
import sortedIndex from 'lodash/array/sortedIndex';

const babelCompile = ({code, scope}) => { // eslint-disable-line
  const log = [];
  const localScope = {
    ...scope,
    __log__: (...args) => (log.push(args)),
  };

  const codeStr = `({${Object.keys(localScope).join(', ')}}) => {\n${code}\n}`;

  try {
    const codeE = transform(
      codeStr,
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

    const {lines} = codeStr
      .split('\n')
      .reduce(
        (r, line) => {
          const lastSymNum = r.pos + line.length + 1;
          r.lines.push(lastSymNum);
          r.pos = lastSymNum;
          return r;
        },
        {pos: 0, lines: []}
      );

    const lineLogNumbers = log
      .map(([{end}, ...args]) => ({
        line: sortedIndex(lines, end) - 1,
        args,
      }));

    console.log('lineLogNumbers', lineLogNumbers);

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
