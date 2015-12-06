import webpack from 'webpack';
import createConfig from '../../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import compose from 'koa-compose';

let bundle_ = '';

const config = createConfig((assetsByChunkName) => {
  bundle_ = config.output.publicPath +
    (typeof assetsByChunkName.main === 'string'
      ? assetsByChunkName.main
      : assetsByChunkName.main[0]);
});

const {publicPath, filename} = config.output;
bundle_ = `${publicPath}${filename.replace(/\[hash\]/g, Math.random())}`;

const compiler = webpack(config);

const koaDevExpress_ = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
});
const koaHotExpress_ = webpackHotMiddleware(compiler);

const koaDevMiddleware = async (ctx, next) => {
  ctx.status = 200;
  await new Promise(r => koaDevExpress_(ctx.req, ctx.res, r));
  await next();
};

const koaHotMiddleware = async (ctx, next) => {
  await new Promise(r => koaHotExpress_(ctx.req, ctx.res, r));
  await next();
};

const koaSetBundleName = async (ctx, next) => {
  ctx.hot = {
    bundle: bundle_,
  };

  await next();
};

const comp = compose([
  koaDevMiddleware,
  koaHotMiddleware,
  koaSetBundleName,
]);

export default comp;
