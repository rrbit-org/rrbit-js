import {isList} from './_common';
import {isLinkedList} from './SinglyLinkedList'

function isIterable(maybe) {
	return maybe && typeof maybe[Symbol.iterator] == 'function'
}


function last(fn) {
	if (typeof fn == 'function')
		return new Last(fn);
	return fn;
}

class Last { // ending step
	constructor(fn) {
		this.stepFn = fn
	}
	init() {}

	step(result, input) {
		return this.stepFn(result, input)
	}

	result(result) {
		return result
	}
}


function Reduced(value) {
	this.value = value;
	this.isReduced = true;
}

function isReduced(x) {
	return x instanceof Reduced
}

function toReduced(x) {
	return isReduced(x) ? x : new Reduced(x);
}

function toValue(x) {
	return isReduced(x) ? x.value : x
}


function compose(a,b,c,d,e,f,g,h,i,j) {
	switch(arguments.length) {
		case 2: return (...args) => a(b(...args));
		case 3: return (...args) => a(b(c(...args)));
		case 4: return (...args) => a(b(c(d(...args))));
		case 5: return (...args) => a(b(c(d(e(...args)))));
		case 6: return (...args) => a(b(c(d(e(f(...args))))));
		case 7: return (...args) => a(b(c(d(e(f(g(...args)))))));
		case 8: return (...args) => a(b(c(d(e(f(g(h(...args))))))));
		case 9: return (...args) => a(b(c(d(e(f(g(h(i(...args)))))))));
		case 10:return (...args) => a(b(c(d(e(f(g(h(i(j(...args))))))))));
	}
	var args = Array.prototype.slice.call(arguments).reverse();
	return args.reduce((f, func) => (value) => f(fn(value)), args.shift())
}

const and = (a, b) => (value) => a(value) && b(value)


class ITransformer {
	init() {
		return this.xf.init()
	}
	step(result, value) {
		return value;
	}
	result(result) {
		return this.xf.result(result)
	}

}
class PassThru extends ITransformer { //middle step
	constructor(xf) {
		super();
		this.xf = xf;
	}
	step(result, value) {
		return this.xf.step(result)
	}
}

const passThru = () => (next) => new PassThru(next)

class Mapper extends ITransformer {
	static create(fn) {
		return (next) => new Mapper(fn, next)
	}
	constructor(fn, xf) {
		super();
		this.fn = fn;
		this.xf = xf;
		// if (xf instanceof Mapper) {
		// 	this.xf = xf.xf;
		// 	this.fn = combine(xf.fn, fn);
		// }
	}
	step(result, value) {
		return this.xf.step(result, this.fn(value))
	}
}
const map = Mapper.create

class Filter extends ITransformer {
	static create(predicate) {
		return (next) => new Filter(predicate, next)
	}
	constructor(predicate, xf) {
		super();
		this.predicate = predicate;
		this.xf = xf;
		// optimize by combining filters
		// if (xf instanceof Filter) {
		// 	this.predicate = and(predicate, xf.predicate)
		// 	this.xf = xf.xf
		// }
	}
	step(result, value) {
		return this.predicate(value) ? this.xf.step(result, value) : result
	}
}
const filter = Filter.create

class Scan extends ITransformer {
	static create(fn, seed) {
		return (next) => new Scan(fn, seed, next)
	}
	constructor(fn, seed, xf) {
		super();
		this.fn = fn;
		this.seed = seed;
		this.xf = xf;
	}
	step(result, value) {
		this.seed = this.fn(this.seed, value)
		return this.xf.step(result, this.seed)
	}
}
const scan = Scan.create

class Take extends ITransformer {
	static create(n) {
		return (next) => new Take(n, next)
	}
	constructor(fn, xf) {
		super();
		this.fn = fn;
		this.xf = xf;
	}
	step(result, value) {
		return this.n-- > 0 ? this.xf.step(result, value) : toReduced(result)
	}
}
const take = Take.create

