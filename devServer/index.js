import Koa from 'koa';
import koaRouter from 'koa-router';
import devHotMiddleware from './middlewares/devHotMiddleware';

const router = koaRouter();

router.get('/', (ctx) => {
  ctx.body = `
    <!doctype html>
    <html>
      <head>
        <title>Lib Boilerplate</title>
      </head>
      <body>
        <div id='root'>
        </div>
        <script src="${ctx.hot.bundle}"></script>
      </body>
    </html>
  `;
});

const app = new Koa();
app
  .use(devHotMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
