
function Maybe() {}
Maybe.of = Just;
Maybe.Just = Just;
Maybe.Nothing = _Nothing;



function Just(value) {
	if (value instanceof Nothing)
		return value;

	if (!(this instanceof Just))
		return new Just(value);

	this.value = value;
}

function Nothing() {}

const Nada = new Nothing();

function _Nothing() {
	return Nada;
}

const justProto = Just.prototype = Object.create(Maybe);
const notProto = Nothing.prototype = Object.create(Maybe);

notProto.map = function(fn) { return this; }
justProto.map = function(fn) {
	return Just(fn(this.value))
}

notProto.ap = function(maybe) { return this; }
justProto.ap = function(maybe) {
	return maybe.map(this.value)
}

notProto.chain = function(fn) { return this; }
justProto.chain = function(fn) {
	return fn(this.value)
}

notProto.getOrElse = function(notFound) { return notFound; }
justProto.getOrElse = function(notFound) {
	return this.value
}

notProto.orElse = function(fn) { return fn(this.value) }
justProto.orElse = function(fn) { return this; }

notProto.reduce = function(fn, seed) { return seed; }
justProto.reduce = function(fn, seed) { return fn(seed, this.value) }

export {
	Maybe
}