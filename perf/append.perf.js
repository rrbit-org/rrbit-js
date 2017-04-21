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

	it('immutable-js append w/mutations 1k', function() {
		var list = Immutable.List();

		list.withMutations(function(list) {
			for (var i = 0; 1000 > i; i++) {
				list = list.push(i);
			}
		})

	});

	it('mori vector append 1k', function() {
		// the original HAMT, highly optimized for append
		var list = mori.vector();
		for (var i = 0; 1000 > i; i++) {
			list = mori.conj(list, i);
		}
	});

	it.skip('mori range 1k', function() {
		var list = mori.range(0, 1000)

	});

	it('rrbit list range 1k', function() {
		var list = List.range(0, 1000)
	});

	it('rrbit list times 1k', function() {
		var list = List.times(1000, i => i)
	});

	it('rrbit slower range 1k', function() {
		var list = List.empty()
		for (var i = 0; 1000 > i; i++) {
			list = list.append(i)
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