class TakeWhile extends ITransformer {
	static create(predicate) {
		return (next) => new TakeWhile(predicate, next)
	}
	constructor(predicate, xf) {
		super();
		this.fn = predicate;
		this.xf = xf;
	}
	step(result, value) {
		return this.fn(value) ? this.xf.step(result, value) : toReduced(result)
	}
}
const takeWhile = TakeWhile.create

class Drop extends ITransformer {
	static create(n) {
		return (next) => new Drop(n, next)
	}
	constructor(n, xf) {
		super();
		this.n = n;
		this.xf = xf;
	}
	step(result, value) {
		return this.n-- > 0 ? result : this.xf.step(result, value);
	}
}
const drop = Drop.create

class DropWhile extends ITransformer {
	static create(predicate) {
		return (next) => new DropWhile(predicate, next)
	}
	constructor(predicate, xf) {
		super();
		this.fn = predicate;
		this.xf = xf;
		this.isDropping = true;
	}
	step(result, value) {
		if (this.isDropping) {
			if (this.fn(value))
				return result;
			this.isDropping = false
		}
		return this.xf.step(result, value);
	}
}
const dropWhile = DropWhile.create

class Intersperse extends ITransformer {
	static create(separator) {
		return (next) => new Intersperse(separator, next)
	}
	constructor(separator, xf) {
		super();
		this.sep = separator;
		this.first = true;
		this.xf = xf;
	}
	step(result, value) {
		if (this.first) {
			this.first = false;
			return this.xf.step(result, value)
		}
		var next = this.xf.step(result, this.sep);
		return isReduced(next) ? next : this.xf.step(next, value)
	}
}
const intersperse = Intersperse.create;

class PartitionBy extends ITransformer {
	static create(fn) {
		return (next) => new PartitionBy(fn, next)
	}
	constructor(fn, xf) {
		super();
		this.fn = fn;
		this.xf = xf;
		this.group = [];
		this.previous = void 0;
	}
	step(result, value) {
		if (this.previous === this.fn(value)) {
			this.group.push(value)
		} else {
			var group = this.group = [];
			result = this.xf.step(result, group);
			if(!isReduced(result)) {
				group.push(value)
			}
		}
		return result
	}
	result(result) {
		var group = this.group;
		if(group && group.length) {
			this.group = [];
			result = this.xf.step(result, group)
		}
		return this.xf.result(result)
	}
}

const partitionBy = PartitionBy.create;

class MapCat extends ITransformer {
	create(fn) {
		return (next) => new MapCat(fn, next);
	}
	constructor(fn, xf) {
		super();
		this.fn = fn;
		this.xf = xf;
		this.seq = Sequence.of(null); //create once to reduce step speed
		// this.nextStep = this.xf.step.bind(this.xf.step); // could conflict with map/filter
	}
	step(result, value) {
		return (this.seq
				.setup(value)
				.reduce(this.xf.step.bind(this.xf.step), result));
	}
}

const mapCat = MapCat.create;

class Keep extends ITransformer {
	static create(fn) {
		return (next) => new Keep(fn, next)
	}
	constructor(fn, xf) {
		super();
		this.fn = fn;
		this.xf = xf;
	}
	step(result, value) {
		return this.f(value) ? result : this.xf.step(result, value);
	}
}
const keep = Keep.create;

class Unique extends ITransformer {
	/**
	 *
	 * @param {function=} fn - optional normalizer function
	 * @return {function(ITransformer): Unique}
	 */
	static create(fn) {
		return (next) => new Unique(fn, next)
	}
	constructor(fn, xf){
		super();
		this.seen = [];
		this.fn = fn || (x => x);
		this.xf = xf;
	}
	step(result, input){
		var computed = this.fn(input);
		if (this.seen.includes(computed)){
			this.seen.push(computed);
			return this.xf.step(result, input);
		}
		return result;
	}
}
const unique = Unique.create

class KeepIndexed extends ITransformer {
	static create(fn) {
		return (next) => new KeepIndexed(fn, next)
	}
	constructor(fn, xf) {
		super();
		this.fn = fn;
		this.i = -1;
		this.xf = xf;
	}
	step(result, value) {
		this.i++;
		return this.f(this.i, value) ? result : this.xf.step(result, value);
	}
}
const keepIndexed = KeepIndexed.create;


