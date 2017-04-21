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

const isEven = value => value % 2 === 0;

describe('filter even 1k comparison', function() {

	it('mori filter speed', function() {
		var list = mori.filter(isEven, list_1k.mori)
	});

	it('immutable filter speed', function() {
		var list = list_1k.imm.map(isEven)
	});

	it('rrbit filter speed', function() {
		var list = list_1k.cass.map(isEven);
	});


	it('native filter speed', function() {
		var list = list_1k.native.map(isEven);
	});

	it('native filter loop speed', function() {
		var list = list_1k.native;
		var newList = new Array(list.length)
		for (var i = 0; list.length > i; i++) {
			if (isEven(list[i]))
				newList[i] = list[i]
		}
	});
	it('lodash filter speed', function() {
		var list = list_1k.native;
		_.filter(list, isEven);
	});

});
