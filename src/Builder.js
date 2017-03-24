import * as LinkedList from './SinglyLinkedList';
import lib from 'lib-rbbit';
import {isVector} from './Vector';

/**
 * an iterator of iterators. Builders allow for higher performance
 * of transforms over multiple collections
 * operations are lazy
 */
function Builder() {
    this.pre = null;

    this.display0 = []
    this.display1 = null
    this.display2 = null
    this.display3 = null
    this.display4 = null
    this.display5 = null
    this.depth = 1;
    this.blockIndex = 0
    this.lo = 0

    this.accumulator = lib.empty();
}

Object.defineProperty(Builder.prototype, 'length', {
    get: function() {
        return this.blockIndex + this.lo + this.accumulator.length;
    }
})







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
proto.toVector = () => {}
proto.toArray = () => {}

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