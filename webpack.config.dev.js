import path from 'path';
import webpack from 'webpack';

const createConfig = (callback) => ({
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js?[hash]',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    function stat() {
      this.plugin('done', (stats) => {
        callback(stats.toJson().assetsByChunkName);
      });
    },
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src'),
    }],
  },
});

export default createConfig;
