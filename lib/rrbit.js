'use strict';

Object.defineProperty(exports, '__esModule', {value: true});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
		return typeof obj;
	} : function(obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};


var classCallCheck = function(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
};

var createClass = function() {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];
			descriptor.enumerable = descriptor.enumerable || false;
			descriptor.configurable = true;
			if ("value" in descriptor) descriptor.writable = true;
			Object.defineProperty(target, descriptor.key, descriptor);
		}
	}

	return function(Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);
		if (staticProps) defineProperties(Constructor, staticProps);
		return Constructor;
	};
}();


var _extends = Object.assign || function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];

			for (var key in source) {
				if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				}
			}
		}

		return target;
	};


var inherits = function(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	}

	subClass.prototype = Object.create(superClass && superClass.prototype, {
		constructor: {
			value: subClass,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
	if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};


var possibleConstructorReturn = function(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}

	return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var iterator$1;
function Vector(len) {
	this.length = len || 0;
	this.root = null;
	this.pre = null;
	this.aft = null;
}
Vector.prototype[Symbol.iterator] = function() {
	return iterator$1(this, 0, this.length);
};
function CancelToken(value, index) {
	this.value = value;
	this.index = index;
}
function setup(factory) {
	var lib = _extends({}, Cassowry, {
		factory: factory || Cassowry.factory
	});
	var VectorApi = ['nth', 'drop', 'take', 'update', 'prepend', 'append', 'appendǃ', 'appendAll', 'empty', 'reduce', 'find'
	].reduce(function(api, name) {
		api[name] = lib[name].bind(lib);
		return api;
	}, {});
	return VectorApi;
}
var Cassowry = {
	OCCULANCE_ENABLE: true,
	Vector: Vector,
	CancelToken: CancelToken,
	isCancelled: function isCancelled(value) {
		return value instanceof this.CancelToken;
	},
	done: function done(value, index, depth) {
		return new this.CancelToken(value, index, depth);
	},
	factory: function factory() {
		return new this.Vector();
	},
	clone: function clone(list) {
		var vec = this.factory();
		vec.length = list.length;
		vec.root = list.root;
		vec.pre = list.pre;
		vec.aft = list.aft;
		if (list.originOffset) vec.originOffset = list.originOffset;
		return vec;
	},
	SinglyLinkedList: function SinglyLinkedList(data, len, next) {
		this.data = data;
		this.link = next;
		this.length = len;
	},
	IllegalRange: function IllegalRange(msg) {
		throw new RangeError(msg || 'out of range');
	},
	addLL: function addLL(value, list) {
		if (list) {
			return new this.SinglyLinkedList(value, list.length + 1, list);
		}
		return new this.SinglyLinkedList(value, 1, list);
	},
	llToArray: function llToArray(ll) {
		if (!ll) return new Array(0);
		var result = new Array(ll.length);
		var i = 0;
		while (ll) {
			result[i] = ll.data;
			ll = ll.link;
			i += 1;
		}
		return result;
	},
	arrayToLL: function arrayToLL(arr) {
		var list = null;
		for (var i = arr.length - 1; i >= 0; i--) {
			list = this.addLL(arr[i], list);
		}
		return list;
	},
	aPush: function aPush(value, arr) {
		var len = arr.length;
		var result = new Array(len + 1);
		for (var i = 0; i < len; i++) {
			result[i] = arr[i];
		}
		result[len] = value;
		return result;
	},
	aUnshift: function aUnshift(value, arr) {
		var len = arr.length;
		var result = new Array(len + 1);
		for (var i = 0; i < len; i++) {
			result[i + 1] = arr[i];
		}
		result[0] = value;
		return result;
	},
	aSet: function aSet(index, value, arr) {
		var len = arr.length;
		var result = new Array(len);
		for (var i = 0; i < len; i++) {
			result[i] = arr[i];
		}
		result[index] = value;
		return result;
	},
	aSetǃ: function aSet(index, value, arr) {
		arr[index] = value;
		return arr;
	},
	aSetAsLast: function aSetAsLast(index, value, src) {
		if (!src) return [value];
		var result = this.aSlice(0, index, src);
		result[index] = value;
		return result;
	},
	aSlice: function aSlice(from, to, arr) {
		var len = to - from;
		var result = new Array(len);
		for (var i = 0; len > i; i++) {
			result[i] = arr[i + from];
		}
		return result;
	},
	tailOffset: function tailOffset(length) {
		return length >>> 5 << 5;
	},
	tailIndex: function tailIndex(index) {
		return index & 31;
	},
	depthFromLength: function() {
		return function(len) {
			if (len <= 1024) return 1;
			if (len <= 32768) return 2;
			if (len <= 1048576) return 3;
			if (len <= 33554432) return 4;
			if (len <= 1073741824) return 5;
			return 6;
		};
	}(),
	appendLeafOntoTree: function appendLeafOntoTree(leaf, tree, i) {
		var d1, d2, d3, d4, d5, n1, n2, n3, n4, n5;
		if (!tree) {
			return [leaf];
		}
		if (i < 1024) {
			return this.aSetAsLast(i >>> 5 & 31, leaf, tree);
		}
		if (i < 32768) {
			if (i == 1024) {
				tree = [tree];
			}
			d2 = tree;
			d1 = d2[i >>> 10 & 31];
			n1 = this.aSetAsLast(i >>> 5 & 31, leaf, d1);
			n2 = this.aSetAsLast(i >>> 10 & 31, n1, d2);
			return n2;
		}
		if (i < 1048576) {
			if (i == 32768) {
				tree = [tree];
			}
			d3 = tree;
			d2 = d3[i >>> 15 & 31];
			d1 = d2 && d2[i >>> 10 & 31];
			n1 = this.aSetAsLast(i >>> 5 & 31, leaf, d1);
			n2 = this.aSetAsLast(i >>> 10 & 31, n1, d2);
			n3 = this.aSetAsLast(i >>> 15 & 31, n2, d3);
			return n3;
		}
		if (i < 33554432) {
			if (i == 1048576) {
				tree = [tree];
			}
			d4 = tree;
			d3 = d4[i >>> 20 & 31];
			d2 = d3 && d3[i >>> 15 & 31];
			d1 = d2 && d2[i >>> 10 & 31];
			n1 = this.aSetAsLast(i >>> 5 & 31, leaf, d1);
			n2 = this.aSetAsLast(i >>> 10 & 31, n1, d2);
			n3 = this.aSetAsLast(i >>> 15 & 31, n2, d3);
			n4 = this.aSetAsLast(i >>> 20 & 31, n2, d4);
			return n4;
		}
		if (i < 1073741824) {
			if (i == 33554432) {
				tree = [tree];
			}
			d5 = tree;
			d4 = d5[i >>> 20 & 31];
			d3 = d4 && d4[i >>> 20 & 31];
			d2 = d3 && d3[i >>> 15 & 31];
			d1 = d2 && d2[i >>> 10 & 31];
			n1 = this.aSetAsLast(i >>> 5 & 31, leaf, d1);
			n2 = this.aSetAsLast(i >>> 10 & 31, n1, d2);
			n3 = this.aSetAsLast(i >>> 15 & 31, n2, d3);
			n4 = this.aSetAsLast(i >>> 20 & 31, n2, d4);
			n5 = this.aSetAsLast(i >>> 25 & 31, n2, d5);
			return n5;
		}
	},
	appendLeafOntoTreeǃ: function appendLeafOntoTree(leaf, tree, i) {
		var d1, d2, d3, d4, d5;
		if (!tree) {
			return [leaf];
		}
		if (i < 1024) {
			tree[i >>> 5 & 31] = leaf;
			return tree;
		}
		if (i < 32768) {
			if (i == 1024) {
				tree = [tree];
			}
			d1 = tree[i >>> 10 & 31] || (tree[i >>> 10 & 31] = []);
			d1[i >>> 5 & 31] = leaf;
			return tree;
		}
		if (i < 1048576) {
			if (i == 32768) {
				tree = [tree];
			}
			d3 = tree;
			d2 = d3[i >>> 15 & 31] || (d3[i >>> 15 & 31] = []);
			d1 = d2[i >>> 10 & 31] || (d2[i >>> 10 & 31] = []);
			d1[i >>> 5 & 31] = leaf;
			return tree;
		}
		if (i < 33554432) {
			if (i == 1048576) {
				tree = [tree];
			}
			d4 = tree;
			d3 = d4[i >>> 20 & 31] || (d4[i >>> 20 & 31] = []);
			d2 = d3[i >>> 15 & 31] || (d3[i >>> 15 & 31] = []);
			d1 = d2[i >>> 10 & 31] || (d2[i >>> 10 & 31] = []);
			d1[i >>> 5 & 31] = leaf;
			return tree;
		}
		if (i < 1073741824) {
			if (i == 33554432) {
				tree = [tree];
			}
			d5 = tree;
			d4 = d5[i >>> 25 & 31] || (d5[i >>> 25 & 31] = []);
			d3 = d4[i >>> 20 & 31] || (d4[i >>> 20 & 31] = []);
			d2 = d3[i >>> 15 & 31] || (d3[i >>> 15 & 31] = []);
			d1 = d2[i >>> 10 & 31] || (d2[i >>> 10 & 31] = []);
			d1[i >>> 5 & 31] = leaf;
			return tree;
		}
	},
	prependLeafOntoTree: function prependLeafOntoTree(leaf, tree, treeLen) {
		var d1, d2, d3, d4, n1, n2, n3, n4;
		if (!tree || treeLen == 0) {
			return [leaf];
		}
		if (treeLen <= 1024) {
			return tree.length == 32 ? [[leaf], tree] : this.aUnshift(leaf, tree);
		}
		if (treeLen <= 32768) {
			this.IllegalRange("can't prepend more than 1024...yet :(");
			d1 = tree[0];
			n1 = d1.length === 32 ? [leaf] : this.aUnshift(leaf, d1);
			if (d1.length === 32) {
				return tree.length == 32 ? [[n1], tree] : this.aUnshift(n1, tree);
			}
			return this.aSet(0, n1, tree);
		}
		if (treeLen <= 1048576) {
			d2 = tree[0];
			d1 = d2[0];
			n1 = d1.length === 32 ? [leaf] : this.aUnshift(leaf, d1);
			n2 = d1.length !== 32 ? this.aSet(0, n1, d2) : d2.length === 32 ? [n1] : this.aUnshift(n1, d2);
			if (n2.length === 1 && d2.length == 32) {
				return tree.length == 32 ? [[n2], tree] : this.aUnshift(n2, tree);
			}
			return this.aSet(0, n2, tree);
		}
	},
	trimTail: function trimTail(root, depth, len) {
		switch (depth) {
			case 5:
				return root[len >> 25 & 31][len >> 20 & 31][len >> 15 & 31][len >> 10 & 31][len >> 5 & 31];
			case 4:
				return root[len >> 20 & 31][len >> 15 & 31][len >> 10 & 31][len >> 5 & 31];
			case 3:
				return root[len >> 15 & 31][len >> 10 & 31][len >> 5 & 31];
			case 2:
				return root[len >> 10 & 31][len >> 5 & 31];
			case 1:
				return root[len >> 5 & 31];
		}
		return null;
	},
	trimTreeHeight: function trimTreeHeight(tree, depth, len) {
		var newDepth = this.depthFromLength(len);
		switch (depth - newDepth) {
			case 4:
				return tree[0][0][0][0];
			case 3:
				return tree[0][0][0];
			case 2:
				return tree[0][0];
			case 1:
				return tree[0];
			case 0:
				return tree;
		}
	},
	trimTree: function trimTree(tree, depth, len) {
		var newDepth = this.depthFromLength(len),
			d1,
			d2,
			d3,
			d4,
			d5;
		switch (depth) {
			case 5:
				d5 = tree;
				d4 = d5[len >> 25 & 31];
				d3 = d4[len >> 20 & 31];
				d2 = d3[len >> 15 & 31];
				d1 = d2[len >> 10 & 31];
				break;
			case 4:
				d4 = tree;
				d3 = d4[len >> 20 & 31];
				d2 = d3[len >> 15 & 31];
				d1 = d2[len >> 10 & 31];
				break;
			case 3:
				d3 = tree;
				d2 = d3[len >> 15 & 31];
				d1 = d2[len >> 10 & 31];
				break;
			case 2:
				d2 = tree;
				d1 = d2[len >> 10 & 31];
				break;
			case 1:
				d1 = tree;
				break;
		}
		switch (newDepth) {
			case 5:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				d2 = this.aSetǃ(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
				d3 = this.aSetǃ(len >> 15 & 31, d2, this.aSlice(0, len >> 15 & 31, d3));
				d4 = this.aSetǃ(len >> 20 & 31, d3, this.aSlice(0, len >> 20 & 31, d4));
				d5 = this.aSetǃ(len >> 25 & 31, d4, this.aSlice(0, len >> 25 & 31, d5));
				return d5;
			case 4:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				d2 = this.aSetǃ(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
				d3 = this.aSetǃ(len >> 15 & 31, d2, this.aSlice(0, len >> 15 & 31, d3));
				d4 = this.aSetǃ(len >> 20 & 31, d3, this.aSlice(0, len >> 20 & 31, d4));
				return d4;
			case 3:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				d2 = this.aSetǃ(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
				d3 = this.aSetǃ(len >> 15 & 31, d2, this.aSlice(0, len >> 15 & 31, d3));
				return d3;
			case 2:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				d2 = this.aSetǃ(len >> 10 & 31, d1, this.aSlice(0, len >> 10 & 31, d2));
				return d2;
			case 1:
				d1 = this.aSlice(0, len >> 5 & 31, d1);
				return d1;
		}
	},
	cancelableTreeReduce: function cancelableTreeReduce(fn, seed, tree, depth, i, end) {
		var d0, d1, d2, d3, d4, d5, j;
		switch (depth) {
			case 5:
				d5 = tree;
				d4 = d5[i >>> 25 & 31];
				d3 = d4[i >>> 20 & 31];
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 4:
				d4 = tree;
				d3 = d4[i >>> 20 & 31];
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 3:
				d3 = tree;
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 2:
				d2 = tree;
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
				break;
			case 1:
				d1 = tree;
				d0 = d1[i >>> 5 & 31];
				break;
		}
		d5End: while (true) {
			d4End: while (true) {
				d3End: while (true) {
					d2End: while (true) {
						d1End: while (true) {
							var end0 = i + 32;
							while (i < end0) {
								if (i == end) break d5End;
								seed = fn(seed, d0[i & 31], i);
								if (this.isCancelled(seed)) {
									break d5End;
								}
								i++;
							}
							if (!(j = i >>> 5 & 31)) {
								break d1End;
							}
							d0 = d1[j];
						}
						if (!d2 || (i >>> 10 & 31) == 0) {
							break d2End;
						}
						d1 = d2[i >>> 10 & 31];
						d0 = d1[i >>> 5 & 31];
					}
					if (!d3 || (i >>> 15 & 31) == 0) {
						break d3End;
					}
					d2 = d3[i >>> 15 & 31];
					d1 = d2[i >>> 10 & 31];
					d0 = d1[i >>> 5 & 31];
				}
				if (!d4 || (i >>> 20 & 31) == 0) {
					break d4End;
				}
				d3 = d4[i >>> 20 & 31];
				d2 = d3[i >>> 15 & 31];
				d1 = d2[i >>> 10 & 31];
				d0 = d1[i >>> 5 & 31];
			}
			if (!d5 || (i >>> 25 & 31) == 0) {
				break d5End;
			}
			d4 = d5[i >>> 25 & 31];
			d3 = d4[i >>> 20 & 31];
			d2 = d3[i >>> 15 & 31];
			d1 = d2[i >>> 10 & 31];
			d0 = d1[i >>> 5 & 31];
		}
		return seed;
	},
	cancelableReduce: function cancelableReduce(fn, seed, list) {
		var pre = list.pre,
			len = list.length - (pre && pre.length || 0),
			treeLen = len >>> 5 << 5,
			tailLen = len & 31;
		while (pre && !this.isCancelled(seed)) {
			seed = fn(seed, pre.data);
			pre = pre.link;
		}
		if (treeLen && !this.isCancelled(seed)) {
			seed = this.cancelableTreeReduce(fn, seed, list.root, this.depthFromLength(treeLen), 0, treeLen);
		}
		if (tailLen && !this.isCancelled(seed)) {
			var tail = list.aft;
			for (var i = 0; tailLen > i && !this.isCancelled(seed); i++) {
				seed = fn(seed, tail[i]);
			}
		}
		return seed;
	},
	squash: function squash(list) {
		var pre = list.pre,
			preLen = pre && pre.length || 0,
			root = list.root,
			len = list.length;
		if (preLen > 0 && len <= 64) {
			var merged = this.llToArray(pre).concat(root && root[0] || []).concat(list.aft);
			list.pre = null;
			list.root = [merged.slice(0, 32)];
			list.aft = merged.length > 32 ? merged.slice(32) : null;
		}
		if (len < 32 && !list.aft) {
			list.aft = (root && root[0] || []).slice(0, len);
			list.root = null;
		}
		return list;
	},
	nth: function nth(i, list, notFound) {
		var tree = list.root,
			pre = list.pre,
			totalLength = list.length,
			preLen = pre && pre.length || 0;
		if (i < 0) {
			i += totalLength;
		}
		if (i < 0 || totalLength <= i) {
			return notFound;
		}
		if (i < preLen) {
			for (var n = 0; n !== i; n++) {
				pre = pre.link;
			}
			return pre.data;
		}
		i -= preLen;
		var len = totalLength - preLen;
		var treeLen = len >>> 5 << 5;
		if (len < 32 || i >= treeLen) return list.aft[i & 31];
		if (list.originOffset) i += list.originOffset;
		if (treeLen < 32) return tree[i & 31];
		if (treeLen <= 1024) return tree[i >> 5 & 31][i & 31];
		if (treeLen <= 32768) return tree[i >> 10 & 31][i >> 5 & 31][i & 31];
		if (treeLen <= 1048576) return tree[i >> 15 & 31][i >> 10 & 31][i >> 5 & 31][i & 31];
		if (treeLen <= 33554432) return tree[i >> 20 & 31][i >> 15 & 31][i >> 10 & 31][i >> 5 & 31][i & 31];
		if (treeLen <= 1073741824) return tree[i >> 25 & 31][i >> 20 & 31][i >> 15 & 31][i >> 10 & 31][i >> 5 & 31][i & 31];
		return this.IllegalRange('range cannot be higher than 1,073,741,824');
	},
	empty: function empty() {
		return this.factory();
	},
	of: function of() {
		for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
			values[_key] = arguments[_key];
		}
		if (values.length > 32) {
		}
		var vec = new Vector(values.length);
		vec.aft = values;
		return vec;
	},
	append: function append(value, list) {
		var vec = this.clone(list),
			aft = vec.aft,
			aftLen = aft && aft.length || 0,
			totalLength = vec.length,
			newLength = totalLength + 1;
		if (this.OCCULANCE_ENABLE) {
			var aftDelta = vec.length & 31;
			if (aftDelta != aftLen) {
				aft = vec.aft = this.aSlice(0, aftDelta, aft);
			}
			if (!aft) {
				aft = vec.aft = [];
			}
			aft.push(value);
		} else {
			vec.aft = this.aPush(value, aft || []);
		}
		if ((newLength & 31) === 0) {
			vec.root = this.appendLeafOntoTree(aft, vec.root, newLength - 32 >>> 5 << 5);
			vec.aft = null;
		}
		vec.length = newLength;
		return vec;
	},
	appendǃ: function append(value, vec) {
		var aft = vec.aft || (vec.aft = []),
			totalLength = vec.length,
			newLength = totalLength + 1;
		aft.push(value);
		if ((newLength & 31) === 0) {
			vec.root = this.appendLeafOntoTreeǃ(aft, vec.root, newLength - 32 >>> 5 << 5);
			vec.aft = null;
		}
		vec.length = newLength;
		return vec;
	},
	prepend: function prepend(value, list) {
		var vec = this.clone(list),
			totalLength = vec.length,
			newLength = totalLength + 1;
		var pre = this.addLL(value, vec.pre);
		if (pre.length == 32) {
			vec.root = this.prependLeafOntoTree(this.llToArray(pre), vec.root, newLength - 32 >>> 5 << 5);
			vec.pre = null;
		} else {
			vec.pre = pre;
		}
		vec.length = newLength;
		return vec;
	},
	update: function update(i, value, list) {
		var length = list.length,
			pre = list.pre,
			preLen = pre && pre.length || 0,
			len = length - preLen,
			treeLen = len >>> 5 << 5,
			tailLen = len & 31,
			n = i - preLen;
		if (!length) return list;
		var vec = this.clone(list);
		if (preLen > i) {
			var newPre = this.llToArray(pre);
			newPre[i] = value;
			newPre = this.arrayToLL(newPre);
			vec.pre = newPre;
			return vec;
		}
		if (i > preLen + treeLen) {
			vec.aft = vec.aft ? this.aSlice(0, tailLen, vec.aft) : null;
			vec.aft[n & 31] = value;
			return vec;
		}
		var d0,
			d1,
			d2,
			d3,
			d4,
			d5,
			depth = this.depthFromLength(treeLen),
			tree = vec.root;
		switch (depth) {
			case 5:
				d5 = tree;
				d4 = d5[n >> 25 & 31];
				d3 = d4[n >> 20 & 31];
				d2 = d3[n >> 15 & 31];
				d1 = d2[n >> 10 & 31];
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				d2 = this.aSet(n >> 10 & 31, d1, d2);
				d3 = this.aSet(n >> 15 & 31, d2, d3);
				d4 = this.aSet(n >> 20 & 31, d3, d4);
				d5 = this.aSet(n >> 25 & 31, d4, d5);
				vec.root = d5;
				break;
			case 4:
				d4 = tree;
				d3 = d4[n >> 20 & 31];
				d2 = d3[n >> 15 & 31];
				d1 = d2[n >> 10 & 31];
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				d2 = this.aSet(n >> 10 & 31, d1, d2);
				d3 = this.aSet(n >> 15 & 31, d2, d3);
				d4 = this.aSet(n >> 20 & 31, d3, d4);
				vec.root = d4;
				break;
			case 3:
				d3 = tree;
				d2 = d3[n >> 15 & 31];
				d1 = d2[n >> 10 & 31];
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				d2 = this.aSet(n >> 10 & 31, d1, d2);
				d3 = this.aSet(n >> 15 & 31, d2, d3);
				vec.root = d3;
			case 2:
				d2 = tree;
				d1 = d2[n >> 10 & 31];
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				d2 = this.aSet(n >> 10 & 31, d1, d2);
				vec.root = d2;
				break;
			case 1:
				d1 = tree;
				d0 = d1[n >> 5 & 31];
				d0 = this.aSet(n & 31, value, d0);
				d1 = this.aSet(n >> 5 & 31, d0, d1);
				vec.root = d1;
				break;
		}
		return vec;
	},
	take: function take(n, list) {
		var length = list.length,
			pre = list.pre,
			preLen = pre && pre.length || 0,
			len = length - preLen,
			treeLen = len >>> 5 << 5,
			vec = this.empty();
		vec.length = n;
		if (n == 0) {
			return vec;
		}
		if (n < 0) {
			n += length;
		}
		if (n >= length) {
			return list;
		}
		if (n < preLen) {
			vec.aft = this.aSlice(0, n, this.llToArray(pre));
			return vec;
		}
		if (treeLen + preLen < n) {
			var _end = len & 31;
			vec.aft = _end ? this.aSlice(0, _end, list.aft) : null;
			vec.root = list.root;
			vec.pre = pre;
			return vec;
		}
		var _newTreeLen = n - preLen;
		var depth = this.depthFromLength(treeLen);
		if (_newTreeLen < 32) {
			vec.aft = this.trimTail(list.root, depth, _newTreeLen);
		} else {
			vec.aft = (_newTreeLen & 31) == 0 ? null : this.trimTail(list.root, depth, _newTreeLen);
			vec.root = this.trimTreeHeight(list.root, depth, _newTreeLen >>> 5 << 5);
		}
		vec.pre = pre;
		if (preLen > 0 && n <= 64) {
			return this.squash(vec);
		}
		return vec;
	},
	drop: function drop(n, list) {
		var length = list.length,
			newLength = length - n,
			pre = list.pre,
			preLen = pre && pre.length || 0,
			len = length - preLen,
			treeLen = len >>> 5 << 5,
			tailLen = len & 31,
			vec = this.empty(),
			d0,
			d1,
			d2,
			d3,
			d4,
			d5;
		if (n < 0) {
			n += length;
		}
		if (n >= length) {
			return vec;
		}
		vec.length = newLength;
		if (preLen > n) {
			var _n = preLen - n;
			while (pre.length != _n) {
				pre = pre.link;
			}
			vec.pre = pre;
			vec.root = list.root;
			vec.aft = list.aft;
			return vec;
		}
		if (n > preLen + treeLen) {
			vec.aft = this.aSlice(tailLen - vec.length, tailLen, list.aft);
			return vec;
		}
		var newRoot, newPre;
		var depth = this.depthFromLength(treeLen);
		var start = n - preLen;
		var newTreeLen = treeLen - start;
		var newDepth = this.depthFromLength(newTreeLen);
		switch (depth) {
			case 5:
				d5 = list.root;
				d4 = d5[start >> 25 & 31];
				d3 = d4[start >> 20 & 31];
				d2 = d3[start >> 15 & 31];
				d1 = d2[start >> 10 & 31];
			case 4:
				d4 = list.root;
				d3 = d4[start >> 20 & 31];
				d2 = d3[start >> 15 & 31];
				d1 = d2[start >> 10 & 31];
			case 3:
				d3 = list.root;
				d2 = d3[start >> 15 & 31];
				d1 = d2[start >> 10 & 31];
			case 2:
				d3 = list.root;
				d1 = d2[start >> 10 & 31];
			case 1:
				d1 = list.root;
				break;
		}
		switch (depth - newDepth) {
			case 4:
				break;
			case 3:
				break;
			case 2:
				break;
			case 1:
				break;
			case 0:
				break;
		}
		switch (newDepth) {
			case 5:
			case 4:
			case 3:
			case 2:
				this.IllegalRange('cannot drop when length is more than 1024...yet');
				break;
			case 1:
				newPre = this.aSlice(start & 31, 32, d1[start >> 5 & 31]);
				var x = (start >> 5 & 31) + 1;
				d1 = this.aSlice(x, d1.length, d1);
				newRoot = d1.length ? d1 : null;
				break;
		}
		vec.pre = this.arrayToLL(newPre);
		vec.root = newRoot;
		vec.aft = list.aft;
		return vec;
	},
	appendAll: function appendAll(left, right) {
		var vec = this.clone(left),
			leftPre = left.pre,
			leftPreLength = leftPre && leftPre.length || 0,
			leftLength = left.length,
			leftTreeLength = leftLength - leftPreLength >>> 5 << 5,
			leftTailLength = leftLength - leftPreLength & 31;
		vec.root = left.root ? this.trimTree(left.root, this.depthFromLength(leftTreeLength), leftTreeLength) : null;
		vec.aft = vec.aft ? this.aSlice(0, leftTailLength, vec.aft) : null;
		vec = this.reduce(function addToLeft(list, value) {
			return this.appendǃ(value, list);
		}.bind(this), vec, right);
		return this.squash(vec);
	},
	reduce: function reduce(fn, seed, list) {
		return this.cancelableReduce(fn, seed, list);
	},
	reduceRight: function reduceRight(fn, seed, list) {
		throw new Error('operation not supported...yet');
	},
	find: function find(predicate, list) {
		var lib = {
			Token: this.CancelToken,
			predicate: predicate,
			step: function step(_, value, index) {
				return this.predicate(value) ? new this.Token(value, index) : null;
			}
		};
		var result = this.cancelableReduce(lib.step.bind(lib), null, list);
		return this.isCancelled(result) ? result : {
				index: -1,
				value: null
			};
	}
};

function List(len) {
	this.length = len || 0;
}
function isList(thing) {
	return thing instanceof List;
}
function Builder() {
	if (!(this instanceof Builder)) return new Builder();
	this.sequences = null;
	this.pipe = null;
	this.pre = null;
	this.accumulator = null;
}
function isBuilder(maybe) {
	return maybe instanceof Builder;
}
var rrbit = setup(function() {
	return new List();
});

function SinglyLinkedList(data, len, next) {
	this.data = data;
	this.next = next;
	this.length = len;
}
function of(value, list) {
	if (list) return list.add(value);
	return new SinglyLinkedList(value, 1, null);
}

function isLinkedList(list) {
	return list instanceof SinglyLinkedList;
}
var proto$2 = SinglyLinkedList.prototype;
proto$2.add = function(value) {
	return new new SinglyLinkedList(value, this.length, this)();
};
proto$2.nth = function(i, notFound) {
	var list = this;
	if (0 > i)
		i = i + list.length;
	if (i > list.length) return notFound;
	while (list) {
		if (list.length - 1 == i) return list.data;
		list = list.next;
	}
	return notFound;
};
proto$2.take = function take(n) {
	var list = this;
	n = list.length - n;
	while (list && list.length != n) {
		list = list.next;
	}
	return list;
};
proto$2.drop = function drop(n) {
	var list = this;
	if (n >= list.length) return;
	var newLen = list.length - n;
	var temp = new Array(newLen);
	while (newLen) {
		temp[--i] = list.data;
		list = list.next;
	}
	return this.fromArray(temp);
};
proto$2.toArray = function toArray() {
	var list = this;
	var i = 0;
	var arr = new Array(list.length);
	while (list) {
		arr[i++] = list.data;
		list = list.next;
	}
	return arr;
};
proto$2.toArrayReverse = function toArrayReverse() {
	var list = this;
	var i = list.length - 1;
	var arr = new Array(i);
	while (list) {
		arr[i--] = list.data;
		list = list.next;
	}
	return arr;
};

function isIterable(maybe) {
	return maybe && typeof maybe[Symbol.iterator] == 'function';
}
function last(fn) {
	if (typeof fn == 'function') return new Last(fn);
	return fn;
}
var Last = function() {
	function Last(fn) {
		classCallCheck(this, Last);
		this.stepFn = fn;
	}

	createClass(Last, [{
		key: 'init',
		value: function init() {
		}
	}, {
		key: 'step',
		value: function step(result, input) {
			return this.stepFn(result, input);
		}
	}, {
		key: 'result',
		value: function result(_result) {
			return _result;
		}
	}]);
	return Last;
}();
function Reduced(value) {
	this.value = value;
	this.isReduced = true;
}
function isReduced(x) {
	return x instanceof Reduced;
}
function toReduced(x) {
	return isReduced(x) ? x : new Reduced(x);
}
function toValue(x) {
	return isReduced(x) ? x.value : x;
}
function compose(a, b, c, d, e, f, g, h, i, j) {
	switch (arguments.length) {
		case 2:
			return function() {
				return a(b.apply(undefined, arguments));
			};
		case 3:
			return function() {
				return a(b(c.apply(undefined, arguments)));
			};
		case 4:
			return function() {
				return a(b(c(d.apply(undefined, arguments))));
			};
		case 5:
			return function() {
				return a(b(c(d(e.apply(undefined, arguments)))));
			};
		case 6:
			return function() {
				return a(b(c(d(e(f.apply(undefined, arguments))))));
			};
		case 7:
			return function() {
				return a(b(c(d(e(f(g.apply(undefined, arguments)))))));
			};
		case 8:
			return function() {
				return a(b(c(d(e(f(g(h.apply(undefined, arguments))))))));
			};
		case 9:
			return function() {
				return a(b(c(d(e(f(g(h(i.apply(undefined, arguments)))))))));
			};
		case 10:
			return function() {
				return a(b(c(d(e(f(g(h(i(j.apply(undefined, arguments))))))))));
			};
	}
	var args = Array.prototype.slice.call(arguments).reverse();
	return args.reduce(function(f, func) {
		return function(value) {
			return f(fn(value));
		};
	}, args.shift());
}
var ITransformer = function() {
	function ITransformer() {
		classCallCheck(this, ITransformer);
	}

	createClass(ITransformer, [{
		key: 'init',
		value: function init() {
			return this.xf.init();
		}
	}, {
		key: 'step',
		value: function step(result, value) {
			return value;
		}
	}, {
		key: 'result',
		value: function result(_result2) {
			return this.xf.result(_result2);
		}
	}]);
	return ITransformer;
}();
var PassThru = function(_ITransformer) {
	inherits(PassThru, _ITransformer);
	function PassThru(xf) {
		classCallCheck(this, PassThru);
		var _this = possibleConstructorReturn(this, (PassThru.__proto__ || Object.getPrototypeOf(PassThru)).call(this));
		_this.xf = xf;
		return _this;
	}

	createClass(PassThru, [{
		key: 'step',
		value: function step(result, value) {
			return this.xf.step(result);
		}
	}]);
	return PassThru;
}(ITransformer);
var passThru = function passThru() {
	return function(next) {
		return new PassThru(next);
	};
};
var Mapper = function(_ITransformer2) {
	inherits(Mapper, _ITransformer2);
	createClass(Mapper, null, [{
		key: 'create',
		value: function create(fn) {
			return function(next) {
				return new Mapper(fn, next);
			};
		}
	}]);
	function Mapper(fn, xf) {
		classCallCheck(this, Mapper);
		var _this2 = possibleConstructorReturn(this, (Mapper.__proto__ || Object.getPrototypeOf(Mapper)).call(this));
		_this2.fn = fn;
		_this2.xf = xf;
		return _this2;
	}

	createClass(Mapper, [{
		key: 'step',
		value: function step(result, value) {
			return this.xf.step(result, this.fn(value));
		}
	}]);
	return Mapper;
}(ITransformer);
var map$1 = Mapper.create;
var Filter = function(_ITransformer3) {
	inherits(Filter, _ITransformer3);
	createClass(Filter, null, [{
		key: 'create',
		value: function create(predicate) {
			return function(next) {
				return new Filter(predicate, next);
			};
		}
	}]);
	function Filter(predicate, xf) {
		classCallCheck(this, Filter);
		var _this3 = possibleConstructorReturn(this, (Filter.__proto__ || Object.getPrototypeOf(Filter)).call(this));
		_this3.predicate = predicate;
		_this3.xf = xf;
		return _this3;
	}

	createClass(Filter, [{
		key: 'step',
		value: function step(result, value) {
			return this.predicate(value) ? this.xf.step(result, value) : result;
		}
	}]);
	return Filter;
}(ITransformer);
var filter = Filter.create;
var Scan = function(_ITransformer4) {
	inherits(Scan, _ITransformer4);
	createClass(Scan, null, [{
		key: 'create',
		value: function create(fn, seed) {
			return function(next) {
				return new Scan(fn, seed, next);
			};
		}
	}]);
	function Scan(fn, seed, xf) {
		classCallCheck(this, Scan);
		var _this4 = possibleConstructorReturn(this, (Scan.__proto__ || Object.getPrototypeOf(Scan)).call(this));
		_this4.fn = fn;
		_this4.seed = seed;
		_this4.xf = xf;
		return _this4;
	}

	createClass(Scan, [{
		key: 'step',
		value: function step(result, value) {
			this.seed = this.fn(this.seed, value);
			return this.xf.step(result, this.seed);
		}
	}]);
	return Scan;
}(ITransformer);
var scan = Scan.create;
var Take = function(_ITransformer5) {
	inherits(Take, _ITransformer5);
	createClass(Take, null, [{
		key: 'create',
		value: function create(n) {
			return function(next) {
				return new Take(n, next);
			};
		}
	}]);
	function Take(fn, xf) {
		classCallCheck(this, Take);
		var _this5 = possibleConstructorReturn(this, (Take.__proto__ || Object.getPrototypeOf(Take)).call(this));
		_this5.fn = fn;
		_this5.xf = xf;
		return _this5;
	}

	createClass(Take, [{
		key: 'step',
		value: function step(result, value) {
			return this.n-- > 0 ? this.xf.step(result, value) : toReduced(result);
		}
	}]);
	return Take;
}(ITransformer);
var take$1 = Take.create;
var TakeWhile = function(_ITransformer6) {
	inherits(TakeWhile, _ITransformer6);
	createClass(TakeWhile, null, [{
		key: 'create',
		value: function create(predicate) {
			return function(next) {
				return new TakeWhile(predicate, next);
			};
		}
	}]);
	function TakeWhile(predicate, xf) {
		classCallCheck(this, TakeWhile);
		var _this6 = possibleConstructorReturn(this, (TakeWhile.__proto__ || Object.getPrototypeOf(TakeWhile)).call(this));
		_this6.fn = predicate;
		_this6.xf = xf;
		return _this6;
	}

	createClass(TakeWhile, [{
		key: 'step',
		value: function step(result, value) {
			return this.fn(value) ? this.xf.step(result, value) : toReduced(result);
		}
	}]);
	return TakeWhile;
}(ITransformer);
var takeWhile = TakeWhile.create;
var Drop = function(_ITransformer7) {
	inherits(Drop, _ITransformer7);
	createClass(Drop, null, [{
		key: 'create',
		value: function create(n) {
			return function(next) {
				return new Drop(n, next);
			};
		}
	}]);
	function Drop(n, xf) {
		classCallCheck(this, Drop);
		var _this7 = possibleConstructorReturn(this, (Drop.__proto__ || Object.getPrototypeOf(Drop)).call(this));
		_this7.n = n;
		_this7.xf = xf;
		return _this7;
	}

	createClass(Drop, [{
		key: 'step',
		value: function step(result, value) {
			return this.n-- > 0 ? result : this.xf.step(result, value);
		}
	}]);
	return Drop;
}(ITransformer);
var drop$1 = Drop.create;
var DropWhile = function(_ITransformer8) {
	inherits(DropWhile, _ITransformer8);
	createClass(DropWhile, null, [{
		key: 'create',
		value: function create(predicate) {
			return function(next) {
				return new DropWhile(predicate, next);
			};
		}
	}]);
	function DropWhile(predicate, xf) {
		classCallCheck(this, DropWhile);
		var _this8 = possibleConstructorReturn(this, (DropWhile.__proto__ || Object.getPrototypeOf(DropWhile)).call(this));
		_this8.fn = predicate;
		_this8.xf = xf;
		_this8.isDropping = true;
		return _this8;
	}

	createClass(DropWhile, [{
		key: 'step',
		value: function step(result, value) {
			if (this.isDropping) {
				if (this.fn(value)) return result;
				this.isDropping = false;
			}
			return this.xf.step(result, value);
		}
	}]);
	return DropWhile;
}(ITransformer);
var dropWhile = DropWhile.create;
var Intersperse = function(_ITransformer9) {
	inherits(Intersperse, _ITransformer9);
	createClass(Intersperse, null, [{
		key: 'create',
		value: function create(separator) {
			return function(next) {
				return new Intersperse(separator, next);
			};
		}
	}]);
	function Intersperse(separator, xf) {
		classCallCheck(this, Intersperse);
		var _this9 = possibleConstructorReturn(this, (Intersperse.__proto__ || Object.getPrototypeOf(Intersperse)).call(this));
		_this9.sep = separator;
		_this9.first = true;
		_this9.xf = xf;
		return _this9;
	}

	createClass(Intersperse, [{
		key: 'step',
		value: function step(result, value) {
			if (this.first) {
				this.first = false;
				return this.xf.step(result, value);
			}
			var next = this.xf.step(result, this.sep);
			return isReduced(next) ? next : this.xf.step(next, value);
		}
	}]);
	return Intersperse;
}(ITransformer);
var intersperse = Intersperse.create;
var PartitionBy = function(_ITransformer10) {
	inherits(PartitionBy, _ITransformer10);
	createClass(PartitionBy, null, [{
		key: 'create',
		value: function create(fn) {
			return function(next) {
				return new PartitionBy(fn, next);
			};
		}
	}]);
	function PartitionBy(fn, xf) {
		classCallCheck(this, PartitionBy);
		var _this10 = possibleConstructorReturn(this, (PartitionBy.__proto__ || Object.getPrototypeOf(PartitionBy)).call(this));
		_this10.fn = fn;
		_this10.xf = xf;
		_this10.group = [];
		_this10.previous = void 0;
		return _this10;
	}

	createClass(PartitionBy, [{
		key: 'step',
		value: function step(result, value) {
			if (this.previous === this.fn(value)) {
				this.group.push(value);
			} else {
				var group = this.group = [];
				result = this.xf.step(result, group);
				if (!isReduced(result)) {
					group.push(value);
				}
			}
			return result;
		}
	}, {
		key: 'result',
		value: function result(_result3) {
			var group = this.group;
			if (group && group.length) {
				this.group = [];
				_result3 = this.xf.step(_result3, group);
			}
			return this.xf.result(_result3);
		}
	}]);
	return PartitionBy;
}(ITransformer);
var partitionBy = PartitionBy.create;
var MapCat = function(_ITransformer11) {
	inherits(MapCat, _ITransformer11);
	createClass(MapCat, null, [{
		key: 'create',
		value: function create(fn) {
			return function(next) {
				return new MapCat(fn, next);
			};
		}
	}]);
	function MapCat(fn, xf) {
		classCallCheck(this, MapCat);
		var _this11 = possibleConstructorReturn(this, (MapCat.__proto__ || Object.getPrototypeOf(MapCat)).call(this));
		_this11.fn = fn;
		_this11.xf = xf;
		_this11.seq = Sequence.of(null);
		return _this11;
	}

	createClass(MapCat, [{
		key: 'step',
		value: function step(result, value) {
			return this.seq.setup(value).reduce(this.xf.step.bind(this.xf.step), result);
		}
	}]);
	return MapCat;
}(ITransformer);
var mapCat = MapCat.create;
var Keep = function(_ITransformer12) {
	inherits(Keep, _ITransformer12);
	createClass(Keep, null, [{
		key: 'create',
		value: function create(fn) {
			return function(next) {
				return new Keep(fn, next);
			};
		}
	}]);
	function Keep(fn, xf) {
		classCallCheck(this, Keep);
		var _this12 = possibleConstructorReturn(this, (Keep.__proto__ || Object.getPrototypeOf(Keep)).call(this));
		_this12.fn = fn;
		_this12.xf = xf;
		return _this12;
	}

	createClass(Keep, [{
		key: 'step',
		value: function step(result, value) {
			return this.f(value) ? result : this.xf.step(result, value);
		}
	}]);
	return Keep;
}(ITransformer);
var Unique = function(_ITransformer13) {
	inherits(Unique, _ITransformer13);
	createClass(Unique, null, [{
		key: 'create',
		value: function create(fn) {
			return function(next) {
				return new Unique(fn, next);
			};
		}
	}]);
	function Unique(fn, xf) {
		classCallCheck(this, Unique);
		var _this13 = possibleConstructorReturn(this, (Unique.__proto__ || Object.getPrototypeOf(Unique)).call(this));
		_this13.seen = [];
		_this13.fn = fn || function(x) {
				return x;
			};
		_this13.xf = xf;
		return _this13;
	}

	createClass(Unique, [{
		key: 'step',
		value: function step(result, input) {
			var computed = this.fn(input);
			if (this.seen.includes(computed)) {
				this.seen.push(computed);
				return this.xf.step(result, input);
			}
			return result;
		}
	}]);
	return Unique;
}(ITransformer);
var unique = Unique.create;
var KeepIndexed = function(_ITransformer14) {
	inherits(KeepIndexed, _ITransformer14);
	createClass(KeepIndexed, null, [{
		key: 'create',
		value: function create(fn) {
			return function(next) {
				return new KeepIndexed(fn, next);
			};
		}
	}]);
	function KeepIndexed(fn, xf) {
		classCallCheck(this, KeepIndexed);
		var _this14 = possibleConstructorReturn(this, (KeepIndexed.__proto__ || Object.getPrototypeOf(KeepIndexed)).call(this));
		_this14.fn = fn;
		_this14.i = -1;
		_this14.xf = xf;
		return _this14;
	}

	createClass(KeepIndexed, [{
		key: 'step',
		value: function step(result, value) {
			this.i++;
			return this.f(this.i, value) ? result : this.xf.step(result, value);
		}
	}]);
	return KeepIndexed;
}(ITransformer);
function transduce(collection, xf, iterator, seed) {
	if (!xf) xf = passThru();
	xf = xf(last(iterator));
	var result = Sequence.of(collection).reduce(xf.step.bind(xf), seed === undefined ? xf.init() : seed);
	return toValue(xf.result(toValue(result)));
}
var Sequence = function() {
	createClass(Sequence, null, [{
		key: 'of',
		value: function of$$1(list) {
			return Sequence.isSequence(list) ? list : new Sequence(list);
		}
	}, {
		key: 'from',
		value: function from() {
			for (var _len = arguments.length, collections = Array(_len), _key = 0; _key < _len; _key++) {
				collections[_key] = arguments[_key];
			}
			return ReSequence.of(collections);
		}
	}, {
		key: 'isCollection',
		value: function isCollection(maybe) {
			return maybe && (isList(maybe) || Array.isArray(maybe) || isIterable(maybe) || isLinkedList(maybe) || Sequence.isSequence(maybe));
		}
	}, {
		key: 'isSequence',
		value: function isSequence(maybe) {
			return maybe instanceof Sequence;
		}
	}]);
	function Sequence(list) {
		classCallCheck(this, Sequence);
		this.setup(list);
	}

	createClass(Sequence, [{
		key: 'setup',
		value: function setup(list) {
			if (!list) {
				this.type = 'Null';
				return;
			}
			this.list = list;
			if (isList(list)) {
				this.type = 'Vector';
			} else if (Array.isArray(list)) {
				this.type = 'Array';
			} else if (isLinkedList(list)) {
				this.type = 'LinkedList';
			} else if (Sequence.isSequence(list)) {
				this.type = "Sequence";
			} else if (ReSequence.isReSequence(list)) {
				this.type = "Sequence";
			} else if (typeof list['@@transducer/reduce'] == 'function') {
			} else if (typeof list == 'string') {
				this.type = "Unknown";
			} else if (isIterable(list)) {
				this.type = 'Iterable';
			} else {
				this.type = "Single";
			}
		}
	}, {
		key: 'reduce',
		value: function reduce(fn, seed) {
			return this['reduce' + this.type](fn, seed, this.list);
		}
	}, {
		key: 'reduceSingle',
		value: function reduceSingle(fn, seed) {
			return fn(seed, this.list);
		}
	}, {
		key: 'reduceArray',
		value: function reduceArray(fn, seed, array) {
			for (var i = 0, len = array.length; len > i; i++) {
				seed = fn(seed, array[i]);
				if (isReduced(seed)) return seed;
			}
			return seed;
		}
	}, {
		key: 'reduceVector',
		value: function reduceVector(fn, seed, vector) {
			vector.find(function(value) {
				return isReduced(seed = fn(seed, value));
			});
			return seed;
		}
	}, {
		key: 'reduceBuilder',
		value: function reduceBuilder(fn, seed, builder) {
			return seed;
		}
	}, {
		key: 'reduceLinkedList',
		value: function reduceLinkedList(fn, seed, list) {
			while (list) {
				seed = fn(seed, list.data);
				if (isReduced(seed)) return seed;
				list = list.next;
			}
			return seed;
		}
	}, {
		key: 'reduceIterable',
		value: function reduceIterable(fn, seed, iterable) {
			var it = iterable[Symbol.iterator]();
			var x = it.next();
			while (!(x = it.next()).done) {
				seed = fn(seed, x.value);
				if (isReduced(seed)) return seed;
			}
			return seed;
		}
	}, {
		key: 'reduceSequence',
		value: function reduceSequence(fn, seed, seq) {
			return seq.reduce(fn, seed);
		}
	}, {
		key: 'reduceUnknown',
		value: function reduceUnknown() {
			throw new TypeError("unknown collection type, cannot reduce");
		}
	}, {
		key: 'reduceNull',
		value: function reduceNull(fn, seed) {
			return seed;
		}
	}]);
	return Sequence;
}();
var ReSequence = function() {
	createClass(ReSequence, null, [{
		key: 'of',
		value: function of$$1(collections) {
			return new ReSequence(collections || []);
		}
	}, {
		key: 'isReSequence',
		value: function isReSequence(maybe) {
			return maybe instanceof ReSequence;
		}
	}]);
	function ReSequence() {
		classCallCheck(this, ReSequence);
		this.type = 'ReSequence';
		for (var _len2 = arguments.length, collections = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			collections[_key2] = arguments[_key2];
		}
		this.sequences = collections.map(function(collection) {
			return Sequence.of(collection);
		});
	}

	createClass(ReSequence, [{
		key: 'add',
		value: function add(collection) {
			this.sequences.push(Sequence.of(collection));
		}
	}, {
		key: 'pre',
		value: function pre(collection) {
			this.sequences.unshift(Sequence.of(collection));
		}
	}, {
		key: 'reduce',
		value: function reduce(fn, seed) {
			var seqs = this.sequences;
			for (var i = 0, len = seqs.length; len > i; i++) {
				seed = seqs[i].reduce(fn, seed);
				if (isReduced(seed)) return seed;
			}
			return seed;
		}
	}]);
	return ReSequence;
}();

var proto$1 = Builder.prototype;
Builder.isBuilder = isBuilder;
proto$1.push = proto$1.append = function(singleValue) {
	rrbit.appendǃ(this.accumulator || (this.accumulator = rrbit.empty()), singleValue);
	return this;
};
proto$1.concat = proto$1.appendAll = function(collection) {
	if (!this.sequences) {
		this.sequences = new ReSequence([]);
	}
	if (this.accumulator) {
		this.sequences.add(this.accumulator);
		this.accumulator = null;
	}
	this.sequences.add(collection);
	return this;
};
proto$1.unshift = proto$1.prepend = function(item) {
	this.pre = of(item, this.pre);
	return this;
};
function addToPipe(xf, pipe) {
	return !pipe ? xf : compose(xf, pipe);
}
proto$1.filter = function(fn) {
	this.pipe = addToPipe(filter(fn), this.pipe);
	return this;
};
proto$1.drop = function(n) {
	this.pipe = addToPipe(drop$1(n), this.pipe);
	return this;
};
proto$1.dropWhile = function(fn) {
	this.pipe = addToPipe(dropWhile(fn), this.pipe);
	return this;
};
proto$1.take = function(nn) {
	this.pipe = addToPipe(take$1(n), this.pipe);
	return this;
};
proto$1.takeWhile = function(fn) {
	this.pipe = addToPipe(takeWhile(fn), this.pipe);
	return this;
};
proto$1.map = function(fn) {
	this.pipe = addToPipe(map$1(fn), this.pipe);
	return this;
};
proto$1.groupWith = function(fn) {
	this.pipe = addToPipe(partitionBy(fn), this.pipe);
	return this;
};
proto$1.flatMap = function(fn) {
	this.pipe = addToPipe(mapCat(fn), this.pipe);
	return this;
};
proto$1.flatten = function() {
	return this.flatMap(function(x) {
		return x;
	});
};
proto$1.scan = function(fn, seed) {
	this.pipe = addToPipe(scan(fn, seed), this.pipe);
	return this;
};
proto$1.reduce = function(fn, seed) {
	if (this.pre) {
		this.sequences.pre(this.pre);
		this.pre = null;
	}
	return transduce(this.sequences, this.pipe, fn, seed);
};
proto$1.unique = function(fn) {
	this.pipe = addToPipe(unique(fn), this.pipe);
	return this;
};
proto$1.intersperse = function(separator) {
	this.pipe = addToPipe(intersperse(separator), this.pipe);
	return this;
};
proto$1.toList = function() {
	var intoVector = function intoVector(list, item) {
		return rrbit.appendǃ(item, list);
	};
	return this.reduce(intoVector, rrbit.empty());
};
proto$1.toArray = function() {
	var intoArray = function intoArray(list, item) {
		return list.push(item);
	};
	return this.reduce(intoArray, []);
};
proto$1.join = function(separator) {
	if (separator) {
		this.intersperse(separator);
	}
	return this.reduce(function(prev, next) {
		return prev + next;
	}, "");
};
proto$1.some = function(predicate) {
	this.reduce(function(prev, next) {
		return prev || predicate(next);
	}, false);
};
proto$1.every = function(predicate) {
	this.reduce(function(prev, next) {
		return prev && predicate(next);
	}, true);
};

function Maybe() {
}
Maybe.of = Just;
Maybe.Just = Just;
Maybe.Nothing = _Nothing;
function Just(value) {
	if (value instanceof Nothing) return value;
	if (!(this instanceof Just)) return new Just(value);
	this.value = value;
}
function Nothing() {
}
var Nada = new Nothing();
function _Nothing() {
	return Nada;
}
var justProto = Just.prototype = Object.create(Maybe);
var notProto = Nothing.prototype = Object.create(Maybe);
notProto.map = function(fn) {
	return this;
};
justProto.map = function(fn) {
	return Just(fn(this.value));
};
notProto.ap = function(maybe) {
	return this;
};
justProto.ap = function(maybe) {
	return maybe.map(this.value);
};
notProto.chain = function(fn) {
	return this;
};
justProto.chain = function(fn) {
	return fn(this.value);
};
notProto.getOrElse = function(notFound) {
	return notFound;
};
justProto.getOrElse = function(notFound) {
	return this.value;
};
notProto.orElse = function(fn) {
	return fn(this.value);
};
justProto.orElse = function(fn) {
	return this;
};
notProto.reduce = function(fn, seed) {
	return seed;
};
justProto.reduce = function(fn, seed) {
	return fn(seed, this.value);
};

var nth = rrbit.nth;
var drop = rrbit.drop;
var take = rrbit.take;
var update = rrbit.update;
var append = rrbit.append;
var appendǃ = rrbit.appendǃ;
var prepend = rrbit.prepend;
var appendAll = rrbit.appendAll;
var empty = rrbit.empty;
var reduce = rrbit.reduce;
var reduceRight = rrbit.reduceRight;
var find = rrbit.find;
List.empty = empty;
List.isList = List.prototype.isList = isList;
function _of() {
	for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
		values[_key] = arguments[_key];
	}
	return values.length == 1 ? append(values[0], empty()) : _from(values);
}
List.of = List.prototype.of = _of;
List.Builder = List.prototype.Builder = Builder;
List.prototype.toBuilder = function() {
	return Builder().addAll(this);
};
function _from(collection) {
	if (isList(collection)) return collection;
	if (Array.isArray(collection)) {
		return _fromArray(collection);
	}
	if (typeof collection.reduce == 'function') {
		return collection.reduce(function(list, value) {
			return appendǃ(value, list);
		}, empty());
	}
	if (typeof collection[Symbol.iterator] == 'function') {
		return _fromIterable(collection);
	}
	return empty();
}
function _fromArray(array) {
	var vec = empty();
	for (var i = 0, len = array.length; len > i; i++) {
		vec = appendǃ(array[len], vec);
	}
	return vec;
}
function _fromIterable(iterable) {
	var vec = empty();
	var it = iterable[Symbol.iterator]();
	var x = it.next();
	while (!(x = it.next()).done) {
		vec = appendǃ(x.value, vec);
	}
	return vec;
}
List.from = List.prototype.from = _from;
var proto = List.prototype;
proto.empty = empty;
proto.map = function(fn) {
	var lib = {
		fn: fn,
		add: appendǃ,
		step: function step(list, value) {
			return this.add(this.fn(value), list);
		}
	};
	return this.reduce(lib.step.bind(lib), this.empty());
};
proto.append = proto.push = function(value) {
	return append(value, this);
};
proto.prepend = proto.unshift = function(value) {
	return prepend(value, this);
};
proto.filter = function(predicate) {
	var lib = {
		predicate: predicate,
		add: appendǃ,
		step: function step(list, value) {
			return this.predicate(value) ? this.add(value, list) : list;
		}
	};
	return this.reduce(lib.step.bind(lib), this.empty());
};
proto.drop = function(n) {
	return drop(n, this);
};
proto.take = function(n) {
	return take(n, this);
};
proto.get = function(i, notFound) {
	return nth(i, this, notFound);
};
proto.nth = function(i) {
	return Maybe.of(nth(i, this, Maybe.Nothing()));
};
proto.update = function(i, value) {
	return update(i, value, this);
};
proto.slice = function(from, to) {
	if (typeof from == 'undefined') from = 0;
	if (typeof to == 'undefined') to = this.length;
	if (0 > to) to += this.length;
	if (0 > from) from += this.length;
	if (from > to) return empty();
	return this.take(to).drop(from);
};
proto.indexOf = function(value) {
	return this.find(function(_value) {
		return _value === value;
	}).index;
};
proto.includes = function(value) {
	return this.indexOf(value) !== -1;
};
proto.find = function(predicate) {
	return find(predicate, this);
};
proto._reduceHelper = reduce;
proto.reduce = function(fn, seed) {
	return this._reduceHelper(fn, seed, this);
};
proto.reduceRight = function(fn, seed) {
	return reduceRight(fn, seed, this);
};
proto.foldl = function(fn, seed) {
	return this.reduce(function(acc, value) {
		return fn(value, acc);
	}, seed);
};
proto.foldr = function(fn, seed) {
	return this.reduceRight(function(acc, value) {
		return fn(value, acc);
	}, seed);
};
proto.appendAll = proto.concat = function(iterable) {
	if (isList(iterable)) {
		return appendAll(this, iterable);
	}
	var lib = {
		add: append,
		step: function step(list, value) {
			return this.add(value, list);
		}
	};
	return Sequence.of(iterable).reduce(lib.step.bind(lib), this);
};
proto.every = function(predicate) {
	return find(function(value) {
			return !predicate(value);
		}, this).index == -1;
};
proto.some = function(predicate) {
	return find(predicate, this).index !== -1;
};
proto.removeAt = function(i) {
	return this.take(i).appendAll(this.drop(i + 1));
};
proto.remove = function(value) {
	var i = this.find(function(val) {
		return val === value;
	}).index;
	return i === -1 ? this : this.removeAt(i, value);
};
proto.insertAt = function(i, value) {
	return this.take(i).append(value).appendAll(this.drop(i));
};
function times(n, fn) {
	var vec = empty();
	var add = appendǃ;
	for (var i = 0; n > i; i++) {
		vec = add(fn(i), vec);
	}
	return vec;
}
List.times = proto.times = times;
function range(start, end) {
	return times(end - start, function(i) {
		return i + start;
	});
}
List.range = proto.range = range;
proto.intersperse = function(separator) {
	if (this.length < 2) return this;
	var lib = {
		add: appendǃ,
		separator: separator,
		FIRST: {},
		step: function step(acc, value) {
			if (acc === this.FIRST) {
				return this.add(value, empty());
			}
			return this.add(value, this.add(this.separator, acc));
		}
	};
	return this.reduce(lib.step.bind(lib), lib.FIRST);
};
proto.join = function(separator) {
	if (this.length == 0) return "";
	if (this.length == 1) return "" + this.get(0);
	var lib = {
		add: appendǃ,
		separator: separator,
		FIRST: {},
		step: function step(acc, value) {
			if (acc === this.FIRST) {
				return value + "";
			}
			return acc + this.separator + value;
		}
	};
	return this.reduce(lib.step.bind(lib), lib.FIRST);
};
proto.flatten = function() {
	return this.flatMap(function(x) {
		return x;
	});
};
proto.sort = function() {
	return this.sortWith(naturalSort);
};
proto.sortWith = function(fn) {
	return _fromArray(this.reduce(function(arr, value) {
		return arr.push(value);
	}, []).sort(fn));
};
function naturalSort(a, b) {
	"use strict";
	var re = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
		sre = /(^[ ]*|[ ]*$)/g,
		dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
		hre = /^0x[0-9a-f]+$/i,
		ore = /^0/,
		i = function i(s) {
			return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s;
		},
		x = i(a).replace(sre, '') || '',
		y = i(b).replace(sre, '') || '',
		xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
		yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0'),
		xD = parseInt(x.match(hre), 16) || xN.length !== 1 && x.match(dre) && Date.parse(x),
		yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
		oFxNcL,
		oFyNcL;
	if (yD) {
		if (xD < yD) {
			return -1;
		} else if (xD > yD) {
			return 1;
		}
	}
	for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
		oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
		oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
		if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
			return isNaN(oFxNcL) ? 1 : -1;
		}
		else if ((typeof oFxNcL === 'undefined' ? 'undefined' : _typeof(oFxNcL)) !== (typeof oFyNcL === 'undefined' ? 'undefined' : _typeof(oFyNcL))) {
			oFxNcL += '';
			oFyNcL += '';
		}
		if (oFxNcL < oFyNcL) {
			return -1;
		}
		if (oFxNcL > oFyNcL) {
			return 1;
		}
	}
	return 0;
}
proto.ap = function ap(values) {
	return this.map(function(fn) {
		return values.map(fn);
	});
};
proto.chain = proto.flatMap = function(fn) {
	function _addIn(list, value) {
		return Sequence.isCollection(value) ? Sequence.of(value).reduce(_addIn, list) : appendǃ(fn(value), list);
	}

	return this.reduce(_addIn, empty());
};
proto.traverse = function(fn, of) {
	this.reduce(function(list, next) {
		return of(next).map(function(x) {
			return function(y) {
				return y.concat([x]);
			};
		}).ap(list);
	}, fn(this.empty()));
	var prepend = function prepend(x) {
		return function(xs) {
			return [x].concat(xs);
		};
	};
	var applicative = of([]);
	this.reduceRight(function(applicative, value) {
		ap(map(prepend, fn(value)), applicative);
	}, of(this.empty()));
	return applicative;
};
proto.sequence = function(of) {
	this.traverse(of, function(x) {
		return x;
	});
};
var is = Object.is || function(x, y) {
		return x === y ? x !== 0 || 1 / x === 1 / y : x !== x && y !== y;
	};
function equiv(kompare, compare) {
	if (kompare === null || kompare === undefined) return false;
	if (is(kompare, compare)) return true;
	if (typeof kompare.equals == 'function') return kompare.equals(compare);
	return false;
}
proto.equals = function(b) {
	var a = this;
	if (is(a, b)) return true;
	if (b === null || b === undefined || !isList(b) || a.length !== b.length) return false;
	return this.find(function(value, i) {
			return !equiv(value, b.get(i));
		}, b).index == -1;
};

exports.List = List;
exports['default'] = List;
exports.Maybe = Maybe;
exports.Sequence = Sequence;
