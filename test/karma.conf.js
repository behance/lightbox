/* eslint-env node */

var bourbonIncludePaths = require('node-bourbon').includePaths;

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: [
      'jasmine'
    ],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'node_modules/jasmine-fixture/dist/jasmine-fixture.js',
      {
        pattern: 'test/fixtures/images/*.png',
        watched: false,
        included: false,
        served: true,
        nocache: false
      },
      'test/specs/**/*.js'
    ],
    preprocessors: {
      'test/specs/**/*.js': ['webpack']
    },
    webpack: {
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
