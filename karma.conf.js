module.exports = function (config) {
  config.set({
    autoWatch: false,
    browsers: ['Chrome'],
    client: {
      captureConsole: true
    },
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'dist/format-as-currency.js',
      'test/format-as-currency.js'
    ],
    logLevel: config.LOG_INFO,
    singleRun: true,

    // coverage
    coverageReporter: {
      type : 'lcov',
      dir : 'coverage/',
    },
    preprocessors: {
      'dist/format-as-currency.js': ['coverage']
    },
    reporters: ['progress', 'coverage']
  })
}