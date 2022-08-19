const path = require('path');
const {merge} = require('webpack-merge');
const common = require('./common.js');

module.exports = merge(common, {
  mode: 'development',
  //devtool: 'source-map',
  devtool: 'inline-source-map',
  watchOptions: {
    poll: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../public'),
    },
    compress: true,
    port: 5173,
  },
});
