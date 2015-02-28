var gulp = require('gulp')
var karma = require('karma').server

gulp.task('test', function (done) {

  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, function() {
    done()
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