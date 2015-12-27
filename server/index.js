import 'babel-polyfill'; // server code is not builded with webpack so include manually
import Koa from 'koa';
// import koaRouter from 'koa-router';
import koaDevHotMiddlewares from './koaDevHotMiddlewares';
import webPackConfig from '../webpack.config.dev';


const error = (msg) => {
  throw new Error(msg);
};

const app = new Koa();
app
  .use(
    process.env.NODE_ENV !== 'production'
    ? koaDevHotMiddlewares({webPackConfig, serverPath: './server'})
    : error('production is not Ready')
  )
  // for reload to work
  .use((...args) => require('./middlewares').default(...args))
  .listen(3000);
