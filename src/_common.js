import { setup } from 'lib-rrbit';

export function List(len) {
	this.length = len || 0;
}


export function isList(thing) {
	return thing instanceof Vector;
}


var factory = len => new List(len)

const rrbit = setup(factory);

export { rrbit }