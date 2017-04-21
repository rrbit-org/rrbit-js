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

const addOne = value => value + 1

describe('map 1k comparison', function() {

	it('mori map speed', function() {
		var list = mori.map(addOne, list_1k.mori)
	});

	it('immutable map speed', function() {
		var list = list_1k.imm.map(addOne)
	});

	it('rrbit map speed', function() {
		var list = list_1k.cass.map(addOne);
	});


	it('native map speed', function() {
		var list = list_1k.native.map(addOne);
	});

	it('native simple loop speed', function() {
		var list = list_1k.native;
		var newList = new Array(list.length)
		for (var i = 0; list.length > i; i++) {
			newList[i] = addOne(list[i]);
		}
	});
	it('lodash map speed', function() {
		var list = list_1k.native;
		_.map(list, addOne);
	});

});
