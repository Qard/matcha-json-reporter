var gulp = require('gulp')
var matcha = require('gulp-matcha')
var spawn = require('child_process').spawn
var concat = require('concat-stream')
var assert = require('assert')

var reporter = require('./')

gulp.task('bench', function () {
  return gulp.src('bench.js')
    .pipe(matcha({
      reporter: reporter()
    }))
    .on('end', process.exit)
})

gulp.task('test', function (cb) {
  var p = spawn('gulp', ['bench', '--silent'])
  p.on('error', cb)
  p.stdout.on('error', cb)
  p.stdout.pipe(concat(function (buf) {
    var data = JSON.parse(buf.toString())

    // Verify presence of suite
    assert(Array.isArray(data))
    var suite = data[0]
    assert(typeof suite === 'object')
    assert(suite.name === 'test')

    // Verify presence of benchmark
    assert(Array.isArray(suite.benchmarks))
    var benchmark = suite.benchmarks[0]
    assert(typeof benchmark === 'object')
    assert(benchmark.title === 'it works')
    assert(typeof benchmark.iterations === 'number')
    assert(typeof benchmark.elapsed === 'number')
    assert(typeof benchmark.ops === 'number')
    console.log('success!')
    cb()
  }))
})

gulp.task('default', ['test'])
