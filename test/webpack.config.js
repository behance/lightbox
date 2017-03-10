var bourbonIncludePaths = require('node-bourbon').includePaths;

module.exports = {
  devtool: 'inline-source-map',
  externals: {
    jquery: 'jQuery'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['behance']
      }
    }, {
      test: /\.scss$/,
      loader: 'css-loader!sass-loader?includePaths[]=' + bourbonIncludePaths
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader'
    }]
  },
  entry: { 'fakeWebpackEntry' : './src/fakeWebpackEntry'},
  plugins: []
};
