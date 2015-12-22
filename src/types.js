/* @flow */

type LineLog = {line: number, args: Array<any>};
export type Scope = {__log__: (l: LineLog) => void};

export type PlaygroundError = {message: string; line?: number; nativeError: any; type: string};
export type CompiledResult = {component: ReactElement} | {error: PlaygroundError};

type FunctionalComponent = (props?: any) => ReactElement<any, any, any>;

export type Playground = (debounceWait?: number, scope?: any) =>
    ((arg: ReactComponent | FunctionalComponent) => ReactComponent | FunctionalComponent);
