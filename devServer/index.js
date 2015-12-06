import koa from 'koa';
import koaRouter from 'koa-router';
import devHotMiddleware from './middlewares/devHotMiddleware';

const router = koaRouter();

router.get('/', function *main() {
  this.body = `
    <!doctype html>
    <html>
      <head>
        <title>Lib Boilerplate</title>
      </head>
      <body>
        <h1>KKKK</h1>
        <div id='root'>
        </div>
        <script src="${this.hot.bundle}"></script>
      </body>
    </html>
  `;
});

const app = koa();
// app.experimental = true;

app
  .use(devHotMiddleware)
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