function transduce(collection, xf, iterator, seed) {
	if (!xf)
		xf = passThru();

	xf = xf(last(iterator)); //populate wf chain with final destination reducer
	
	var result = Sequence.of(collection)
						.reduce(xf.step.bind(xf), seed === undefined ? xf.init() : seed);

	return toValue(xf.result(toValue(result)));
}




class Sequence {

	static of(list) {
		return Sequence.isSequence(list) ? list : new Sequence(list)
	}
	static from(...collections) {
		return ReSequence.of(collections)
	}

	static isCollection(maybe) {
		return maybe && (
			isList(maybe) ||
			Array.isArray(maybe) ||
			isIterable(maybe) ||
			isLinkedList(maybe) ||
			Sequence.isSequence(maybe))
	}
	static isSequence(maybe) {
		return maybe instanceof Sequence
	}

	constructor(list) {
		this.setup(list);
	}
	setup(list) {
		this.list = list;

		if (isList(list)) {
			this.type = 'Vector';
		} else if (Array.isArray(list)) {
			this.type = 'Array';
		} else if (isLinkedList(list)) {
			this.type = 'LinkedList';
		} else if (Sequence.isSequence(list)) {
			this.type = "Sequence"
		} else if (ReSequence.isReSequence(list)) {
			this.type = "Sequence"
		} else if (typeof list['@@transducer/reduce'] == 'function') {
			//
		} else if (typeof list == 'string') {
			this.type = "Unknown"
		} else if (isIterable(list)) {
			this.type = 'Iterable';
		} else {
			this.type = "Single"
		}
	}


	reduce(fn, seed) {
		return this['reduce' + this.type](fn, seed, this.list);
	}

	reduceSingle(fn, seed) {
		return fn(seed, this.list);
	}

	reduceArray(fn, seed, array) {
		for (var i = 0, len = array.length; len > i; i++) {
			seed = fn(seed, array[i]);
			if (isReduced(seed))
				return seed;
		}
		return seed
	}

	reduceVector(fn, seed, vector) {
		vector.iterator().find((value) =>
			isReduced((seed = fn(seed, value))));
		return seed
	}

	reduceBuilder(fn, seed, builder) {

		return seed
	}

	reduceLinkedList(fn, seed, list) {
		while (list) {
			seed = fn(seed, list.data);
			if (isReduced(seed))
				return seed;

			list = list.next;
		}
		return seed;
	}

	reduceIterable(fn, seed, iterable) {
		var it = iterable[Symbol.iterator]();
		var x = it.next();
		while (!(x = it.next()).done) {
			seed = fn(seed, x.value);

			if (isReduced(seed))
				return seed;
		}
		return seed;
	}

	reduceSequence(fn, seed, seq) {
		return seq.reduce(fn, seed)
	}

	reduceUnknown() {
		throw new TypeError("unknown collection type, cannot reduce");
	}
}

class ReSequence {
	/**
	 * 
	 * @param {Array} collections
	 * @return {ReSequence}
	 */
	static of(collections) {
		return new ReSequence(collections || [])
	}
	static isReSequence(maybe) {
		return maybe instanceof ReSequence
	}
	constructor(...collections) {
		this.type = 'ReSequence'
		this.sequences = collections.map(collection => Sequence.of(collection))
	}
	add(collection) {
		this.sequences.push(Sequence.of(collection))
	}
	pre(collection) {
		this.sequences.unshift(Sequence.of(collection))
	}
	reduce(fn, seed) {
		var seqs = this.sequences;
		for (var i = 0, len = seqs.length; len > i; i++) {
			seed = seqs[i].reduce(fn, seed)
			if (isReduced(seed))
				return seed
		}
		return seed
	}
}

export {
	transduce,
	compose,
	take,
	takeWhile,
	drop,
	dropWhile,
	keep,
	keepIndexed,
	unique,
	intersperse,
	partitionBy,
	mapCat,
	filter,
	map,
	passThru,
	scan,
	Sequence,
	ReSequence,
	isReduced,
	toReduced,
	toValue

}