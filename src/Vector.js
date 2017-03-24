import librrbit from 'lib-rbbit';



function Vector(len) {
    this.length = len || 0;
}

var lib = Object.assign({}, librrbit);

lib.make = (len) => new Vector(len)

export function of(...values) {
    return values.length == 1 ? lib.appendǃ(values[0], lib.empty()) : from(values);
}

Vector.of = Vector.prototype.of = of;

export function from(iterable) {
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

Vector.from = Vector.prototype.from = from;

export function isVector(thing) {
    return thing instanceof Vector;
}

Vector.isVector = Vector.prototype.isVector = isVector;



var proto = Vector.prototype;

proto.empty = () => lib.empty()

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
    var index = -1;
    lib.iterator(0, this.length, this)
        .killableReduce((i, _value, abort) => 
            _value === value ? ((index = i) && abort() ) : i + 1
        , 0);

    return index;
};

proto.includes = function(value) {
   return this.indexOf(value) !== -1
}

proto.findIndex = function(fn) {
    var index = -1;
    lib.iterator(0, this.length, this)
        .killableReduce((i, _value, abort) => 
            fn(_value) ? ((index = i) && abort() ) : i + 1
        , 0);

    return index;
}

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
    return lib.appendAll(this, from(iterable));
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
// find
