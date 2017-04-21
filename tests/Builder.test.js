import {List} from '../lib/index'
const Builder = List.Builder


test('basic construction', () => {
	var vec1k = List.range(0, 1000)
	var result = Builder()
		.appendAll(vec1k)
		.appendAll(vec1k)
		.appendAll(vec1k)
		.toList()

	expect(result.length).toEqual(3000)
})