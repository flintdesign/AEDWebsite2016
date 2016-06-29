// Use this file for config options that should be uniform
// between webpack environment configs

const path = require('path');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer')

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
      exclude: /node_modules/,
      loaders: ['react-hot', 'babel-loader'],
      include: path.join(__dirname, '../source')
    },
    {
      test: /\.(png|jpg|jpeg|svg|woff|otf|ttf|eot)$/, loader: 'url-loader?limit=8192'
    },
    {
      test:   /\.styl$/,
      loader: "style-loader!css-loader!stylus-loader"
    }
  ],
  resolve: {
    root: path.join(__dirname, '../source'),
    modulesDirectories: ["node_modules", "public"],
    extensions: ['', '.js', '.css', '.styl', '.png', '.jpg', '.jpeg', '.svg', '.woff', '.otf', '.ttf', '.eot']
  },
  stylus: {
    use: [
      poststylus([ 'autoprefixer' ])
    ]
  }
};
