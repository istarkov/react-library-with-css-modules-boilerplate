
export default (code, log) => code.split('\n')
  .map((line, index) => [line, log.filter((l) => l.line === index)])
  .map(([line, lineLog]) => lineLog.length > 0
    ? line +
      ' // ' +
      lineLog.map((l) => l.args.map((arg) => JSON.stringify(arg)).join(', ')).join('; ')
    : line
  )
  .join('\n');
