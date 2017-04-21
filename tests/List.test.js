import {List} from '../src/index'
import fl from 'fantasy-land'
import * as Monad from 'fantasy-land/laws/monad'
import * as Traversable from 'fantasy-land/laws/traversable'

import expect from 'jest-matchers'


const aRange = len => Array.apply(0, Array(len)).map((_, i) => i);

test('canary in the coalmine', () => {
	expect(true).toBe(true);


	var vec = List.of('one')
	expect(vec).toBeTruthy()
});

test('push', () => {
	var vec = List.empty();
	expect(vec).toBeTruthy();
	expect(List.isList(vec)).toBeTruthy();

	for (var i = 0; 1000 > i; i++) {
		vec = vec.push(i)
	}

	expect(vec.length).toEqual(1000)
});

test('range', () => {
	var vec = List.range(0, 1000)

	expect(vec.length).toEqual(1000)
});

test('get', () => {
	var vec = List.range(0, 1000)

	for (var i = 0; 1000 > i; i++) {
		expect(vec.get(i)).toEqual(i)
	}
});

test('update', () => {
	var vec = List.range(0, 1000)

	vec = vec.update(500, "boo!");
	expect(vec.length).toEqual(1000);

	for (var i = 0; 1000 > i; i++) {
		if (i == 500)
			expect(vec.get(i)).toEqual('boo!')
		else
			expect(vec.get(i)).toEqual(i)
	}
});

test('prepend', () => {
	var vec = List.empty()
	var i = 1024
	while (i--) {

		vec = vec.prepend(i);
	}

	var NOT_FOUND = {notFound: true}

	for (var i = 0; 1024 > i; i++) {

		expect(vec.get(i, NOT_FOUND)).toEqual(i)
	}


	expect(vec.length).toEqual(1024);

});


test('map', () => {
	var vec = List.range(0, 1000)

	var doubled = vec.map(val => val + 1);

	for (var i = 0; 1000 > i; i++) {
		expect(doubled.get(i)).toEqual(i + 1)
	}
});

test.only('filter', () => {
	var vec = List.range(0, 1000)

	var even = vec.filter(val => !(val % 2));
	expect(even.length).toEqual(500)

	for (var i = 0; 500 > i; i++) {
		expect(even.get(i)).toEqual(i * 2)
	}
});

test('find', () => {
	var vec = List.range(0, 1000)

	var x = vec.find(val => val === 500)
	expect(x.value).toEqual(500)
	expect(x.index).toEqual(500)

	var i = vec.indexOf(500)
	expect(i).toEqual(500)
});

test('take', () => {
	var vec = List.range(0, 1000);

	var vec2 = vec.take(500);
	expect(vec2.length).toEqual(500)

	for (var i = 0; 500 > i; i++) {
		expect(vec2.get(i, 'not found')).toEqual(i)
	}



});

test('drop', () => {
	var vec = List.range(0, 1000);

	var vec2 = vec.drop(500);
	expect(vec2.length).toEqual(500)

	for (var i = 0; 500 > i; i++) {
		expect(vec2.get(i, 'not found')).toEqual(i + 500)
	}

});

test('removeAt / remove', () => {
	var vec = List.range(0, 1000)

	var vec2 = vec.removeAt(500);
	expect(vec2.get(499)).toEqual(499);
	expect(vec2.get(500)).toEqual(501);
	expect(vec2.get(501)).toEqual(502);
	expect(vec2.length).toEqual(999);

	var vec3 = vec.remove(500);
	expect(vec3.get(499)).toEqual(499);
	expect(vec3.get(500)).toEqual(501);
	expect(vec3.get(501)).toEqual(502);
	expect(vec3.length).toEqual(999);
//
});


test('insertAt', () => {
	var vec = List.range(0, 1000)

	var vec2 = vec.insertAt(500, "findMe");
	expect(vec2.length).toEqual(1001, 'wrong length')
	expect(vec2.get(499)).toEqual(499, 'wrong prev value')
	expect(vec2.get(500)).toEqual('findMe', 'wring inserted value')
	expect(vec2.get(501)).toEqual(500, 'wrong after value')
});

