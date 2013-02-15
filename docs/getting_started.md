# Stats.js

Stats.js provides helper functions for many of the statistical operations you might do, wrapped in a nice, chainable API.

## Creating a stats object

You create a new stats object by passing your data to `stats`, like so:

```javascript
var nums;

// The stats function can take a single array
nums = stats([1, 2, 3, 4]);

// It can also take multiple arguments
nums = stats(1, 2, 3, 4);
```

## Methods on the stats object you created

### #toArray()

Returns the data that the stats object is wrapping around.

```javascript
console.log(stats(1, 2, 3, 4).toArray());
// => [1, 2, 3, 4]
```

### #size()

Returns the number of elements in the data set.

### #clone()

Creates a new stats object with the same data as the current one that can be modified without affecting the original data set.

**This method is chainable.**

```javascript
var original = stats(1, 2, 3, 4);
var updated = original.clone();

updated.set(2, 5);

updated.toArray();
// => [1, 2, 5, 4]
original.toArray();
// => [1, 2, 3, 4]
```

### #set(*index*, *value*)

Sets the element at the given index to the given value.

**This method is chainable.**

```javascript
var nums = stats(1, 2, 3, 4);

nums.set(2, 5).set(3, 10);

nums.toArray();
// => [1, 2, 5, 10];
```

### #get(*index*)

Returns the element at the given index.

### #each(*fn*)

Calls *fn* on each element in the array. *fn* is called with three parameters: the current element, the index, and the whole array.

**This method is chainable.**

```javascript
var sum = 0;

stats(1, 2, 3, 4).each(function(num, index, array) {
	sum += num;
});

console.log(sum);
// => 10
```

### #map(*fn*)

Similar to `#each()` but each element is set to the return value of *fn* being called on it. *fn* receives the same arguments as it does for `#each()`.

**This method is chainable.**

```javascript
stats(1, 2, 3, 4).map(function(num) {
	return num * num;
}).toArray();
// => [1, 4, 9, 16]
```

### #pluck(*attr*)

Returns a new stats object whose array contains the value of the attribute passed for each element.

**This method is chainable.**

```javascript
stats(
	{ x: 5,  y: 5  },
	{ x: 7,  y: 7  },
	{ x: 8,  y: 8  },
	{ x: 10, y: 10 }
).pluck('x').toArray();
// => [5, 7, 8, 10]
```

### Array Methods

Any stats object has access to all of the native JavaScript array methods listed on [the MDN Array Documentation page](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array) down to slice.

### #sort([*attr* = null])

Sorts the data set, optionally by a given attribute.

### #min()

Returns the smallest number in the array.

### #max()

Returns the largest number in the array.

### #mean()

Returns the mean of the data set.

### #median()

Returns the median of the data set.

### #q1()

Returns the first quartile of the data set.

### #q3()

Returns the third quartile of the data set.

### #findOutliers()

Returns a new stats object that contains all the outliers in the data set. Outliers are determined using the 1.5 x IQR away from the median test.

### #testOutlier(*num*)

Returns a boolean, whether or not the given number would be an outlier in the current data set. Outliers are determined using the 1.5 x IQR away from the median test.

### #removeOutliers()

Returns a new stats object with all the outliers removed. Outliers are determined using the 1.5 x IQR away from the median test.

### #stdDev()

Returns the standard deviation of the data set.

### #expReg()

Calculates the exponential regression equation for the data set, in the form y = a * b^x. Returns a JSON object with the coefficient (a), base (b), and correlation coefficient (r) for the linearized data.

```javascript
stats([
	{ x: 0,  y: 1.9  },
	{ x: 1,  y: 2.8  },
	{ x: 2,  y: 3.6  },
	{ x: 3,  y: 4.5  },
	{ x: 4,  y: 6.3  },
	{ x: 5,  y: 8.3  },
	{ x: 6,  y: 10.5 },
	{ x: 7,  y: 13.8 },
	{ x: 8,  y: 18.6 },
	{ x: 9,  y: 26.8 },
	{ x: 10, y: 31.7 }
]).expReg();
// => { base: 1.32296, coefficient: 2.0072, r: 0.999013 }
```

### #linReg()

Calculates the linear regression equation for the data set, in the form y = a + b*x. Returns a JSON object with the slope (b), yIntercept(a), and correlation coefficient (r).

```javascript
stats([
	{ x: 2,  y: 4.0 },
	{ x: 5,  y: 1.5 },
	{ x: 8,  y: 3.8 },
	{ x: 9,  y: 3.0 },
	{ x: 12, y: 2.8 },
	{ x: 14, y: 2.5 },
	{ x: 15, y: 2.0 },
	{ x: 18, y: 1.8 },
	{ x: 22, y: 1.5 },
	{ x: 24, y: 1.0 },
	{ x: 25, y: 0.8 },
	{ x: 25, y: 3.1 },
	{ x: 30, y: 0.5 }
]).linReg();
// => { slope: -0.089358, yIntercept: 3.61352, r: -0.693356 }
```

### #powReg()

Calculates the power regression line for the data set, in the form y = a * x^b. Returns a JSON object with the coefficient (a), exponent (b), and correlation coefficient (r) for the linearized data.

```javascript
stats([
	{ x: 1,  y: 30 },
	{ x: 2,  y: 43 },
	{ x: 5,  y: 53 },
	{ x: 10, y: 65 },
	{ x: 15, y: 74 },
	{ x: 20, y: 76 },
	{ x: 30, y: 85 }
]).powReg()
// => { coefficient: 32.4824, exponent: 0.293188, r: 0.990325 }
```

## Methods on the global stats object

### stats.list(*lower*, *upper*[, *step* = 1])

Creates a list from `lower` to `upper` (inclusive), optionally counting by `step`.

```javascript
stats.list(1, 5).toArray();
// => [1, 2, 3, 4, 5]

stats.list(1, 10, 2).toArray();
// => [1, 3, 5, 7, 9]
```

### stats.factorial(*num*)

Computes the factorial of the given number.

### stats.permutation(*n*, *r*)

Computes the permutation of `n` choose `r`. Alised as `stats.nPr`.

### stats.combination(*n*, *r*)

Computes the combination of `n` choose `r`. Alised as `stats.nCr`.

### stats.binompdf(*trials*, *p*[, *x*])

Computes the probability of a binomial event given the number of trials and probability of success.

If the event number (`x`) is not passed, an array with all the probabilities from 0 to the number of trials is returned.

```javascript
stats.binomcdf(2, 0.5, 1);
// => 0.5

stats.binomcdf(5, 0.25);
// => [0.0625, 0.25, 0.375, 0.25, 0.0625]
```

### stats.binomcdf(*trials*, *p*, *x*)

Computes the cumulative probability of a binomial event (i.e., P(x <= `x`)), given the number of trials, probability of success, and event number.

### stats.geompdf(*p*, *x*)

Computes the probability of a geometric event (i.e., P(x = `x`)), given the probability of success and event number.

### stats.geomcdf(*p*, *x*)

Computes the cumulative probability of a geometric event (i.e., P(x <= `x`)), given the probability of success and event number.