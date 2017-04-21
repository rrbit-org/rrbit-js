var Benchmark = require('benchmark');
var run = require('../project/runSuite')

var List = require('../lib/rrbit').default;
var Imm = require('immutable');
var seamless = require('seamless-immutable');
var mori = require('mori');
var iam = require('immutable-array-methods');
var _ = require('lodash')


function range(size) {
	var a = new Array(size);
	for(var i = 0; size > i; ++i) {
		a[i] = i;
	}
	return a
}

function add1(x) {
	return x + 1;
}

function even(x) {
	return x % 2 === 0;
}

function sum(x, y) {
	return x + y;
}

function buildSuite(a) {
	return (Benchmark
		.Suite("filter-map-reduce " + a.length)
		.add('rrbit builder', function() {
			var result = List.Builder()
				.appendAll(a)
				.filter(even)
				.map(add1)
				.reduce(sum, 0)

		})
		.add('rrbit list', function() {
			var result = List.from(a)
				.filter(even)
				.map(add1)
				.reduce(sum, 0)
		})
		.add('immutablejs', function() {
			var result = Imm.fromJS(a)
				.filter(even)
				.map(add1)
				.reduce(sum, 0)
		})
		.add('mori', function() {
			var vec = mori.toClj(a)
			var result = mori.reduce(sum, 0, mori.map(add1, mori.filter(even, vec)))
		})
		.add('seamless-immutable', function() {
			var result = seamless(a)
				.filter(even)
				.map(add1)
				.reduce(sum, 0)
		})
		.add('native', function() {
			a.filter(even)
				.map(add1)
				.reduce(sum, 0)
		})
		.add('lodash native', function() {
			var result = _.reduce(_.map(_.filter(a, even), add1), sum, 0)

		})
	)
}


// run(buildSuite(range(10)))
// run(buildSuite(range(100)))
// run(buildSuite(range(1000)))
run(buildSuite(range(10000)))
// run(buildSuite(range(100000)))
// run(buildSuite(range(1000000)))