import Koa from 'koa';
import koaRouter from 'koa-router';
import devHotMiddlewares from './devHotMiddlewares';

const router = koaRouter();

router.get('/', (ctx) => {
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
});

const error = (msg) => {
  throw new Error(msg);
};

const app = new Koa();
app
  .use(
    process.env.NODE_ENV !== 'production'
    ? devHotMiddlewares()
    : error('production is not Ready')
  )
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);
