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
	reduce,
	reduceRight,
	find,
	iterator,
	reverseIterator} = rrbit;
import {Maybe} from './Maybe'



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
	var lib = {
		fn,
		add: appendǃ,
		step(list, value) {
			return this.add(this.fn(value), list)
		}
	};

	return this.reduce(lib.step.bind(lib), this.empty());
}

proto.append = proto.push = function(value) {
    return append(value, this);
};

proto.prepend = proto.unshift = function(value) {
	return prepend(value, this)
};

proto.filter = function(predicate) {
	var lib = {
		predicate,
		add: appendǃ,
		step(list, value) {
			return this.predicate(value) ? this.add(value, list) : list
		}
	};
	
	return this.reduce(lib.step.bind(lib), this.empty());
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

/**
 * legacy get, to make things easy for beginners to lean
 * @param {number} i
 * @param notFound
 */
proto.get = function(i, notFound) {
  return nth(i, this, notFound);
};


/**
 *
 * @param i
 * @returns {Maybe}
 */
proto.nth = function(i) {
	return Maybe.of(nth(i, this, Maybe.Nothing()));
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
    return find(predicate, this);
}

proto._reduceHelper = reduce;
proto.reduce = function(fn, seed) {
    return this._reduceHelper(fn, seed, this);
}

proto.reduceRight = function(fn, seed) {
	return reduceRight(fn, seed, this);
}

/**
 * foldl has argument order flipped from reduce, allowing for 
 * better composition
 * @param {function(T, acc)} fn
 * @param {}
 */ 
proto.foldl = function(fn, seed) {
    return this.reduce((acc, value) => fn(value, acc), seed);
}

proto.foldr = function(fn, seed ) {
    return this.reduceRight((acc, value) => fn(value, acc), seed);
}

proto.appendAll = proto.concat = function(iterable) {

	if (isList(iterable)) {
		return appendAll(this, iterable)
	}
	
	var lib = {
		add: append
		, step(list, value) {
			return this.add(value, list)
		}
	}
	
	return Sequence.of(iterable).reduce(lib.step.bind(lib), this)
}



// proto.reverseIterator = function(from, to) {
// 	return reverseIterator(from || 0, to || this.length, this);
// }

// proto[Symbol.iterator] = proto.iterator = function(from, to) {
// 	return iterator(from || 0, to || this.length, this)
// }

// every
proto.every = function(predicate) {
    return find(value => !predicate(value), this).index == -1;
}

proto.some = function(predicate) {
    return find(predicate, this).index !== -1;
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
	var add = appendǃ;
	for (var i = 0; n > i; i++) {
		vec = add(fn(i), vec);
	}
	return vec;
}
List.times = proto.times = times;

function range(start, end) {
	return times(end - start, i => i + start)
}
List.range = proto.range = range;



proto.intersperse = function(separator) {
	if(this.length < 2) return this;
	var lib = {
		add: appendǃ,
		separator,
		FIRST: {},
		step(acc, value) {
			if (acc === this.FIRST) {
				return this.add(value, empty())
			}
			return this.add(value, this.add(this.separator, acc))
		}
	};

	return this.reduce(lib.step.bind(lib), lib.FIRST);
}

proto.join = function(separator) {
	if (this.length == 0) return "";
	if (this.length == 1) return "" + this.get(0);

	var lib = {
		add: appendǃ,
		separator,
		FIRST: {},
		step(acc, value) {
			if (acc === this.FIRST) {
				return value + ""
			}
			return acc + this.separator + value;
		}
	};

	return this.reduce(lib.step.bind(lib), lib.FIRST);
}

proto.flatten = function() {
	return this.flatMap(x => x)
}

proto.sort = function() {
	return this.sortWith(naturalSort)
}

proto.sortWith = function(fn) {
	return _fromArray(this.reduce((arr, value) => arr.push(value), []).sort(fn))
}

/*
 * Natural Sort algorithm for Javascript - Version 0.7 - Released under MIT license
 * Author: Jim Palmer (based on chunking idea from Dave Koelle)
 */
function naturalSort (a, b) {
	"use strict";
	var re = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
		sre = /(^[ ]*|[ ]*$)/g,
		dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
		hre = /^0x[0-9a-f]+$/i,
		ore = /^0/,
		i = function(s) { return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s; },
		// convert all to strings strip whitespace
		x = i(a).replace(sre, '') || '',
		y = i(b).replace(sre, '') || '',
		// chunk/tokenize
		xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
		yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
		// numeric, hex or date detection
		xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
		yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
		oFxNcL, oFyNcL;
	// first try and sort Hex codes or Dates
	if (yD) {
		if ( xD < yD ) { return -1; }
		else if ( xD > yD ) { return 1; }
	}
	// natural sorting through split numeric strings and default strings
	for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
		// find floats not starting with '0', string or 0 if not defined (Clint Priest)
		oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
		oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
		// handle numeric vs string comparison - number < string - (Kyle Adams)
		if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
		// rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
		else if (typeof oFxNcL !== typeof oFyNcL) {
			oFxNcL += '';
			oFyNcL += '';
		}
		if (oFxNcL < oFyNcL) { return -1; }
		if (oFxNcL > oFyNcL) { return 1; }
	}
	return 0;
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

proto.traverse = function(fn, of) {
	this.reduce((list, next) =>
		of(next).map(x => y => y.concat([x])).ap(list), fn(this.empty()))

	const prepend = x => xs => [x].concat(xs)

	var applicative = of([]);
	this.reduceRight((applicative, value) => {
		ap(map(prepend, fn(value)), applicative)
	}, of(this.empty()))

	return applicative;
};

proto.sequence = function(of) {
	this.traverse(of, x => x)
}

/**
 * Setoid

 a.equals(a) === true (reflexivity)
 a.equals(b) === b.equals(a) (symmetry)
 If a.equals(b) and b.equals(c), then a.equals(c) (transitivity)
 equals method

 equals :: Setoid a => a ~> a -> Boolean
 A value which has a Setoid must provide an equals method. The equals method takes one argument:

 a.equals(b)
 b must be a value of the same Setoid

 If b is not the same Setoid, behaviour of equals is unspecified (returning false is recommended).
 equals must return a boolean (true or false).
 *
 */

// SameValue algorithm and polyfill
const is = Object.is || ((x, y) =>
		( x === y ? (x !== 0 || 1 / x === 1 / y) : (x !== x && y !== y)));

function equiv(kompare, compare) {
	if (kompare === null || kompare === undefined) return false;
	if(is(kompare, compare)) return true;
	if(typeof kompare.equals == 'function') return kompare.equals(compare);
	return false;
}

proto.equals = function(b) {
	var a = this;
	if (is(a, b))
		return true;

	// b must have to same value as a but, if b is not of the same type as a, behavior is unspecified :/
	// TODO: do we want to be able to compare against a native array?
	if (b === null || b === undefined || !isList(b) || a.length !== b.length)
		return false;

	//todo: we should optimize this if possible(e.g. clojure has some ideas about caching a hash here)
	return this.find((value, i) => !equiv(value, b.get(i)), b).index == -1
};

export {
	List
}