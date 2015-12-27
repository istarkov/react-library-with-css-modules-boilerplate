import webpackHotMiddleware from 'webpack-hot-middleware';

const koaHotMiddleware = (compiler, options) => {
  const webpackHotExpress = webpackHotMiddleware(compiler, options);


  const koaMiddleware = async (ctx, next) => {
    await new Promise((r) => webpackHotExpress(ctx.req, ctx.res, r));
    await next();
  };

  koaMiddleware.publish = webpackHotExpress.publish.bind(webpackHotExpress);
  return koaMiddleware;
};

export default koaHotMiddleware;
