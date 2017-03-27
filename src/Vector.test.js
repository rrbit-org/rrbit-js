import {empty, of as one} from './Vector'


test('canary in the coalmine', () => {
	expect(true).toBe(true);


	var vec = one('one')
});

test('push', () => {
	var vec = empty()

	for (var i = 0; 1000 > i; i++) {
		vec = vec.append(i)
	}

	expect(vec.length).toEqual(1000)
});

test('get', () => {
	var vec = empty()

	for (var i = 0; 1000 > i; i++) {
		vec = vec.append(i)
	}

	expect(vec.length).toEqual(1000)

	for (var i = 0; 1000 > i; i++) {
		expect(vec.get(i)).toEqual(i)
	}
});