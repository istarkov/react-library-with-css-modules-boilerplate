import webpack from 'webpack';
import createDevMiddleware from './createDevMiddleware';
import createHotMiddleware from './createHotMiddleware';
import waitWithCondition from './utils/waitWithCondition';
import compose from 'koa-compose';
import chokidar from 'chokidar';

export default ({
  serverPath, // = './server',
  reloadOnServerChange = true,
  webPackConfig,
} = {}) => {

  if (!webPackConfig.entry.some((e) => e.indexOf('webpack-hot-middleware/client') > -1 )) {
    throw new Error('webpack config must have \'webpack-hot-middleware/client\' entry');
  }

  let bundle_ = null;
  let stats_ = null;

  const compiler = webpack(webPackConfig);

  compiler.plugin('done', (stats) => {
    // clear to make possible use of client libs on server
    Object.keys(require.cache).forEach((id) => {
      if (id.indexOf('node_modules') === -1) {
        delete require.cache[id];
      }
    });

    stats_ = stats.toJson();
    const {assetsByChunkName} = stats_;
    console.log('assetsByChunkName', assetsByChunkName);
    bundle_ = webPackConfig.output.publicPath +
      (typeof assetsByChunkName.main === 'string'
        ? assetsByChunkName.main
        : assetsByChunkName.main[0]);

    // console.log(Object.keys(require.cache));
  });

  const devMiddleware = createDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webPackConfig.output.publicPath,
  });

  const hotMiddleware = createHotMiddleware(compiler);

  // wait build to be completed
  const koaSetBundleName = async (ctx, next) => {
    await waitWithCondition(30000, 'koaSetBundleName timeout expired', () => bundle_ !== null);
    ctx.hot = {bundle: bundle_, stats: stats_, webPackConfig};
    await next();
  };

  if (serverPath) {
    chokidar
      .watch(serverPath, {ignoreInitial: true})
      .on('all', ( /* event, path */) => {
        Object.keys(require.cache).forEach((id) => {
          if (id.indexOf('node_modules') === -1) {
            delete require.cache[id];
          }
        });
        hotMiddleware.publish({reload: reloadOnServerChange});
      });
  }

  return compose([
    devMiddleware,
    hotMiddleware,
    koaSetBundleName,
  ]);
};
