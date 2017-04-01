import * as LinkedList from './SinglyLinkedList';
import {Builder, isBuilder, rrbit} from './_common';
import {
	compose,
	transduce,
	take,
	takeWhile,
	drop,
	dropWhile,
	map,
	filter,
	scan,
	unique,
	intersperse,
	ReSequence,
	Sequence
} from './transduce'

/**
 * an iterator of iterators. Builders allow for higher performance
 * of transforms over multiple collections
 * operations are lazy
 */
var proto = Builder.prototype;
Builder.isBuilder = isBuilder



proto.push = proto.append = function (singleValue) {

	rrbit.appendǃ((this.accumulator || (this.accumulator = rrbit.empty())), singleValue)
	return this;
}

proto.concat = proto.appendAll = function(collection) {
	if (!this.sequences) {
		this.sequences = new ReSequence([]);

	}
	if (this.accumulator) {
		this.sequences.add(this.accumulator)
		this.accumulator = null;
	}
	this.sequences.add(collection);

	return this;
}








proto.unshift = proto.prepend = function(item) {
    this.pre = LinkedList.of(item, this.pre);
	return this;
}


// = lazy operations ========================================================
function addToPipe(xf, pipe) {
	return !pipe ? xf : compose(xf, pipe);
}
proto.filter = function(fn) {
    this.pipe = addToPipe(filter(fn), this.pipe)
	return this;
}
proto.drop = function(n) {
	this.pipe = addToPipe(drop(n), this.pipe)
	return this;
}
proto.dropWhile = function(fn) {
	this.pipe = addToPipe(dropWhile(fn), this.pipe)
	return this;
}
proto.take = function(nn) {
	this.pipe = addToPipe(take(n), this.pipe)
	return this;
}
proto.takeWhile = function(fn) {
	this.pipe = addToPipe(takeWhile(fn), this.pipe)
	return this;
}
proto.map = function(fn) {
	this.pipe = addToPipe(map(fn), this.pipe)
	return this;
}
// proto.cat = () => {}
// proto.mapcat = () => {}
// proto.flatten = function(fn) {
// 	this.pipe = addToPipe(filter(fn), this.pipe)
// }
proto.scan = function(fn, seed) {
	this.pipe = addToPipe(scan(fn, seed), this.pipe)
	return this;
}
proto.reduce = function(fn, seed) {
	if (this.pre) {
		this.sequences.pre(this.pre)
		this.pre = null
	}
	return transduce(this.sequences, this.pipe, fn, seed)
}
proto.unique = function(fn) {
	this.pipe = addToPipe(unique(fn), this.pipe)
	return this;
}
proto.intersperse = function(separator) {
	this.pipe = addToPipe(intersperse(separator), this.pipe)
	return this;
}



// = terminators =============================================================

//to collection

// proto.toSet = () => {}

proto.toList = function() {
    const intoVector = (list, item) => rrbit.appendǃ(item, list);
    
	return this.reduce(intoVector, rrbit.empty())
}

proto.toArray = function() {
	const intoArray = (list, item) => list.push(item);
	
	return this.reduce(intoArray, [])
}

//to string
proto.join = function(separator) {
    if (separator) {
        this.intersperse(separator)
    }
	return this.reduce((prev, next) => prev + next, "")
}

//to boolean
proto.some = function(predicate) {
	this.reduce((prev, next) => prev || predicate(next), false)
}
proto.every = function(predicate) {
	this.reduce((prev, next) => prev && predicate(next), true)
}


export {
	Builder,
	isBuilder,
	Sequence
}