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

function * koaDevMiddleware(next) {
  this.status = 200;
  yield koaDevExpress_.bind(null, this.req, this.res);
  yield next;
}

function * koaHotMiddleware(next) {
  yield koaHotExpress_.bind(null, this.req, this.res);
  yield next;
}

function * koaSetBundleName(next) {
  this.hot = {
    bundle: bundle_,
  };

  yield next;
}

const comp = compose([
  koaDevMiddleware,
  koaHotMiddleware,
  koaSetBundleName,
]);

export default comp;
