import webpack from 'webpack';
import createConfig from '../../webpack.config.dev';
import koaDevMiddleware from './koaDevMiddleware';
import koaHotMiddleware from './koaHotMiddleware';
import waitWithCondition from './utils/waitWithCondition';
import compose from 'koa-compose';

export default () => {
  let bundle_ = null;

  const config = createConfig((assetsByChunkName) => {
    // get bundle name
    bundle_ = config.output.publicPath +
      (typeof assetsByChunkName.main === 'string'
        ? assetsByChunkName.main
        : assetsByChunkName.main[0]);
  });

  const compiler = webpack(config);

  const koaSetBundleName = async (ctx, next) => {
    await waitWithCondition(30000, 'koaSetBundleName timeout expired', () => bundle_ !== null);
    ctx.hot = {bundle: bundle_};
    await next();
  };

  return compose([
    koaDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath,
    }),
    koaHotMiddleware(compiler),
    koaSetBundleName,
  ]);
};
