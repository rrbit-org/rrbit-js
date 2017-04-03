import {List, isList, rrbit, identity} from './_common'
import {Builder, Sequence} from './Builder'
const {
	nth,
	drop,
	take,
	update,
	append,
	appendǃ,
	prepend,
	appendAll,
	empty,
	iterator,
	reverseIterator} = rrbit;



List.empty = empty;
List.isList = List.prototype.isList = isList;


function _of(...values) {
    return values.length == 1 ? append(values[0], empty()) : _from(values);
}

List.of = List.prototype.of = _of;
List.Builder = List.prototype.Builder = Builder;
List.prototype.toBuilder = function() {
	return Builder().addAll(this)
}

function _from(collection) {
    if (isList(collection))
        return collection;

    if (Array.isArray(collection)) {
        return _fromArray(collection);
    }

    if (typeof collection.reduce == 'function') {
    	// let's assume that reducing is usually
		// faster than an iterator, since there's no object creation
		return collection.reduce((list, value) => appendǃ(value, list), empty())
	}

    if (typeof collection[Symbol.iterator] == 'function') {
		return _fromIterable(collection);
    }
    return empty();
}

function _fromArray(array) {
	var vec = empty();
	for (var i = 0, len = array.length; len > i; i++) {
		vec = appendǃ(array[len], vec);
	}
	return vec;
}

function _fromIterable(iterable) {
	var vec = empty();
	var it = iterable[Symbol.iterator]();
	var x = it.next();
	while (!(x = it.next()).done) {
		vec = appendǃ(x.value, vec);
	}
	return vec;
}

List.from = List.prototype.from = _from;





var proto = List.prototype;
proto.empty = empty;


/**
 * fantasyland compatible (1 argument) map
 * @param {function(T): U} fn
 * @return {List<U>}
 */
proto.map = function(fn) {

    return (this.reduce((acc, value) =>
					appendǃ(fn(value), acc), empty()));
}

proto.append = proto.push = function(value) {
    return append(value, this);
};

proto.prepend = proto.unshift = function(value) {
	//rrbit#prepend is a little cranky right now
	// better to be accurate than fast
    // return prepend(value, this);
	
	return this.of(value).appendAll(this);
};

proto.filter = function(fn) {
    return this.reduce((list, value) =>
		fn(value) ? append(value, list) : list, empty());
};

/**
 * drop first n items, keeping the remaining
 * @param n
 */
proto.drop = function(n) {
    return drop(n, this);
};

/**
 * keep first n item, dropping the remaining
 * @param n
 */
proto.take = function(n) {
    return take(n, this);
};

proto.nth = proto.get = function(i, notFound) {
  return nth(i, this, notFound);
};

// conventions seem to dictate this be named 'set'
// but update seems more semantically correct. 
// need to track community demand...
proto.update = function(i, value) {
    return update(i, value, this);
};

proto.slice = function(from, to) {
    if (typeof from == 'undefined') from = 0;
	if (typeof to == 'undefined') to = this.length;
    if (0 > to) to += this.length;
    if (0 > from) from += this.length;
    if (from > to) return empty();

    return this.take(to).drop(from);
};

proto.indexOf = function(value) {
    return this.find((_value) => _value === value).index
};

proto.includes = function(value) {
   return this.indexOf(value) !== -1
}

/**
 * @param {function(T, number): boolean} predicate
 * @return {{value: T, index: number}}
 */
proto.find = function(predicate) {
    return this.iterator().find(predicate);
}

proto.reduce = function(fn, seed) {
    return iterator(0, this.length, this).reduce(fn, seed);
}

proto.reduceRight = function(fn, seed) {
	return reverseIterator(0, this.length, this).reduce(fn, seed);
}

/**
 * foldl has argument order flipped from reduce, allowing for 
 * better composition
 * @param {function(T, acc)} fn
 * @param {}
 */ 
proto.foldl = function(fn, seed) {
    return (iterator(0, this.length, this)
            .reduce((acc, value) => fn(value, acc), seed));
}

proto.foldr = function(fn, seed ){
    return (reverseIterator(0, this.length, this)
            .reduce((acc, value) => fn(value, acc), seed));
}

