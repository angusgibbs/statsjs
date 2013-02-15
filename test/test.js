// Require the needed node modules
var expect = require('expect.js');
var stats  = require('../lib/stats.js');

describe('#min()', function() {
	it('should return the minimum value of an array', function() {
		expect(stats([12, 19, 4, 1, 2, 5, 8]).min()).to.equal(1);
	});
});

describe('#max()', function() {
	it('should return the maximum value of an array', function() {
		expect(stats([12, 19, 4, 1, 2, 5, 8]).max()).to.equal(19);
	});
});

describe('#mean()', function() {
	it('should return the mean value of an array', function() {
		expect(stats(2, 7, 9, 12, 15, 1, 6, 8).mean()).to.equal(7.5);
	});
});

describe('#median()', function() {
	it('should return the median of an odd length array', function() {
		expect(stats([12, 19, 4, 1, 2, 5, 8]).median()).to.equal(5);
	});

	it('should return the median of an even length array', function() {
		expect(stats([4, 6, 1, 5, 7, 2]).median()).to.equal(4.5);
	});
});

describe('#q1()', function() {
	it('should return the first quartile of an odd length array', function() {
		expect(stats([12, 19, 4, 1, 2, 5, 8]).q1()).to.equal(2);
	});

	it('should return the first quartile of an even length array', function() {
		expect(stats([4, 6, 1, 5, 7, 2, 6, 3]).q1()).to.equal(2.5);
	});
});

describe('#q3()', function() {
	it('should return the third quartile of an odd length array', function() {
		expect(stats([12, 19, 4, 1, 2, 5, 8]).q3()).to.equal(12);
	});

	it('should return the third quartile of an even length array', function() {
		expect(stats([4, 6, 1, 5, 7, 2, 6, 3]).q3()).to.equal(6);
	});
});

describe('#iqr()', function() {
	it('should return the interquartile range of an array', function() {
		expect(stats(4, 6, 1, 5, 7, 2, 6, 3).iqr()).to.equal(3.5);
		expect(stats(12, 19, 4, 1, 2, 5, 8).iqr()).to.equal(10);
	});
});

describe('outliers', function() {
	describe('#findOutliers()', function() {
		it('should find all the outliers', function() {
			expect(stats(1, 8, 4, 7, 2, -19, 100).findOutliers().toArray()).to.eql([-19, 100]);
		});
	});

	describe('#testOutlier()', function() {
		it('should determine whether a number would be an outlier', function() {
			expect(stats(1, 8, 4, 7, 2, -19, 100).testOutlier(100)).to.be(true);
			expect(stats(1, 8, 4, 7, 2, -19, 100).testOutlier(3)).to.be(false);
		});
	});

	describe('#removeOutliers()', function() {
		it('should remove any outliers from a data set', function() {
			expect(stats(1, 8, 4, 7, 2, -19, 100).removeOutliers().toArray()).to.eql([1, 8, 4, 7, 2]);
		});
	});
});

describe('#stdDev()', function() {
	it('should calculate the standard deviation of a data set', function() {
		expect(
			Math.abs(stats(2, 7, 9, 12, 15, 1, 6, 8).stdDev() - 4.690416)
		).to.be.lessThan(0.000001);
	});
});

