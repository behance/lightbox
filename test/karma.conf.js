/* eslint-env node */

var bourbonIncludePaths = require('node-bourbon').includePaths;

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: [
      'jasmine'
    ],
    files: [
      'test/specs/**/*.js'
    ],
    preprocessors: {
      'test/specs/**/*.js': ['webpack']
    },
    webpack: {
      module: {
        rules: [{
          test: /\.js$/,
          loader: 'babel'
        }, {
          test: /\.scss$/,
          loader: 'css!sass?includePaths[]=' + bourbonIncludePaths,
        }]
      },
      plugins: []
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    concurrency: Infinity,
    coverageReporter: {
      reporters: [{
        type: 'text-summary'
      }, {
        type: 'html',
        dir: 'coverage/'
      }]
    }
  });
};
