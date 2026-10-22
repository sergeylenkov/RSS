const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 9090,
    historyApiFallback: true,
    // The client talks to `/feeds` and `/entries`, so the dev server forwards
    // them to the API instead of requiring a hardcoded host.
    proxy: [
      {
        context: ['/feeds', '/entries'],
        target: process.env.API_URL || 'http://localhost:9000',
        changeOrigin: true,
      },
    ],
  },
});
