var bourbonIncludePaths = require('node-bourbon').includePaths;

module.exports = {
  devtool: 'inline-source-map',
  externals: {
    jquery: 'jQuery'
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
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url'
    }]
  },
  plugins: []
};
