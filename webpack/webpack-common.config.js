// Use this file for config options that should be uniform
// between webpack environment configs

var path = require('path');

module.exports = {
  preLoaders: [
    {
      test: /\.js$/,
      loader: 'eslint-loader',
      include: path.join(__dirname, '../source')
    },
  ],
  loaders: [
    {
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, '../source')
    },
    {
      test: /\.(png|jpg|jpeg|svg|woff|otf|ttf)$/, loader: 'url-loader?limit=8192'
    }
  ],
  resolve: {
    root: path.join(__dirname, '../source'),
    extensions: ['', '.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.otf', '.ttf']
  }
};
