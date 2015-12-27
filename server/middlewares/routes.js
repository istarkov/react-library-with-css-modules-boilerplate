import compose from 'koa-compose';
import koaRouter from 'koa-router';

const router = koaRouter();

router.get(['', '/', '/simple', '/textarea', '/codemirror'], (ctx, next) => {
  ctx.body = (({bundle}) => `
    <!doctype html>
    <html>
      <head>
        <title>Lib Boilerplate</title>
      </head>
      <body>
        <div id='root'>
        </div>
        <script src="${bundle}"></script>
      </body>
    </html>
  `)(ctx.hot);

  ctx.status = 200; // set 404 for method not allowed

  next();
});

export default compose([
  router.routes(),
  router.allowedMethods(),
]);