test('every', () => {
	var vec = List.range(0, 1000)

	expect(vec.every(val => val < 1001)).toEqual(true)
	expect(vec.every(val => val < 999)).toEqual(false)
});

test('some', () => {
	var vec = List.range(0, 1000)

	expect(vec.some(val => val < 1001)).toEqual(true)
	expect(vec.some(val => val < 999)).toEqual(true)
	expect(vec.some(val => val > 1001)).toEqual(false)
});

test('join', () => {
	var vec = List.range(0, 10)
	var str = vec.join('');
	expect(str).toEqual('0123456789')
});
test('intersperse', () => {
	var vec = List.range(0, 10);
	var str = "["+ vec.join(',') + "]";
	expect(str).toEqual('[0,1,2,3,4,5,6,7,8,9]')
});

test('flatten', () => {
	var arr = aRange(10);

	var vec = List.empty()
				.append(arr)
				.append(arr)
				.append(arr)
				.flatten();

	expect(vec.length).toEqual(30);
	var offset = 0;
	for (var i = 0, len = vec.length; len > i; i++) {
		if(i == 10) offset = 10;
		if(i == 20) offset = 20;
		expect(vec.get(i)).toEqual(i - offset);
	}
});

test('flatMap', () => {
	var arr = aRange(10);

	var vec = List.empty()
		.append(arr)
		.append(arr)
		.append(arr)
		.flatMap(x => x + 1);

	expect(vec.length).toEqual(30);
	var offset = 0;
	for (var i = 0, len = vec.length; len > i; i++) {
		if(i == 10) offset = 10;
		if(i == 20) offset = 20;
		expect(vec.get(i)).toEqual((i - offset) + 1);
	}
});

function assertSame (listA, ListB) {
	expect(listA.length).toEqual(listB.length, "lists not same length");

	listA.map((item, i) =>
		expect(item).toBe(listB.get(i)));

	return true
}

function setupFantasyAliases() {
	// fantasyland tests use the prefixed aliases(e.g. 'fantasyland/map' vs 'map')
	// even though the spec makes them optional
	List[fl.empty] = List.prototype[fl.empty] = List.prototype.empty
	List.prototype[fl.ap] = List.prototype.ap
	List.prototype[fl.chain] = List.prototype.chain
	List.prototype[fl.concat] = List.prototype.concat
	List.prototype[fl.map] = List.prototype.map
	List[fl.of] = List.prototype[fl.of] = List.prototype.of
	List.prototype[fl.reduce] = List.prototype.reduce
	List.prototype[fl.traverse] = List.prototype.traverse;
}

// test('traverse/sequence: composition', () => {
// 	var x = {}
// 	expect(Traversable.composition(List)(assertSame)(x)).toEqual(true);
// });

// test('traverse/sequence: naturality', () => {
// 	var x = List.of(1);
// 	var T = List
// 	var t = List.of;
// 	var eq = assertSame;
// 	setupFantasyAliases();
//
// 	expect(Traversable.naturality(T)(t)(eq)(x)).toEqual(true);
// });
test.skip('traverse/sequence: identity', () => {
	setupFantasyAliases()
	var x = List.of(1)
	var T = List
	var eq = assertSame
	expect(Traversable.identity(T)(eq)(x)).toEqual(true);
});
// test('foo', () => {
// 	expect(List.of([[1, 2], [3, 4]]).sequence().equals(List.of([[1, 3], [1, 4], [2, 3], [2, 4]]))).toEqual(true);
//
// 	expect(List.of([[1], [2], [3]]).sequence().equals(List.of([[1, 2, 3]]))).toEqual(true);
//
//
// 	expect(List.of([[1, 2], [3], [4]]).sequence().equals(List.of([[1, 3, 4], [2, 3, 4]]))).toEqual(true);
// })
//
// test('monad: leftIdentity', () => {
// 	var x = {}
// 	expect(Monad.leftIdentity(List, assertSame, x)).toEqual(true);
// })
//
// test('monad: rightIdentity', () => {
// 	var x = {}
// 	expect(Monad.rightIdentity(List, assertSame, x)).toEqual(true);
// })