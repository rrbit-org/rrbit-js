import * as LinkedList from './builder/SinglyLinkedList';
import * as Sequence from './builder/Seq'
import lib from 'lib-rbbit';
import {isList} from './_common';

/**
 * an iterator of iterators. Builders allow for higher performance
 * of transforms over multiple collections
 * operations are lazy
 */
function Builder() {
    this.pre = null;

    this.sequences = [];

    this.accumulator = null;
}


proto.and = function (singleValue) {
    
    lib.appendǃ((this.accumulator || (this.accumulator = lib.empty())), singleValue)
    return this;
}

proto.andAll = function(iterable) {
    if (this.accumulator) {
        this.sequences.push(Sequence.of(this.accumulator))
        this.accumulator = null;
    }
    this.sequences.push(Sequence.of(iterable));
    return this;
}





var proto = Builder.prototype;



proto.prepend = (item) => {
    this.pre = LinkedList.of(item, this.pre);
}


// = lazy operations ========================================================

proto.filter = () => {}
proto.drop = () => {}
proto.take = () => {}
proto.map = () => {}
proto.flatten = () => {}
proto.scan = () => {}






// proto.partition = () => {}



// = terminators =============================================================

//to collection
proto.toSet = () => {}

proto.toVector = function() {
    var vec = lib.empty();
    var seqs = this.sequences;
    for (var i = 0, len = seqs.length; len > i; i++) {
        var runner = seqs[i];
        runner.reduce(function(list, value) {
            return list.appendǃ(value);
        }, vec);
    }
    return vec;
}

proto.toArray = function() {
    var arr = [];
    var seqs = this.sequences;
    for (var i = 0, len = seqs.length; len > i; i++) {
        var runner = seqs[i];
        runner.reduce(function(list, value) {
            list.push(value)
            return list;
        }, arr);
    }
    return vec;
}

//to string
proto.join = (separator) => {}

//to boolean
proto.any = () => {}
proto.all = () => {}

// other
proto.foldl = () => {}
proto.reduce = () => {}

proto.foldr = () => {}
proto.reduceRight = () => {}


