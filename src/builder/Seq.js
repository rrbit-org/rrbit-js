import {isList} from './SinglyLinkedList';
import lib from 'lib-rbbit';

export function of(list) {
    return new SequenceRunner(list);
}

function SequenceRunner(list) {
    if (lib.isVector(list)) {
        this.type = 'Vector';
    } else if (Array.isArray) {
        this.type = 'Array';
    } else if (isList(list)) {
        this.type = 'List';
    } else {
        this.type = 'Iterable';
    }

    this.list = list
}

SequenceRunner.prototype.reduce = function(fn, seed) {
    this['reduce' + this.type](fn, seed, this.list);
}

SequenceRunner.prototype.reduceArray = function(fn, seed, array) {}

SequenceRunner.prototype.reduceVector = function(fn, seed, vector) {}

SequenceRunner.prototype.reduceList = function(fn, seed, list) {}

SequenceRunner.prototype.reduceIterable = function(fn, seed) {}
