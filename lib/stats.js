/*!
 * Stats.js (https://github.com/angusgibbs/stats.js)
 * Copyright 2012 Angus Gibbs
 */
(function(root) {
	// Create the top level stats object
	// =================================
	
	// Wrapper to create a chainable stats object.
	//
	// arr - The array to work with.
	//
	// Returns a new chainable object.
	var stats = function(arr) {
		return new stats.init(arguments.length > 1 ?
			Array.prototype.slice.call(arguments, 0) :
			arr);
	};

	// Creates a new chainable array object.
	//
	// arr - The array to work with.
	//
	// Returns a new chainable object.
	stats.init = function(arr) {
		this.arr = arr;
		this.length = arr.length;
	};

	// Define the methods for the stats object
	stats.init.prototype = {
		// Calls a function on each element in an array or JSON object.
		//
		// fn  - The function to call on each element.
		//       el    - The array or object element
		//       index - The index or key of the array element
		//       arr   - The array or object
		//
		// Returns nothing.
		each: function(fn) {
			if (this.arr.length === undefined) {
				// The wrapped array is a JSON object
				for (var key in arr) {
					fn.call(this.arr[key], key, this.arr[key], this.arr);
				}
			} else {
				// The wrapper array is an array
				for (var i = 0, l = this.arr.length; i < l; i++) {
					fn.call(this.arr[i], this.arr[i], i, this.arr);
				}
			}

			return this;
		},

		// Replaces each element in an array or JSON object with the result of
		// the function that is called against each element.
		//
		// fn - The function to call on each element
		//      el    - The array or object element
		//      index - The index or key of the array element
		//
		// Returns nothing.
		map: function(fn) {
			var arr = this.arr;

			if (arr.length === undefined) {
				// The wrapped array is a JSON object
				for (var key in arr) {
					this.arr[key] = fn.call(arr[key], arr[key], key, arr);
				}
			} else {
				// The wrapped array is an array
				for (var i = 0, l = this.arr.length; i < l; i++) {
					this.arr[i] = fn.call(arr[i], arr[i], i, arr);
				}
			}

			return this;
		},

		// Replaces each element of the array with the attribute of that given
		// element.
		//
		// attr - The attribute to pluck.
		//
		// Returns nothing.
		pluck: function(attr) {
			var newArr = [];

			if (this.arr.length === undefined) {
				// The wrapped array is a JSON object
				for (var key in arr) {
					newArr.push(this.arr[key][attr]);
				}
			} else {
				// The wrapped array is an array
				for (var i = 0, l = this.arr.length; i < l; i++) {
					newArr.push(this.arr[i][attr]);
				}
			}

			return stats(newArr);
		},

		// Finds the smallest number.
		//
		// attr - Optional. If passed, the elemnt with the minimum value for the
		//        given attribute will be returned.
		//
		// Returns the minimum.
		min: function(attr) {
			// Get the numbers
			var arr = this.arr;

			// Go through each of the numbers and find the minimum
			var minimum = attr == null ? arr[0] : arr[0][attr];
			var minimumEl = attr == null ? arr[0] : arr[0];

			stats(arr).each(function(num, index) {
				if ((attr == null ? num : num[attr]) < minimum) {
					minimum = attr == null ? num : num[attr];
					minimumEl = num;
				}
			});

			return minimumEl;
		},

		// Finds the largest number.
		//
		// attr - Optional. If passed, the elemnt with the maximum value for the
		//        given attribute will be returned.
		//
		// Returns the maximum.
		max: function(attr) {
			// Get the numbers
			var arr = this.arr;

			// Go through each of the numbers and find the maximum
			var maximum = attr == null ? arr[0] : arr[0][attr];
			var maximumEl = attr == null ? arr[0] : arr[0];

			stats(arr).each(function(num, index) {
				if ((attr == null ? num : num[attr]) > maximum) {
					maximum = attr == null ? num : num[attr];
					maximumEl = num;
				}
			});

			return maximumEl;
		},

		// Finds the median of the numbers.
		//
		// Returns the median.
		median: function() {
			// Sort the numbers
			var arr = this.clone().sort().toArray();

			if (arr.length % 2 === 0) {
				// There are an even number of elements in the array; the median
				// is the average of the middle two
				return (arr[arr.length / 2 - 1] + arr[arr.length / 2]) / 2;
			} else {
				// There are an odd number of elements in the array; the median
				// is the middle one
				return arr[(arr.length - 1) / 2];
			}
		},

		// Finds the first quartile of the numbers.
		//
		// Returns the first quartile.
		q1: function() {
			// Sort the numbers
			var nums = this.clone().sort();

			// The first quartile is the median of the lower half of the numbers
			return nums.slice(0, Math.floor(nums.size() / 2)).median();
		},

		// Finds the third quartile of the numbers.
		//
		// Returns the third quartile.
		q3: function() {
			// Sort the numbers
			var nums = this.clone().sort();

			// The third quartile is the median of the upper half of the numbers
			return nums.slice(Math.ceil(nums.size() / 2)).median();
		},

		// Finds the interquartile range of the data set.
		//
		// Returns the IQR.
		iqr: function() {
			return this.q3() - this.q1();
		},
			
		// Finds all outliers in the data set, using the 1.5 * IQR away from
		// the median test.
		//
		// Returns a new stats object with the outliers.
		findOutliers: function() {
			// Get the median and the range that the number must fall within
			var median = this.median();
			var range  = this.iqr() * 1.5;

			// Create a new stats object to hold the outliers
			var outliers = stats([]);

			// Go through each element in the data set and test to see if it
			// is an outlier
			this.each(function(num) {
				if (Math.abs(num - median) > range) {
					// The number is an outlier
					outliers.push(num);
				}
			});

			return outliers;
		},

		// Tests if the given number would be an outlier in the data set.
		//
		// num - The number to test.
		//
		// Returns a boolean.
		testOutlier: function(num) {
			return (Math.abs(num - this.median()) > this.iqr() * 1.5);
		},

		// Removes all the outliers from the data set.
		//
		// Returns nothing.
		removeOutliers: function() {
			// Get the median and the range that the number must fall within
			var median = this.median();
			var range  = this.iqr() * 1.5;

			// Create a new stats object that will hold all the non-outliers
			var notOutliers = stats([]);

			// Go through each element in the data set and test to see if it
			// is an outlier
			this.each(function(num) {
				if (Math.abs(num - median) <= range) {
					// The number is not an outlier
					notOutliers.push(num);
				}
			});

			return notOutliers;
		},

		// Finds the mean of the numbers.
		//
		// Returns the mean.
		mean: function() {
			return this.sum() / this.size();
		},

		// Finds the sum of the numbers.
		//
		// Returns the sum.
		sum: function() {
			var result = 0;

			this.each(function(num) {
				result += num;
			});

			return result;
		},

		// Finds the standard deviation of the numbers.
		//
		// Returns the standard deviation.
		stdDev: function() {
			// Get the mean
			var mean = this.mean();

			// Get a new stats object to work with
			var nums = this.clone();

			// Map each element of nums to the square of the element minus the
			// mean
			nums.map(function(num) {
				return Math.pow(num - mean, 2);
			});

			// Return the standard deviation
			return Math.sqrt(nums.sum() / (nums.size() - 1));
		},

		// Calculates the correlation coefficient for the data set.
		//
		// Returns the value of r.
		r: function() {
			// Get the x and y coordinates
			var xCoords = this.pluck('x');
			var yCoords = this.pluck('y');

			// Get the means for the x and y coordinates
			var meanX = xCoords.mean();
			var meanY = yCoords.mean();

			// Get the standard deviations for the x and y coordinates
			var stdDevX = xCoords.stdDev();
			var stdDevY = yCoords.stdDev();

			// Map each element to the difference of the element and the mean
			// divided by the standard deviation
			xCoords.map(function(num) {
				return (num - meanX) / stdDevX;
			});
			yCoords.map(function(num) {
				return (num - meanY) / stdDevY;
			});

			// Multiply each element in the x by the corresponding value in
			// the y
			var nums = this.clone().map(function(num, index) {
				return xCoords.get(index) * yCoords.get(index);
			});

			// r is the sum of xCoords over the number of points minus 1
			return nums.sum() / (nums.size() - 1);
		},

		// Calculates the Least Squares Regression line for the data set.
		//
		// Returns an object with the slope and y intercept.
		linReg: function() {
			// Get the x and y coordinates
			var xCoords = this.pluck('x');
			var yCoords = this.pluck('y');

			// Get the means for the x and y coordinates
			var meanX = xCoords.mean();
			var meanY = yCoords.mean();

			// Get the standard deviations for the x and y coordinates
			var stdDevX = xCoords.stdDev();
			var stdDevY = yCoords.stdDev();

			// Calculate the correlation coefficient
			var r = this.r();

			// Calculate the slope
			var slope = r * (stdDevY / stdDevX);

			// Calculate the y-intercept
			var yIntercept = meanY - slope * meanX;

			return {
				slope: slope,
				yIntercept: yIntercept,
				r: r
			};
		},

		// Calculates the exponential regression line for the data set.
		//
		// Returns an object with the coefficient, base, and correlation
		// coefficient for the linearized data.
		expReg: function() {
			// Get y coordinates
			var yCoords = this.pluck('y');

			// Do a semi-log transformation of the coordinates
			yCoords.map(function(num) {
				return Math.log(num);
			});

			// Get a new stats object to work with that has the transformed data
			var nums = this.clone().map(function(coord, index) {
				return {
					x: coord.x,
					y: yCoords.get(index)
				};
			});

			// Calculate the linear regression for the linearized data
			var linReg = nums.linReg();

			// Calculate the coefficient for the exponential equation
			var coefficient = Math.pow(Math.E, linReg.yIntercept);

			// Calculate the base for the exponential equation
			var base = Math.pow(Math.E, linReg.slope);

			return {
				coefficient: coefficient,
				base: base,
				r: linReg.r
			};
		},

		// Calculates the power regression line for the data set.
		//
		// Returns an object with the coefficient, base, and correlation
		// coefficient for the linearized data.
		powReg: function() {
			// Get y coordinates
			var xCoords = this.pluck('x');
			var yCoords = this.pluck('y');

			// Do a log-log transformation of the coordinates
			xCoords.map(function(num) {
				return Math.log(num);
			});
			yCoords.map(function(num) {
				return Math.log(num);
			});

			// Get a new stats object to work with that has the transformed data
			var nums = this.clone().map(function(coord, index) {
				return {
					x: xCoords.get(index),
					y: yCoords.get(index)
				};
			});

			// Calculate the linear regression for the linearized data
			var linReg = nums.linReg();

			// Calculate the coefficient for the power equation
			var coefficient = Math.pow(Math.E, linReg.yIntercept);

			// Calculate the exponent for the power equation
			var exponent = linReg.slope;

			return {
				coefficient: coefficient,
				exponent: exponent,
				r: linReg.r
			};
		},

		// Returns the number of elements.
		size: function() {
			return this.arr.length;
		},

		// Clones the current stats object, providing a new stats object which
		// can be changed without modifying the original object.
		//
		// Returns a new stats object.
		clone: function() {
			return stats(this.arr.slice(0));
		},

		// Sorts the internal array, optionally by an attribute.
		//
		// Returns nothing.
		sort: function(attr) {
			this.arr = this.arr.sort(function(a, b) {
				if (attr == null) {
					return a - b;
				} else {
					return a[attr] - b[attr];
				}
			});

			return this;
		},

		// Gets an element from the object.
		//
		// i - The index to retrieve.
		//
		// Returns the element at that index.
		get: function(i) {
			return this.arr[i];
		},

		// Sets an element on the object.
		//
		// i   - The index to set.
		// val - The value to set the index to.
		//
		// Returns nothing.
		set: function(i, val) {
			this.arr[i] = val;

			return this;
		},

		// Performs a JavaScript splice on the internal data set.
		//
		// start   - The index to add/remove from.
		// numEls  - The number of elements to remove.
		// nums... - Any additional arguments will be added after the elements
		//           that are removed.
		//
		// Returns nothing.
		splice: function() {
			Array.prototype.splice.apply(
				this.arr,
				Array.prototype.slice.call(arguments, 0)
			);

			return this;
		},

		// Performs a JavaScript slice on the internal data set.
		//
		// start - The start index.
		// end   - The end index.
		//
		// Returns nothing.
		slice: function(start, end) {
			this.arr = this.arr.slice(start, end);

			return this;
		},

		// Performs a JavaScript push on the internal data set.
		//
		// els... - The elements to push to the end of the array.
		//
		// Returns nothing.
		push: function() {
			Array.prototype.push.apply(
				this.arr,
				Array.prototype.slice.call(arguments, 0)
			);

			return this;
		}
	};

	// Override the built-in #toJSON() and #toArray() methods
	stats.init.prototype.toJSON = stats.init.prototype.toArray = function() {
		return this.arr;
	};

	// Creates a list from the specified lower bound to the specified upper
	// bound.
	//
	// lower - The lower bound.
	// upper - The upper bound.
	//
	// Returns a new stats object.
	stats.list = function(lower, upper) {
		// Create the array
		var arr = [];
		for (var i = lower; i <= upper; i++) {
			arr[i - lower] = i;
		}

		return stats(arr);
	};

	// Computes the factorial of a number.
	//
	// num - The number.
	//
	// Returns the factorial.
	stats.factorial = function(num) {
		// Handle the special case of 0
		if (num == 0) {
			return 1;
		}

		// Otherwise compute the factorial
		for (var i = num - 1; i > 1; i--) {
			num *= i;
		}

		return num;
	};

	// Computes a permutation.
	//
	// n - The length of the set.
	// r - The number of elements in the subset.
	//
	// Returns the permutation.
	stats.permutation = stats.nPr = function(n, r) {
		return stats.factorial(n) / stats.factorial(n - r);
	};

	// Computes a combination.
	//
	// n - The length of the set.
	// r - The number of elements in the subset.
	//
	// Returns the combination.
	stats.combination = stats.nCr = function(n, r) {
		return stats.factorial(n) /
			(stats.factorial(r) * stats.factorial(n - r));
	};

	// Computes the probability of a binomial event.
	//
	// trials - The number of trials.
	// p      - The probability of success.
	// x      - The event number (optional).
	//
	// If x is not passed, an array with all the probabilities
	// will be returned.
	//
	// Returns a number or an array.
	stats.binompdf = function(trials, p, x) {
		// CASE: Specific event was passed
		if (x != null) {
			// Return 0 if the event does not exist
			if (x > trials || x < 0) {
				return 0;
			}

			// Return the probability otherwise
			return stats.nCr(trials, x) * Math.pow(p, x) *
				Math.pow(1 - p, trials - x);
		}
		// CASE: No specific event was passed
		else {
			// Compute the probabilities
			return stats.list(0, trials).map(function(num) {
				return stats.binompdf(trials, p, num);
			}).toArray();
		}
	};

	// Computes the cumulative probability of a binomial event
	stats.binomcdf = function(trials, p, x) {
		return stats.list(0, x).map(function(num) {
			return stats.binompdf(trials, p, num);
		}).sum();
	};

	// Export the stats object
	// =================================================
	if (typeof define === 'function') {
		// Expose to AMD loaders
		define(function() {
			return stats;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		// Expose to Node and similar environments
		module.exports = stats;
	} else {
		// Just write to window (or whatever is the root object)
		root.stats = stats;
	}
}(this));