describe('#expReg()', function() {
	it('should calculate the exponential regression of a data set', function() {
		var reg = stats([
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

		expect(Math.abs(reg.base - 1.32296)).to.be.lessThan(0.00001);
		expect(Math.abs(reg.coefficient - 2.0072)).to.be.lessThan(0.0001);
		expect(Math.abs(reg.r - 0.999013)).to.be.lessThan(0.000001);
	});
});

describe('#linReg()', function() {
	it('should calculate the linear regression of a data set', function() {
		var reg = stats([
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

		expect(Math.abs(reg.slope + 0.089358)).to.be.lessThan(0.000001);
		expect(Math.abs(reg.yIntercept - 3.61352)).to.be.lessThan(0.00001);
		expect(Math.abs(reg.r + 0.693356)).to.be.lessThan(0.000001);
	});
});

describe('#powReg()', function() {
	it('should calculate the power regression of a data set', function() {
		var reg = stats([
			{ x: 1,  y: 30 },
			{ x: 2,  y: 43 },
			{ x: 5,  y: 53 },
			{ x: 10, y: 65 },
			{ x: 15, y: 74 },
			{ x: 20, y: 76 },
			{ x: 30, y: 85 }
		]).powReg();

		expect(Math.abs(reg.coefficient - 32.4824)).to.be.lessThan(0.0001);
		expect(Math.abs(reg.exponent - 0.293188)).to.be.lessThan(0.000001);
		expect(Math.abs(reg.r - 0.990325)).to.be.lessThan(0.000001);
	});
});

describe('#pluck()', function() {
	it('should pluck an attribute from the array', function() {
		expect(stats({x: 5, y: 5}, {x: 10, y: 10}).pluck('x').toArray()).to.eql([5, 10]);
	});

	it('should return a new object', function() {
		var nums = stats({x: 5, y: 5}, {x: 10, y: 10});
		
		expect(nums.pluck('x')).not.to.equal(nums);
	});
});

describe('#map()', function() {
	it('should replace each element in the array with the result of the function call', function() {
		expect(stats(1, 2, 3, 4).map(function(num) {
			return num * num;
		}).toArray()).to.eql([1, 4, 9, 16]);
	});

	it('should pass the right attributes', function() {
		var els = [];
		var indices = [];
		var arrs = [];

		stats(1, 2, 3).map(function(el, index, arr) {
			els.push(el);
			indices.push(index);
			arrs.push(arr);
			return el;
		});

		expect(els).to.eql([1, 2, 3]);
		expect(indices).to.eql([0, 1, 2]);
		expect(arrs).to.eql([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
	});
});

describe('#each()', function() {
	it('should call a function for each element in the array', function() {
		var numEls = 0;

		stats(1, 2, 3, 4).each(function() {
			numEls++;
		});

		expect(numEls).to.equal(4);
	});

	it('should pass the right attributes', function() {
		var els = [];
		var indices = [];
		var arrs = [];

		stats(1, 2, 3).each(function(el, index, arr) {
			els.push(el);
			indices.push(index);
			arrs.push(arr);
		});

		expect(els).to.eql([1, 2, 3]);
		expect(indices).to.eql([0, 1, 2]);
		expect(arrs).to.eql([[1, 2, 3], [1, 2, 3], [1, 2, 3]]);
	});
});

describe('#size()', function() {
	it('should return the number of elements in the array', function() {
		expect(stats(1, 2, 3).size()).to.equal(3);
	});
});

describe('#clone()', function() {
	it('should return a new stats object', function() {
		var nums = stats(1, 2, 3);

		expect(nums.clone()).not.to.equal(nums);
	});
});

describe('#sort()', function() {
	it('should sort an array of numbers', function() {
		expect(stats(1, 4, 2, 5, 3).sort().toArray()).to.eql([1, 2, 3, 4, 5]);
	});

	it('should sort a list by an attribute', function() {
		expect(stats('hello', 'mr', 'guy').sort('length').toArray()).to.eql(['mr', 'guy', 'hello']);
	});
});

describe('Native array features', function() {
	describe('#pop()', function() {
		it('should return the last element from an array', function() {
			expect(stats(1, 2, 3).pop()).to.equal(3);
		});

		it('should remove the last element from an array', function() {
			var s = stats(1, 2, 3);
			s.pop();
			expect(s.toArray()).to.eql([1, 2]);
		});
	});

	describe('#push()', function() {
		it('should push elements to the array', function() {
			expect(stats(1, 2, 3, 4).push(5, 6)).to.equal(6);
		});
	});

	describe('#reverse()', function() {
		it('should reverse the element in the array', function() {
			expect(stats(1, 2, 3, 4).reverse().toArray()).to.eql([4, 3, 2, 1]);
		});
	});

	describe('#shift()', function() {
		it('should return the first element from an array', function() {
			expect(stats(1, 2, 3).shift()).to.equal(1);
		});

		it('should remove the first element from an array', function() {
			var s = stats(1, 2, 3);
			s.shift();
			expect(s.toArray()).to.eql([2, 3]);
		});
	});

	describe('#splice()', function() {
		it('should return the extracted portion of the array', function() {
			expect(stats(1, 2, 3, 4).splice(2, 1, 6, 7)).to.eql([3]);
		});

		it('should splice the original array', function() {
			var s = stats(1, 2, 3, 4);
			s.splice(2, 1, 6, 7);
			expect(s.toArray()).to.eql([1, 2, 6, 7, 4]);
		});
	});

	describe('#unshift()', function() {
		it('should return the length of the new array', function() {
			expect(stats(3, 4).unshift(1, 2)).to.equal(4);
		});

		it('should add elements to the beginning of the array', function() {
			var s = stats(3, 4);
			s.unshift(1, 2);
			expect(s.toArray()).to.eql([1, 2, 3, 4]);
		});
	});

	describe('#concat()', function() {
		it('should concatenate two arrays', function() {
			expect(stats(1, 2).concat([3, 4]).toArray()).to.eql([1, 2, 3, 4]);
		});
	});

	describe('#join()', function() {
		it('should join together the elements of an array', function() {
			expect(stats(1, 2, 3, 4).join().toArray()).to.eql('1,2,3,4');
			expect(stats(1, 2, 3, 4).join('').toArray()).to.eql('1234');
		});
	});

	describe('#slice()', function() {
		it('should slice the original array', function() {
			expect(stats(1, 2, 3, 4).slice(2).toArray()).to.eql([3, 4]);
			expect(stats(1, 2, 3, 4).slice(1, 3).toArray()).to.eql([2, 3]);
		});
	});
});

describe('#get()', function() {
	it('should get an element from a given index', function() {
		expect(stats(1, 2, 3, 4).get(2)).to.equal(3);
	});
});

describe('#set()', function() {
	it('should set an element at a given index', function() {
		expect(stats(1, 2, 3, 4).set(2, 5).get(2)).to.equal(5);
	});
});

describe('stats.list()', function() {
	it('should create a stats object with the bounds', function() {
		expect(stats.list(0, 5).toArray()).to.eql([0, 1, 2, 3, 4, 5]);
	});
});

describe('stats.factorial()', function() {
	it('should compute the factorial of a number', function() {
		expect(stats.factorial(4)).to.equal(24);
		expect(stats.factorial(1)).to.equal(1);
		expect(stats.factorial(7)).to.equal(5040);
	});

	it('should compute the factorial of 0 correctly', function() {
		expect(stats.factorial(0)).to.equal(1);
	});
});

describe('stats.binompdf()', function() {
	it('should compute the probability if a specific event is passed', function() {
		expect(Math.abs(stats.binompdf(20, .15, 4)) - .182122).to.be.lessThan(.000001);
	});
	
	it('should return an array if no specific event is passed', function() {
		var ret = stats.binompdf(4, .15);
		var expected = [.52201, .36848, .09754, .01148, .00051];
		var tolerance = .00001;

		for (var i = 0; i < ret.length; i++) {
			expect(Math.abs(ret[i] - expected[i])).to.be.lessThan(tolerance);
		}
	});
});

describe('stats.binomcdf()', function() {
	it('should compute the cumulative probability of an event', function() {
		expect(
			Math.abs(stats.binomcdf(20, .6, 10) - .244663)
		).to.be.lessThan(.000001);
	});
});

describe('stats.geompdf()', function() {
	it('should compute the probability of a geometric event', function() {
		expect(
			Math.abs(stats.geompdf(.25, 4) - .105469)
		).to.be.lessThan(.000001);
	});
});

describe('stats.geomcdf()', function() {
	it('should compute the cumulative probability of an event', function() {
		expect(
			Math.abs(stats.geomcdf(.25, 4) - .683594)
		).to.be.lessThan(.000001);
	});
});