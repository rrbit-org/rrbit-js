import * as List from './List'


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



test('map', () => {
	var vec = List.range(0, 1000)

	var doubled = vec.map(val => val + 1);

	for (var i = 0; 1000 > i; i++) {
		expect(doubled.nth(i)).toEqual(i + 1)
	}
});

test('filter', () => {
	var vec = List.range(0, 1000)

	var even = vec.filter(val => !(val % 2));
	expect(even.length).toEqual(500)

	for (var i = 0; 500 > i; i++) {
		expect(even.nth(i)).toEqual(i * 2)
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
		expect(vec2.nth(i, 'not found')).toEqual(i)
	}



});

test('drop', () => {
	var vec = List.range(0, 1000);

	var vec2 = vec.drop(500);
	expect(vec2.length).toEqual(500)

	for (var i = 0; 500 > i; i++) {
		expect(vec2.nth(i, 'not found')).toEqual(i + 500)
	}

});

test('removeAt', () => {
	var vec = List.range(0, 1000)

	var vec2 = vec.removeAt(500);
	expect(vec2.nth(499)).toEqual(499)
	expect(vec2.nth(500)).toEqual(501)
	expect(vec2.nth(501)).toEqual(502)
	expect(vec2.length).toEqual(999)
//
});


test('insertAt', () => {
	var vec = List.range(0, 1000)

	var vec2 = vec.insertAt(500, "findMe");
	expect(vec2.length).toEqual(1001, 'wrong length')
	expect(vec2.nth(499)).toEqual(499, 'wrong prev value')
	expect(vec2.nth(500)).toEqual('findMe', 'wring inserted value')
	expect(vec2.nth(501)).toEqual(500, 'wrong after value')
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