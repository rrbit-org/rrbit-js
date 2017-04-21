// import { setup } from 'lib-rrbit';
import {setup} from 'lib-rrbit';

export function List(len) {
	this.length = len || 0;
}


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

const rrbit = setup(() => new List());
const identity = x => x 
	
export { rrbit, identity }