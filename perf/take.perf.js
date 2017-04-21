import Immutable from 'immutable';
import mori from 'mori';
import {List} from '../src/index'


var lists = {
	fb: Immutable.Range(0, 1024),
	mr: mori.range(0, 1024),
	cs: List.range(0, 1024),
	nt: Array.apply(0, new Array(1024)).map((_, index) => index),

	fb2: Immutable.Range(0, 32768),
	mr2: mori.range(0, 32768),
	cs2: List.range(0, 32768),
	nt2: Array.apply(0, new Array(32768)).map((_, index) => index)
};

describe('take/slice comparisons', function() {
	// = 1024 ============================

	// it('native slice', function() {
	// 	var list = lists.nt;
	// 	var x = list.slice(0, list.length / 2);
	// });
	//
	// it('immutable-js take', function() {
	// 	var list = lists.fb;
	// 	var x = list.take(list.size / 2);
	// });
	//
	// it('mori take', function() {
	// 	var list = lists.mr;
	// 	var x = mori.take(mori.count(list), list);
	// });
	//
	// it('rrbit take', function() {
	// 	var list = lists.cs;
	// 	var x = list.take(list.length / 2);
	// });

	// = 32768 ============================

	it('immutable-js take 32768', function() {
		var x = lists.fb2.take(lists.fb2.size / 2)
	})

	it('mori take 32768', function() {
		var x = mori.take(mori.count(lists.mr2) / 2, lists.mr2)
	})

	it('rrbit take 32768', function() {
		var x = lists.cs2.take(lists.cs2.length / 2)
	})

	it('native slice 32768', function() {
		var x = lists.nt2.slice(0, lists.nt2.length / 2)
	})
});
