/* eslint-env node */

var webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: [
      'jasmine'
    ],
    files: [
      'test/fixtures/css/disable_animations.css',
      require.resolve('es6-shim'),
      'node_modules/jquery/dist/jquery.js',
      'node_modules/@claviska/jquery-offscreen/jquery.offscreen.js',
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
      'test/specs/**/*.js': ['webpack', 'sourcemap']
    },
    webpack: webpackConfig,
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
