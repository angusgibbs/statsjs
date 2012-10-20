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
			var arr = this.arr.sort(sortFn);

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
			var arr = this.arr.sort(sortFn);

			// The first quartile is the median of the lower half of the numbers
			return stats(arr.slice(0, Math.floor(arr.length / 2))).median();
		},

		// Finds the third quartile of the numbers.
		//
		// Returns the third quartile.
		q3: function() {
			// Sort the numbers
			var arr = this.arr.sort(sortFn);

			// The third quartile is the median of the upper half of the numbers
			return stats(arr.slice(Math.ceil(arr.length / 2))).median();
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
		}
	};

	// Used to sort an array of numbers numerically.
	//
	// Returns the difference of the two arguments.
	function sortFn(a, b) {
		return a - b;
	}

	// Override the built-in #toJSON() and #toArray() methods
	stats.init.prototype.toJSON = stats.init.prototype.toArray = function() {
		return this.arr;
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