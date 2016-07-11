const path = require('path');
const webpack = require('webpack');
const Common = require('./webpack-common.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    './source'
  ],
  output: {
    path: path.join(__dirname, '../public/assets/'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV: false,
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('css/main.css', { allChunks: true }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ],
  module: {
    preLoaders: Common.preLoaders,
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, '../source')
      },
      {
        test: /\.(png|jpg|jpeg|svg)$/, loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(woff|otf|ttf|eot)$/,
        loader: 'url-loader?limit=100000&name=../fonts/[hash].[ext]'
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('stylus', 'css-loader!stylus-loader')
      }
    ]
  },
  resolve: Common.resolve,
  stylus: Common.stylus
};
