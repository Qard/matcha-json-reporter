module.exports = function (options) {
  options = options || {}
  var stream = options.stream || process.stdout

  return function (runner, utils) {
    var hasSuite = false
    var hasBench = false

    // Encapsulate entire run in an array of suites
    runner.on('start', function () {
      stream.write('[')
    })
    runner.on('end', function () {
      stream.write(']')
    })

    // Each suite is a JSON structure containing a name and a benchmarks array
    runner.on('suite start', function (suite) {
      if (hasSuite) stream.write(',')
      stream.write('{"name":"' + suite.title + '","benchmarks":[')
      hasSuite = true
    })
    runner.on('suite end', function (suite) {
      hasBench = false
      stream.write(']}')
    })

    // Each benchmark is simply the serialized result data
    runner.on('bench end', function (bench) {
      if (hasBench) stream.write(',')
      stream.write(JSON.stringify(bench))
      hasBench = true
    })
  }
}
