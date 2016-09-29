var bourbonIncludePaths = require('node-bourbon').includePaths;

module.exports = {
  devtool: 'source-map',
  externals: {
    'jquery': 'jQuery'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['behance']
      }
    }, {
      test: /\.scss$/,
      loader: 'css!sass?includePaths[]=' + bourbonIncludePaths,
    }]
  },
  plugins: []
};
