// import {
// 	Sequence,
// 	ReSequence,
// 	transduce,
// 	compose,
// 	take,
// 	takeWhile,
// 	drop,
// 	dropWhile,
// 	keep,
// 	keepIndexed,
// 	unique,
// 	intersperse,
// 	filter,
// 	map,
// 	scan
// } from './transduce'
//
import {List, Sequence} from '../src/index'


test('canary in the coalmine', () => {
	expect(true).toBe(true);


	var seq = Sequence.of(['one','two', 'three'])
	expect(seq).toBeTruthy()
	
	var str = seq.reduce((a, b) => a + b, "")
	expect(str).toEqual("onetwothree")
});


test.skip("map", () => {
	var vec = List.range(0, 100)

	var xf = map((v) => v + 1);

	var _intoList = (list, item) => list.append(item)

	var mapped = transduce(vec, xf, _intoList, List.empty())

	for (var i = 0, len = mapped.length; len > i; i++) {
		expect(mapped.get(i)).toEqual(i + 1)
	}

	expect(mapped.length).toEqual(100)
})