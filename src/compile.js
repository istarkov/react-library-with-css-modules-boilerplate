/* @flow */
import type { Scope, CompiledResult } from './types';

import { transform } from 'babel-core';
import babelPresetEs2015 from 'babel-preset-es2015';
import babelPresetReact from 'babel-preset-react';
import babelPresetStage0 from 'babel-preset-stage-0';
import babelLogPlugin from './babelPlugins/consoleLogWithStartEnd';
import babelReactDOMPlugin from './babelPlugins/reactDOM2Return';
import babelLastExpression from './babelPlugins/lastExpression2Return';
import sortedIndex from 'lodash/array/sortedIndex';

const compile: (obj: {code: string; scope: Scope}) => CompiledResult = ({code, scope}) => {
  const codeStr = `({${[...Object.keys(scope)].join(', ')}}) => {\n${code}\n}`;

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

  const localScope = {
    ...scope,
    __log__: ({end}, ...args) => scope.__log__({
      line: sortedIndex(lines, end) - 1,
      args,
    }),
  };

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
          babelLastExpression,
        ],
        retainLines: true,
      }
    ).code;

    const evalCode = eval(codeE); // eslint-disable-line
    const component = evalCode(localScope);

    return {
      component,
    };
  } catch (error) {
    const re = /:\d+:\d+/;
    const [str] = error.stack.match(re) || [];
    const [, line] = str ? str.split(':').map((v) => +v) : [];

    return {
      error: {
        line: error._babel === true ? error.loc.line - 2 : line - 2,
        nativeError: error,
        message: error._babel === true ? 'Syntax Error' : error.message, // error.codeFrame
        type: error._babel === true ? 'syntax' : 'eval',
      },
    };
  }
};

export default compile;
