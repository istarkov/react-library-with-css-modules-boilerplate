import { subscribe } from 'webpack-hot-middleware/client';

if (module.hot) {
  subscribe(({reload} = {reload: false}) => {
    if (reload) {
      console.log('[devHotMiddleware] Reload command received');
      window.location.reload();
    }
  });
}
