function devServer() {
  const webpack = require('webpack');
  const WebpackDevServer = require('webpack-dev-server');
  const config = require('./webpack/webpack.config');
  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    contentBase: 'public/',
    hot: true,
    historyApiFallback: true,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  }).listen(3000, 'localhost', (err) => {
    if (err) {
      console.log(err);
    }
    console.log('Listening at localhost:3000');
  });
}

function server() {
  const express = require('express');
  const app = express();
  app.use(express.static('public'));
  app.listen(8080, () => console.log('Express server running at http://localhost:8080'));
}

if (process.ENV === 'production') {
  server();
} else {
  devServer();
}
