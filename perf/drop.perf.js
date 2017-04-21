import Immutable from 'immutable';
import mori from 'mori';
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
		// list[Symbol.iterator] = list.undefined
		return list;
	})(),
	cass: List.range(0, 1024),
	native: (function() {
		var list = [];

		for (var i = 0; 1000 > i; i++) {
			list.push(i);
		}
		return list;
	})()
};

describe('', function() {
	it('mori drop speed', function() {
		mori.drop(256, list_1k.mori);
	});

	it('immutable-js drop speed', function() {
		list_1k.imm.slice(256, 1024);
	});


	it('cassowry drop speed', function() {
		var vec = list_1k.cass;
		vec.drop(256);
	});

	it('native drop speed', function() {
		list_1k.native.slice(256, 1024);
	});
});
