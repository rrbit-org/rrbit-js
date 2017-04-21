var path = require('path');
var Benchmark = require('benchmark');
var vm = require('vm');
var babel = require('rollup-plugin-babel')
var rollup = require('rollup');
var yargs = require('yargs')

var exec = require('./runSuite');


var fileName = yargs.argv.file
var file = path.resolve(__dirname, '../', fileName);

run(file)


function run(fileName) {

	var suites = [];
	var skipped = [];

	function describe(name, fn) {
		suites.push(Benchmark.Suite(name));
		fn();
	}

	function it(name, fn) {
		suites[suites.length - 1].add(name, fn)
	}

	function skip(name, fn) {
		skipped.push(name)
	}

	it.skip = skip;
	describe.skip = skip;


	var file = path.resolve(__dirname, fileName);

	rollup.rollup({
		entry: file,
		plugins: [
			babel()
		]
	}).then(function(bundle) {

		// walk all imports
		var result = bundle.generate({
			format: 'cjs'
		});

		// also transform with babel
		// result = babel.transform(result.code);

		vm.runInNewContext(result.code, {
			describe: describe,
			it: it,
			console: console,
			suites: suites,
			// module: {exports: {}},
			require: require
		}, file);


		for (var st of suites) {
			exec(st, skipped);
		}
	}).catch(function(err) {
		console.error(err)
	});


}
