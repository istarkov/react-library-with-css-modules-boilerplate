import webpackDevMiddleware from 'webpack-dev-middleware';

const koaDevMiddleware = (compiler, options) => {
  const webpackDevExpress = webpackDevMiddleware(compiler, options);

  return async (ctx, next) => {
    ctx.status = 200;
    await new Promise((r) => webpackDevExpress(ctx.req, ctx.res, r));
    ctx.status = 404;
    await next();
  };
};

export default koaDevMiddleware;
