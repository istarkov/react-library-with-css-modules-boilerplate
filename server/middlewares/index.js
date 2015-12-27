import compose from 'koa-compose';
import routes from './routes';

export default compose([
  routes,
]);
