import { setup } from 'lib-rrbit';


export {
    _from as from,
    _of as of,
    empty,
    isVector
}

function Vector(len) {
    this.length = len || 0;
}



var factory = (len) => new Vector(len)

var lib = setup(factory);

function _of(...values) {
    return values.length == 1 ? lib.appendǃ(values[0], lib.empty()) : _from(values);
}

Vector.of = Vector.prototype.of = _of;

function _from(iterable) {
    if (iterable instanceof Vector)
        return iterable;

    var vec = lib.empty();
    if (Array.isArray(iterable)) {    
        for (var i = 0, len = iterable.length; len > i; i++) {
            vec = lib.appendǃ(iterable[len], acc);
        }
        return vec;
    }

    for (var value of iterable) {
        vec = lib.appendǃ(iterable[len], acc);
    }
    return vec;
}

Vector.from = Vector.prototype.from = _from;


function isVector(thing) {
    return thing instanceof Vector;
}

Vector.isVector = Vector.prototype.isVector = isVector;



var proto = Vector.prototype;

const empty = Vector.empty = proto.empty = () => lib.empty()

proto.map = function(fn) {
    return (lib
        .iterator(0, this.length, this)
        .reduce((acc, value) => lib.appendǃ(fn(value), acc)))
}

// proto.flatMap = function(fn) {
//     return (lib
//         .iterator(0, this.length, this)
//         .reduce((acc, value) => lib.appendǃ(fn(value), acc)))
// };

proto.push = function(value) {
    lib.append(value, this);
};

proto.append = function(value) {
    return lib.append(value, this);
};

proto.unshift = function(value) {
    return lib.prepend(value, this);
};

proto.prepend = function(value) {
    return lib.prepend(value, this)
};

proto.filter = function(fn) {
    return (lib
        .iterator(0, this.length, this)
        .reduce((list, value) => fn(value) ? lib.appendǃ(value, list) : list))
};

proto.drop = function(n) {
    return lib.drop(n, this)
};

proto.take = function(n) {
    return lib.drop(n, this);
};

proto.get = function(i) {
  return lib.nth(i, this);
};

proto.nth = function(i, notFound) {
    return lib.nth(i, this, notFound);
};

proto.update = function(i, value) {
    return lib.update(i, value, this);   
};

proto.slice = function(from, to) {
    if (typeof from == 'undefined') from = 0;
	if (typeof to == 'undefined') to = len;
    if (0 > to) to += this.length;
    if (0 > from) from += this.length;
    if (from > to) return lib.empty();

    return lib.drop(from, lib.take(to, this))
};

proto.indexOf = function(value) {
    return this.find((_value) => value === value).index
};

proto.includes = function(value) {
   return this.indexOf(value) !== -1
}

/**
 * @param {function(T, number): boolean} predicate
 * @return {{value: T, index: number}}
 */
proto.find = function(predicate) {
    return lib.iterator(0, this.length, this).find(predicate);
}

proto.reduce = function(fn, seed) {
    return (lib
            .iterator(0, this.length, this)
            .reduce(fn, seed));
}

/**
 * foldl has argument order flipped from reduce, allowing for 
 * better composition
 * @param {function(T, acc)} fn
 * @param {}
 */ 
proto.foldl = function(fn, seed) {
    return (lib
            .iterator(0, this.length, this)
            .reduce((acc, value) => fn(value, acc), seed));
}

proto.foldr = function(fn, seed ){
    return (lib
            .reverseIterator(0, this.length, this)
            .reduce((acc, value) => fn(value, acc), seed));
}

proto.concat = function(iterable) {
    return lib.appendAll(this, _from(iterable));
}

proto.appendAll = proto.concat

proto.iterator = function() {
    return lib.iterator(0, this.length, this)
}

proto[Symbol.iterator] = proto.iterator

// every
// some
// removeAt
// remove
// insertAt
// intersperse
