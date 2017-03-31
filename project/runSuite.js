var chalk = require('chalk');

var HR = '-------------------------------------------------------';


function padl(n, s) {
	while (s.length < n) {
		s += ' ';
	}
	return s;
}

function padr(n, s) {
	while (s.length < n) {
		s = ' ' + s;
	}
	return s;
}

function formatRow(nameLen, opsLen, name, ops, relativeMarginOfError, samples, isFastest) {
	ops = isFastest ? chalk.underline.green(padr(opsLen, ops)) : chalk.blue(padr(opsLen, ops));
	name = padl(nameLen, name)
	samples = padr(3, samples )
	relativeMarginOfError = padr(7, relativeMarginOfError)


	return (name + ':  ' + ops + ' op/s' + ' ±' + relativeMarginOfError + '%' + ' (' + samples + ' samples)')
}

module.exports = function runSuite(suite, skipped) {
	var results = [];
	var errors = [];
	skipped = skipped || [];

	return suite
		.on('cycle', function logResults(e) {
			var t = e.target;

			results.push({
				name: t.name,
				ops: String(t.hz.toFixed(2)),
				samples: t.stats.sample.length,
				rme: t.stats.rme.toFixed(2),
				failed: !!t.failure,
				failure: t.failure
			});

			console.log('completed results for: ' + t.name)

		})
		.on('error', function(e) {
			var err = e.error || (e.target && e.target.error)

			errors.push(err)
		})
		.on('complete', function() {
			var opsLen = 0;
			var nameLen = 0;
			var fastest = 0;
			results.forEach(function calcMax(t) {
				nameLen = Math.max(nameLen, t.name.length);
				opsLen = Math.max(opsLen, t.ops.length);
				fastest = String(Math.max(Number(fastest), Number(t.ops)))
			});

			skipped.forEach(function(name) {
				nameLen = Math.max(nameLen, name.length);
			});


			console.log(chalk.yellow(this.name));
			console.log(chalk.yellow(HR));
			results.forEach(function(t) {
				if (t.failure) {

					console.error(padl(10, t.name) + 'FAILED: ' + e.target.failure);
				} else {

					console.log(formatRow(nameLen, opsLen, t.name, t.ops, t.rme, t.samples, fastest == String(t.ops)));
				}
			});

			skipped.forEach(function(name) {
				console.log(padl(nameLen, name) + ':  ' + chalk.red('skipped'))
			});

			console.log(chalk.yellow(HR));

			errors.forEach(function(err) {
				console.log(chalk.red(HR));
				console.log(err);
				console.log(chalk.red(HR));
			})
		})
		// .run({async: true});
		.run();
};