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
		expect(stats(2, 7, 9, 12, 15, 1, 6, 8).stdDev()).to.be.within(0.000001).of(4.690416);
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

		expect(reg.base).to.be.within(.00001).of(1.32296);
		expect(reg.coefficient).to.be.within(.0001).of(2.0072);
		expect(reg.r).to.be.within(.000001).of(.999013);
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

		expect(reg.slope).to.be.within(.000001).of(-.089358);
		expect(reg.yIntercept).to.be.within(.00001).of(3.61352);
		expect(reg.r).to.be.within(.000001).of(-.693356);
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

		expect(reg.coefficient).to.be.within(.0001).of(32.4824);
		expect(reg.exponent).to.be.within(.000001).of(.293188);
		expect(reg.r).to.be.within(.000001).of(.990325);
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

	it('should be able to sort in descending order', function() {
		expect(stats(1, 4, 2, 5, 3).sort(true).toArray()).to.eql([5, 4, 3, 2, 1]);
	});

	it('should sort a list by an attribute', function() {
		expect(stats('hello', 'mr', 'guy').sort('length').toArray()).to.eql(['mr', 'guy', 'hello']);
	});

	it('should accept a closure', function() {
		expect(stats('hello', 'mr', 'guy').sort(function(a, b) {
			return a.length - b.length;
		}).toArray()).to.eql(['mr', 'guy', 'hello']);
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

describe('#gcd()', function() {
	it('should return the greatest common denominator of a set of numbers', function() {
		expect(stats(22, 11).gcd()).to.equal(11);
		expect(stats(22, 10).gcd()).to.equal(2);
		expect(stats(61, 34).gcd()).to.equal(1);
		expect(stats(22, 11, 33).gcd()).to.equal(11);
		expect(stats(22, 11, 4).gcd()).to.equal(1);
	});
});

describe('#lcm()', function() {
	it('should return the least common multiple of a set of numbers', function() {
		expect(stats(1, 2, 3, 4).lcm()).to.equal(12);
		expect(stats(12, 19, 34).lcm()).to.equal(3876);
		expect(stats(3, 6, 9, 12).lcm()).to.equal(36);
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
		expect(stats.binompdf(20, .15, 4)).to.be.within(.000001).of(.182122);
	});
	
	it('should return an array if no specific event is passed', function() {
		var ret = stats.binompdf(4, .15);
		var expected = [.52201, .36848, .09754, .01148, .00051];
		var tolerance = .00001;

		for (var i = 0; i < ret.length; i++) {
			expect(ret[i]).to.be.within(tolerance).of(expected[i]);
		}
	});
});

describe('stats.binomcdf()', function() {
	it('should compute the cumulative probability of an event', function() {
		expect(stats.binomcdf(20, .6, 10)).to.be.within(.000001).of(.244663);
	});
});

describe('stats.geompdf()', function() {
	it('should compute the probability of a geometric event', function() {
		expect(stats.geompdf(.25, 4)).to.be.within(.000001).of(.105469);
	});
});

describe('stats.geomcdf()', function() {
	it('should compute the cumulative probability of an event', function() {
		expect(stats.geomcdf(.25, 4)).to.be.within(.000001).of(.683594);
	});
});

describe('stats.normalpdf()', function() {
	it('should compute the normal probability funciton', function() {
		expect(stats.normalpdf(1, 0, 1)).to.be.within(.000001).of(.241971);
	});
});

describe('stats.normalcdf()', function() {
	it('should compute the cumulative normal probability funciton', function() {
		expect(stats.normalcdf(1, 0, 1)).to.be.within(.000001).of(.841345);
	});

	it ('should allow for an upper and lower value to be passed', function() {
		expect(stats.normalcdf(-1, 1, 0, 1)).to.be.within(.000001).of(.682689);
		expect(stats.normalcdf(-2, 1.5, 3, 1.8)).to.be.within(.000001).of(.199592);
		expect(stats.normalcdf(-3.14, 2.71, 4, .5)).to.be.within(.00001).of(.00494);
	});
});

describe('stats.invNorm()', function() {
	it('should calculate the inverse normal correctly', function() {
		expect(stats.invNorm(.35)).to.be.within(.00001).of(-.38532);
		expect(stats.invNorm(.02)).to.be.within(.00001).of(-2.05375);
		expect(stats.invNorm(.50)).to.equal(0);
		expect(stats.invNorm(.98)).to.be.within(.00001).of(2.05375);
	});
});

describe('stats.ZTest()', function() {
	it('should calculate the z statistic and p value correctly', function() {
		var result = stats.ZTest(275, 60, 272, 840, 'lessthan');
		expect(result.z).to.be.within(.00001).of(-1.44914);
		expect(result.p).to.be.within(.00001).of(.07365);
	});
});

describe('stats.ZInterval()', function() {
	it('should calculate the low, high, and margin of error', function() {
		var result = stats.ZInterval(.0068, .8404, 3, .99);
		expect(result.low).to.be.within(.0001).of(.8303);
		expect(result.high).to.be.within(.0001).of(.8505);
		expect(result.moe).to.be.within(.000001).of(.010113);
	});
});