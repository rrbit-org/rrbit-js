import { setup } from 'lib-rrbit';

export function List(len) {
	this.length = len || 0;
}

var factory = len => new List(len)

export function isList(thing) {
	return thing instanceof List;
}

export function Builder() {
	if (!(this instanceof Builder))
		return new Builder();



	this.sequences = null
	this.pipe = null

	this.pre = null;
	this.accumulator = null;
}

export function isBuilder(maybe) {
	return maybe instanceof Builder
}

const rrbit = setup(factory);
const identity = x => x 
	
export { rrbit, identity }