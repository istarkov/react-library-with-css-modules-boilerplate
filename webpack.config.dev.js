import path from 'path';
import webpack from 'webpack';

const createConfig = (callback) => ({
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    'babel-polyfill',
    './examples/index',
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
  resolve: {
    alias: {
      'react-babel-playground': path.join(__dirname, 'src'),
    },
  },
  module: {
    exprContextCritical: false,
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: [path.join(__dirname, 'src'), path.join(__dirname, 'examples')],
      },
      {
        test: /\.json$/,
        loaders: ['json-loader'],
      },
      {
        test: /\.sass$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]--[hash:base64:5]',
          'postcss-loader',
          `sass-loader?precision=10&indentedSyntax=sass`,
        ],
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]--[hash:base64:5]',
          'postcss-loader',
        ],
      },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    module: 'empty',
  },
});

export default createConfig;
