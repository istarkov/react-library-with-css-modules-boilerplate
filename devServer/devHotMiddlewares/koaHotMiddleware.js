import webpackHotMiddleware from 'webpack-hot-middleware';

const koaHotMiddleware = (compiler, options) => {
  const webpackHotExpress = webpackHotMiddleware(compiler, options);

  return async (ctx, next) => {
    await new Promise(r => webpackHotExpress(ctx.req, ctx.res, r));
    await next();
  };
};

export default koaHotMiddleware;