proto.appendAll = proto.concat = function(iterable) {
	// rrbit#appendAll seems to be cranky, so we'll do a full copy
	// until lib-rrbit get's better
	// return appendAll(this, _from(iterable));
	
	var addIn = (list, value) => appendǃ(value, list);
	var vec = this.reduce(addIn, empty());
	
	return Sequence.of(iterable).reduce(addIn, vec)
    
}



proto.reverseIterator = function(from, to) {
	return reverseIterator(from || 0, to || this.length, this);
}

proto[Symbol.iterator] = proto.iterator = function(from, to) {
	return iterator(from || 0, to || this.length, this)
}

// every
proto.every = function(predicate) {
    return this.find(value => !predicate(value)).index == -1;
}

proto.some = function(predicate) {
    return this.find(predicate).index !== -1;
}

proto.removeAt = function(i) {
	return this.take(i).appendAll(this.drop(i + 1));
}

proto.remove = function(value) {
    var i = this.find(val => val === value).index;
	return i === -1 ? this : this.removeAt(i, value);

}

proto.insertAt = function(i, value) {
    return (this.take(i)
                .append(value)
                .appendAll(this.drop(i)));
}

function times(n, fn) {
	var vec = empty();
	for (var i = 0; n > i; i++) {
		vec = appendǃ(fn(i), vec);
	}
	return vec;
}
List.times = proto.times = times;

function range(start, end) {
	return times(end - start, i => i + start)
}
List.range = proto.range = range;



proto.intersperse = function(separator) {
	return (this.length < 2) ? 
		this : 
		this.iterator(1, this.length)
			.reduce((acc, value) =>
				appendǃ(separator, append(value, acc)), appendǃ(this.nth(0), empty()));
}

proto.join = function(separator) {
	if (this.length == 0) return "";
	if (this.length == 1) return "" + this.nth(0);
	return (this.iterator(1, this.length)
				.reduce((acc, value) => 
						acc + separator + value, "" + this.nth(0)))
}

proto.flatten = function() {
	return this.flatMap(x => x)
}


// = fantasyland compliance ========================================================

/**
 *
 * Apply

 A value that implements the Apply specification must also implement the Functor specification.

 v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)
 ap method

 ap :: Apply f => f a ~> f (a -> b) -> f b
 A value which has an Apply must provide an ap method. The ap method takes one argument:

 a.ap(b)
 b must be an Apply of a function,

 If b does not represent a function, the behaviour of ap is unspecified.
 a must be an Apply of any value

 ap must apply the function in Apply b to the value in Apply a

 No parts of return value of that function should be checked.



 Applicative

 A value that implements the Applicative specification must also implement the Apply specification.

 v.ap(A.of(x => x)) is equivalent to v (identity)
 A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
 A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)
 of method

 of :: Applicative f => a -> f a
 A value which has an Applicative must provide an of function on its type representative. The of function takes one argument:

 F.of(a)
 Given a value f, one can access its type representative via the constructor property:

 f.constructor.of(a)
 of must provide a value of the same Applicative

 No parts of a should be checked
 *
 */
proto.ap = function ap(values) {
	return this.map(fn => values.map(fn));
};


/**
 *
 * Chain

 A value that implements the Chain specification must also implement the Apply specification.

 m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g)) (associativity)
 chain method

 chain :: Chain m => m a ~> (a -> m b) -> m b
 A value which has a Chain must provide a chain method. The chain method takes one argument:

 m.chain(f)
 f must be a function which returns a value

 If f is not a function, the behaviour of chain is unspecified.
 f must return a value of the same Chain
 chain must return a value of the same Chain
 *
 */

proto.chain = proto.flatMap = function(fn) {
	function _addIn(list, value) {
		//case 1: value is function - TODO: NOT COVERED
		//case 2: value is collection/iterable
		//case 3: value is a primitive
		return (Sequence.isCollection(value) ?
					Sequence.of(value).reduce(_addIn, list) :
					appendǃ(fn(value), list))
	}

	return this.reduce(_addIn, empty())
};


// Functor -> List#map
// Monoid -> List#empty
// Semigroup -> List#concat
// Foldable -> List#reduce

proto.traverse = function(applic, of) {
	this.reduce((list, next) =>
		of(next).map(x => y => y.concat([x])).ap(list), applic(this.empty))
};

proto.sequence = function(of) {
	this.traverse(of, x => x)
}


export {
	List
}