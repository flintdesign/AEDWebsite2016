const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const Common = require('./webpack-common.config');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3000',
    'webpack/hot/only-dev-server',
    './source'
  ],
  output: {
    path: path.join(__dirname, '../public'),
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new WebpackNotifierPlugin(),
    new webpack.DefinePlugin({
      __DEV: true
    })
  ],
  module: {
    preLoaders: Common.preLoaders,
    loaders: Common.loaders
  },
  resolve: Common.resolve,
  devtool: 'inline-source-map'
};
