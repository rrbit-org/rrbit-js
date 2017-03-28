import {isLinkedList} from './SinglyLinkedList';
import {isList} from '../_common'

function _isIterable(maybe) {
	return maybe && typeof maybe[Symbol.iterator] == 'function'
}

export function of(list) {
    return new SequenceRunner(list);
}

export function isSeqable(maybe) {

	return maybe && (isList(maybe) || Array.isArray(maybe) || _isIterable(maybe))
}

function SequenceRunner(list) {
    if (isList(list)) {
        this.type = 'Vector';
    } else if (Array.isArray) {
        this.type = 'Array';
    } else if (isLinkedList(list)) {
        this.type = 'LinkedList';
    } else {
        this.type = 'Iterable';
    }

    this.list = list
}

SequenceRunner.prototype.reduce = function(fn, seed) {
    return this['reduce' + this.type](fn, seed, this.list);
}

SequenceRunner.prototype.reduceArray = function(fn, seed, array) {
    for (var i = 0, len = array.length; len > i; i++) {
        seed = fn(seed, array[i]);
    }
    return seed;
};

SequenceRunner.prototype.reduceVector = function(fn, seed, vector) {
    return vector.iterator().reduce(fn, seed);
};

SequenceRunner.prototype.reduceLinkedList = function(fn, seed, list) {
	while(list) {
		seed = fn(seed, list.data);
		list = list.next;
	}
	return list;
};

SequenceRunner.prototype.reduceIterable = function(fn, seed, iterable) {
	var it = iterable[Symbol.iterator]();
	var x = it.next();
	while (!(x = it.next()).done) {
		seed = fn(seed, x.value);
	}
	return seed;
};
