import Immutable from 'immutable';
import mori from 'mori';
import {List} from '../src/index';

describe('append/push comparisons', function() {
	it('immutable-js append 1k', function() {
		var list = Immutable.List();
		for (var i = 0; 1000 > i; i++) {
			list = list.push(i);
		}
	});

	it('mori vector append 1k', function() {
		// the original HAMT, highly optimized for append
		var list = mori.vector();
		for (var i = 0; 1000 > i; i++) {
			list = mori.conj(list, i);
		}
	});

	it('rrbit list range 1k', function() {
		var list = List.range(0, 1000)
	});

	it('native 1k comparible(upper limit possible)', function() {
		// full array copy, resetting every 32

		var list = [];
		for (var i = 0; 1000 > i; i++) {
			list = list.slice(0);
			list.push(i);
			if (list.length == 32) list = [];
		}
	});


	it('native push 1k mutating(max possible)', function() {
		var list = [];
		for (var i = 0; 1000 > i; i++) {
			list.push(i);
		}
	});

	it('native push 1k immutable with es6 spread', function() {
		var list = [];
		for (var i = 0; 1000 > i; i++) {
			list = [...list, i];
		}
	});
});
