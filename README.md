# Stats.js by [Angus Gibbs](http://angusgibbs.com)

Provides functions for many of the statistical operations that you might need.

## About

Stats.js currently supports many of the statistical functions that you might need, including

* regression lines (linear, power, exponential)
* min, max, mean, median, first quartile, third quartile
* standard deviation
* sorting a list of points by an attribute
* probabilities (binomial, geometric, normal)
* z procedures

It also supports many of the functions on the data set that you'd expect from [Underscore](http://underscore.js), such as `pluck`, `map`, and `each`.

See the [getting started guide](https://github.com/angusgibbs/statsjs/blob/master/docs/getting_started.md) for more information.

## Roadmap

* Better documentation
* Auto-detect best regression line

## Contributing

Patches are welcome, just make sure there are matching unit tests. Tests use [mocha](http://visionmedia.github.com/mocha/) with [expect.js](https://github.com/LearnBoost/expect.js). Once you clone the repo (either your fork or this repository), `cd` into it and run `npm install` to install mocha and expect.js. Tests can be found within `test/test.js`.

## License

Stats.js is licensed under the [MIT License](http://opensource.org/licenses/mit-license.php). See https://github.com/angusgibbs/statsjs/blob/master/LICENSE for the full license.