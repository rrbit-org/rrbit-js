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



proto.append = function (singleValue) {

	rrbit.appendǃ((this.accumulator || (this.accumulator = rrbit.empty())), singleValue)
	return this;
}

proto.appendAll = function(collection) {
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








proto.prepend = function(item) {
    this.pre = LinkedList.of(item, this.pre);
}


// = lazy operations ========================================================
function addToPipe(xf, pipe) {
	return !pipe ? xf : compose(xf, pipe);
}
proto.filter = function(fn) {
    this.pipe = addToPipe(filter(fn), this.pipe)
}
proto.drop = function(n) {
	this.pipe = addToPipe(drop(n), this.pipe)
}
proto.dropWhile = function(fn) {
	this.pipe = addToPipe(dropWhile(fn), this.pipe)
}
proto.take = function(nn) {
	this.pipe = addToPipe(take(n), this.pipe)
}
proto.takeWhile = function(fn) {
	this.pipe = addToPipe(takeWhile(fn), this.pipe)
}
proto.map = function(fn) {
	this.pipe = addToPipe(map(fn), this.pipe)
}
// proto.cat = () => {}
// proto.mapcat = () => {}
// proto.flatten = function(fn) {
// 	this.pipe = addToPipe(filter(fn), this.pipe)
// }
proto.scan = function(fn, seed) {
	this.pipe = addToPipe(scan(fn, seed), this.pipe)
}
proto.unique = function(fn) {
	this.pipe = addToPipe(unique(fn), this.pipe)
}
proto.intersperse = function(separator) {
	this.pipe = addToPipe(intersperse(separator), this.pipe)
}



// = terminators =============================================================

//to collection

// proto.toSet = () => {}
proto.into = function(reducer, seed) {
	if (this.pre) {
		this.sequences.pre(this.pre)
		this.pre = null
	}
	return transduce(this.sequences, this.pipe, reducer, seed)
}

proto.toList = function() {
    const intoVector = (list, item) => rrbit.appendǃ(item, list);
    
	return this.into(intoVector, rrbit.empty())
}

proto.toArray = function() {
	const intoArray = (list, item) => list.push(item);
	
	return this.into(intoArray, [])
}

//to string
proto.join = (separator) => {
    if (separator) {
        this.intersperse(separator)
    }
	return this.into((prev, next) => prev + next, "")
}

//to boolean
proto.any = function(predicate) {
	this.into((prev, next) => prev || predicate(next), false)
}
proto.all = function(predicate) {
	this.into((prev, next) => prev && predicate(next), true)
}


export {
	Builder,
	isBuilder,
	Sequence
}