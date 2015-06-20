var gulp = require('gulp')
var karma = require('karma').server
var coveralls = require('gulp-coveralls')

gulp.task('coveralls', function () {

  gulp
    .src('coverage/**/lcov.info')
    .pipe(coveralls())

})

gulp.task('unit', function (done) {

  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, function (exitCode) {
    if (exitCode == 0) {
      done()
    } else {
      process.exit(exitCode)
    }
  })

})

gulp.task('tdd', function (done) {

  karma.start({
    autoWatch: true,
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, function() {
    done()
  })

})