import Immutable from 'immutable';
import mori from 'mori';
import _ from 'lodash';
import {List} from '../src/index'

var list_1k = {
	imm: (function() {
		var list = Immutable.List();
		for (var i = 0; 1000 > i; i++) {
			list = list.push(i);
		}
		return list;
	})(),
	mori: (function() {
		var list = mori.vector();
		for (var i = 0; 1000 > i; i++) {
			list = mori.conj(list, i);
		}
		list[Symbol.iterator] = list.undefined;
		return list;
	})(),
	native: (function() {
		var list = [];

		for (var i = 0; 1000 > i; i++) {
			list.push(i);
		}
		return list;
	})(),
	cass: List.range(1000)
};


describe('standard iteration comparison', function() {


	it('rrbit reduce speed', function() {
		list_1k.cass.reduce((acc, value) => {
			value + value;
		}, 0);
	});


	it('native forEach speed', function() {
		list_1k.native.forEach(function(value) {
			value + value;
		});
	});

	it('native for speed', function() {
		var list = list_1k.native;
		for (var i = 0; list.length > i; i++) {
			var value = list[i];
			value + value;
		}
	});
	it('lodash forEach speed', function() {
		var list = list_1k.native;
		_.reduce(list, (_, value) => {
			value + value;
		});
	});

	// it('mori for-of speed', function() {
	// 	for (var value of list_1k.mori) {
	// 		value + value;
	// 	}
	// });
	//
	// it('immutable-js for-of speed', function() {
	// 	for (var value of list_1k.imm) {
	// 		value + value;
	// 	}
	// });

	// it('rrbit for-of speed', function() {
	// 	for (var value of list_1k.rrbit) {
	// 		value + value;
	// 	}
	// })

	// it.skip('native for-of speed', function() {
	// 	for (var value of list_1k.native) {
	// 		value + value;
	// 	}
	// });
});
