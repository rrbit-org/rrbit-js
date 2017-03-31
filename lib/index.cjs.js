'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var CtorTrait = {
	factory: function(len) {
		throw new Error('please override make() with your factory function')
	},
	empty: function empty() {
		var vec = this.factory(0);
		vec.focus = 0;
		vec.focusEnd = 0;
		vec.focusStart = 0;
		vec.focusDepth = 1;
		vec.focusRelax = 0;
		vec.display0 = [];
		vec.display1 = null;
		vec.display2 = null;
		vec.display3 = null;
		vec.display4 = null;
		vec.display5 = null;
		vec.transient = false;
		vec.depth = 1;
		return vec;
	},
	fromFocusOf: function fromFocusOf(src) {
		var vec = this.factory(src.length);
		vec.length = src.length;
		vec.focusStart = src.focusStart;
		vec.focusDepth = src.focusDepth;
		vec.focusRelax = src.focusRelax;
		vec.focusEnd = src.focusEnd;
		vec.focus = src.focus;
		vec.depth = src.depth;
		vec.transient = false;
		vec.display0 = src.display0;
		vec.display1 = src.display1;
		vec.display2 = src.display2;
		vec.display3 = src.display3;
		vec.display4 = src.display4;
		vec.display5 = src.display5;
		return vec;
	}
};

function arraycopy$1(src, srcPos, dest, destPos, length) {
	var i = 0;
	while (i < length) {
		dest[i+destPos] = src[i+srcPos];
		i += 1;
	}
	return dest;
}








function last(arr) {
	return arr[arr.length - 1];
}
function makeIntArray(length) {
	var ints = new Array(length);
	for (var i = 0; length > i; i++) {
		ints[i] = 0;
	}
	return ints;
}

var TreeTrait = {
	arraycopy: arraycopy$1,
	aLast: last,
	makeIntArray: makeIntArray,
	EMPTY_TRANS_BLOCK: new Array(2),
	normalize: function normalize(_depth, rrb) {
		var this$1 = this;
		var currentLevel = rrb.focusDepth;
		var stabilizationIndex = rrb.focus | rrb.focusRelax;
		this.copyDisplaysAndStabilizeDisplayPath(currentLevel, stabilizationIndex, rrb);
		if (currentLevel < _depth) {
			var display = rrb['display' + currentLevel];
			do {
				var newDisplay = display.slice(0);
				var idx = (stabilizationIndex >> (5 * currentLevel)) & 31;
				switch (currentLevel) {
					case 1 :
						newDisplay[idx] = rrb.display0;
						rrb.display1 = this$1.withRecomputeSizes(newDisplay, 2, idx);
						display = rrb.display2;
						break;
					case 2 :
						newDisplay[idx] = rrb.display1;
						rrb.display2 = this$1.withRecomputeSizes(newDisplay, 3, idx);
						display = rrb.display3;
						break;
					case 3 :
						newDisplay[idx] = rrb.display2;
						rrb.display3 = this$1.withRecomputeSizes(newDisplay, 4, idx);
						display = rrb.display4;
						break;
					case 4 :
						newDisplay[idx] = rrb.display3;
						rrb.display4 = this$1.withRecomputeSizes(newDisplay, 5, idx);
						display = rrb.display5;
						break;
					case 5 :
						newDisplay[idx] = rrb.display4;
						rrb.display5 = this$1.withRecomputeSizes(newDisplay, 6, idx);
						break;
				}
				currentLevel += 1;
			} while (currentLevel < _depth)
		}
	},
	copyDisplaysAndStabilizeDisplayPath: function copyDisplaysAndStabilizeDisplayPath(depth, focus, rrb)
	{
		switch (depth) {
			case 1 :
				return rrb;
			case 2 :
				rrb.display1 = rrb.display1.slice(0);
				rrb.display1[(focus >> 5) & 31] = rrb.display0;
				return rrb;
			case 3 :
				rrb.display1 = rrb.display1.slice(0);
				rrb.display1[(focus >> 5) & 31] = rrb.display0;
				rrb.display2 = rrb.display2.slice(0);
				rrb.display2[(focus >> 10) & 31] = rrb.display1;
				return rrb;
			case 4 :
				rrb.display1 = rrb.display1.slice(0);
				rrb.display1[(focus >> 5) & 31] = rrb.display0;
				rrb.display2 = rrb.display2.slice(0);
				rrb.display2[(focus >> 10) & 31] = rrb.display1;
				rrb.display3 = rrb.display3.slice(0);
				rrb.display3[(focus >> 15) & 31] = rrb.display2;
				return rrb;
			case 5 :
				rrb.display1 = rrb.display1.slice(0);
				rrb.display1[(focus >> 5) & 31] = rrb.display0;
				rrb.display2 = rrb.display2.slice(0);
				rrb.display2[(focus >> 10) & 31] = rrb.display1;
				rrb.display3 = rrb.display3.slice(0);
				rrb.display3[(focus >> 15) & 31] = rrb.display2;
				rrb.display4 = rrb.display4.slice(0);
				rrb.display4[(focus >> 20) & 31] = rrb.display3;
				return rrb;
			case 6 :
				rrb.display1 = rrb.display1.slice(0);
				rrb.display1[(focus >> 5) & 31] = rrb.display0;
				rrb.display2 = rrb.display2.slice(0);
				rrb.display2[(focus >> 10) & 31] = rrb.display1;
				rrb.display3 = rrb.display3.slice(0);
				rrb.display3[(focus >> 15) & 31] = rrb.display2;
				rrb.display4 = rrb.display4.slice(0);
				rrb.display4[(focus >> 20) & 31] = rrb.display3;
				rrb.display5 = rrb.display5.slice(0);
				rrb.display5[(focus >> 25) & 31] = rrb.display4;
				return rrb;
		}
	},
	copyDisplays: function copyDisplays(depth, focus, list) {
		if (depth < 2) { return; }
		list.display1 = list.display1.slice(0, ((focus >> 5) & 31) + 1);
		if (depth < 3) { return; }
		list.display2 = list.display2.slice(0, ((focus >> 10) & 31) + 1);
		if (depth < 4) { return; }
		list.display3 = list.display3.slice(0, ((focus >> 10) & 31) + 1);
		if (depth < 5) { return; }
		list.display4 = list.display4.slice(0, ((focus >> 10) & 31) + 1);
		if (depth < 6) { return; }
		list.display5 = list.display5.slice(0, ((focus >> 25) & 31) + 1);
	},
	makeTransientIfNeeded: function makeTransientIfNeeded(list) {
		if (list.depth > 1 && !list.transient) {
			this.copyDisplaysAndNullFocusedBranch(list.depth, list.focus | list.focusRelax, list);
			list.transient = true;
		}
	},
	withRecomputeSizes: function withRecomputeSizes(node, currentDepth, branchToUpdate) {
		var end = node.length - 1;
		var oldSizes = node[end];
		if (oldSizes != null) {
			var newSizes = this.makeIntArray(end);
			var delta = this.treeSize(node[branchToUpdate] || [], currentDepth - 1);
			if (branchToUpdate > 0)
				{ this.arraycopy(oldSizes, 0, newSizes, 0, branchToUpdate); }
			var i = branchToUpdate;
			while (i < end) {
				newSizes[i] = (oldSizes[i] || 0) + delta;
				i += 1;
			}
			if (this.notBalanced(node, newSizes, currentDepth, end)) {
				node[end] = newSizes;
			}
		}
		return node;
	},
	notBalanced: function notBalanced(node, sizes, currentDepth, end) {
		if (end == 1 ||
			sizes[end - 2] != ((end - 1) << (5 * (currentDepth - 1))))
			{ return true; }
		var last$$1 = node[end - 1];
		return (currentDepth > 2 && last$$1[last$$1.length - 1] != null);
	},
	treeSize: function treeSize(node, currentDepth) {
		return this.treeSizeRecur(node, currentDepth, 0);
	},
	treeSizeRecur: function treeSizeRecur(node, currentDepth, acc) {
		if (currentDepth == 1) {
			return acc + node.length
		}
		var sizes = node[node.length - 1];
		if (sizes != null)
			{ return acc + sizes[sizes.length - 1]; }
		var len = node.length;
		return treeSizeRecur(node[len - 2], currentDepth - 1, acc + (len - 2) * (1 << (5 * (currentDepth - 1))))
	},
	getIndexInSizes: function getIndexInSizes(sizes, indexInSubTree) {
		if (indexInSubTree == 0) { return 0; }
		var is = 0;
		while (sizes[is] <= indexInSubTree)
			{ is += 1; }
		return is;
	},
	focusOnLastBlock: function focusOnLastBlock(_length, list) {
		if (((list.focusStart + list.focus) ^ (_length - 1)) >= 32) {
			return this.normalizeAndFocusOn(_length - 1, list);
		}
		return list;
	},
	focusOnFirstBlock: function focusOnFirstBlock(list) {
		if (list.focusStart != 0 || (list.focus & -32) != 0) {
			return this.normalizeAndFocusOn(0, list);
		}
		return list;
	},
	normalizeAndFocusOn: function normalizeAndFocusOn(index, rrb) {
		if (rrb.transient) {
			this.normalize(rrb.depth, rrb);
			rrb.transient = false;
		}
		return this.focusOn(index, rrb);
	},
	focusOn: function focusOn(index, rrb) {
		var focusStart = rrb.focusStart;
		var focusEnd = rrb.focusEnd;
		var focus = rrb.focus;
		if (focusStart <= index && index < focusEnd) {
			var indexInFocus = index - focusStart;
			var xor = indexInFocus ^ focus;
			if (xor >= 32)
				{ this.gotoPos(indexInFocus, xor, rrb); }
			rrb.focus = indexInFocus;
		} else {
			this.gotoPosFromRoot(index, rrb);
		}
		return rrb;
	},
	gotoPos: function gotoPos(index, xor, rrb) {
		var d1, d2, d3, d4;
		if (xor < 32) { return; }
		if (xor < 1024) {
			rrb.display0 = rrb.display1[(index >> 5) & 31];
		} else if (xor < 32768) {
			d1 = rrb.display2[(index >> 10) & 31];
			rrb.display1 = d1;
			rrb.display0 = d1[(index >> 5) & 31];
		} else if (xor < 1048576) {
			d2 = rrb.display3[(index >> 15) & 31];
			d1 = d2[(index >> 10) & 31];
			rrb.display2 = d2;
			rrb.display1 = d1;
			rrb.display0 = d1[(index >> 5) & 31];
		} else if (xor < 33554432) {
			d3 = rrb.display4[(index >> 20) & 31];
			d2 = d3[(index >> 15) & 31];
			d1 = d2[(index >> 10) & 31];
			rrb.display3 = d3;
			rrb.display2 = d2;
			rrb.display1 = d1;
			rrb.display0 = d1[(index >> 5) & 31];
		} else if (xor < 1073741824) {
			d4 = rrb.display5[(index >> 25) & 31];
			d3 = d4[(index >> 20) & 31];
			d2 = d3[(index >> 15) & 31];
			d1 = d2[(index >> 10) & 31];
			rrb.display4 = d4;
			rrb.display3 = d3;
			rrb.display2 = d2;
			rrb.display1 = d1;
			rrb.display0 = d1[(index >> 5) & 31];
		}
	},
	gotoPosFromRoot: function gotoPosFromRoot(index, rrb) {
		var this$1 = this;
		var length = rrb.length;
		var depth = rrb.depth;
		var _startIndex = 0;
		var _focusRelax = 0;
		if (depth > 1) {
			var display = rrb['display' + (depth - 1)];
			do {
				var sizes = display[display.length - 1];
				if (sizes == null) {
					break;
				}
				var is = this$1.getIndexInSizes(sizes, index - _startIndex);
				display = display[is];
				if (depth == 2) {
					rrb.display0 = display;
					break;
				} else if (depth == 3) {
					rrb.display1 = display;
				} else if (depth == 4) {
					rrb.display2 = display;
				} else if (depth == 5) {
					rrb.display3 = display;
				} else if (depth == 6) {
					rrb.display4 = display;
				}
				if (is < sizes.length - 1)
					{ length = _startIndex + sizes[is]; }
				if (is != 0)
					{ _startIndex += sizes[is - 1]; }
				depth -= 1;
				_focusRelax |= is << (5 * depth);
			} while (sizes != null)
		}
		var indexInFocus = index - _startIndex;
		this.gotoPos(indexInFocus, 1 << (5 * (depth - 1)), rrb);
		rrb.focus = indexInFocus;
		rrb.focusStart = _startIndex;
		rrb.focusEnd = length;
		rrb.focusDepth = depth;
		rrb.focusRelax = _focusRelax;
	},
	copyDisplaysAndNullFocusedBranch: function copyDisplaysAndNullFocusedBranch(depth, focus, list) {
		switch (depth) {
			case 2 :
				list.display1 = this.copyOfAndNull(list.display1, (focus >> 5) & 31);
				return;
			case 3 :
				list.display1 = this.copyOfAndNull(list.display1, (focus >> 5) & 31);
				list.display2 = this.copyOfAndNull(list.display2, (focus >> 10) & 31);
				return;
			case 4 :
				list.display1 = this.copyOfAndNull(list.display1, (focus >> 5) & 31);
				list.display2 = this.copyOfAndNull(list.display2, (focus >> 10) & 31);
				list.display3 = this.copyOfAndNull(list.display3, (focus >> 15) & 31);
				return;
			case 5 :
				list.display1 = this.copyOfAndNull(list.display1, (focus >> 5) & 31);
				list.display2 = this.copyOfAndNull(list.display2, (focus >> 10) & 31);
				list.display3 = this.copyOfAndNull(list.display3, (focus >> 15) & 31);
				list.display4 = this.copyOfAndNull(list.display4, (focus >> 20) & 31);
				return;
			case 6 :
				list.display1 = this.copyOfAndNull(list.display1, (focus >> 5) & 31);
				list.display2 = this.copyOfAndNull(list.display2, (focus >> 10) & 31);
				list.display3 = this.copyOfAndNull(list.display3, (focus >> 15) & 31);
				list.display4 = this.copyOfAndNull(list.display4, (focus >> 20) & 31);
				list.display5 = this.copyOfAndNull(list.display5, (focus >> 25) & 31);
				return
		}
	},
	copyOfAndNull: function copyOfAndNull(array, nullIndex) {
		var len = array.length;
		var newArray = array.slice(0);
		newArray[nullIndex] = null;
		var sizes = array[len - 1];
		if (sizes != null) {
			newArray[len - 1] = this.makeTransientSizes(sizes, nullIndex);
		}
		return newArray;
	},
	makeTransientSizes: function makeTransientSizes(oldSizes, transientBranchIndex) {
		var newSizes = this.makeIntArray(oldSizes.length);
		var delta = oldSizes[transientBranchIndex];
		var i = transientBranchIndex;
		if (transientBranchIndex > 0) {
			delta -= oldSizes[transientBranchIndex - 1];
			for (var n = 0; transientBranchIndex > n; n++) {
				newSizes[n] = oldSizes[n];
			}
		}
		var len = newSizes.length;
		while (i < len) {
			newSizes[i] = (oldSizes[i] || 0) - delta;
			i += 1;
		}
		return newSizes;
	},
	setupNewBlockInNextBranch: function setupNewBlockInNextBranch(xor, transient, list) {
		var _depth = xor < 1024 ? 1 :
			(xor < 32768 ? 2 :
				(xor < 1048576 ? 3 :
					(xor < 33554432 ? 4 :
						(xor < 1073741824 ? 5 : 6))));
		if (list.transient && _depth !== 1)
			{ this.normalize(_depth, list); }
		if (list.depth == _depth) {
			list.depth = _depth + 1;
			if (_depth === 1) {
				list.display1 = [list.display0, null, null];
			} else {
				list['display' + _depth] = this.makeNewRoot0(list['display' + (_depth - 1)]);
			}
		} else {
			var newRoot = this.copyAndIncRightRoot(list['display' + _depth], list.transient, _depth);
			if (list.transient) {
				var transientBranch = newRoot.length - 3;
				newRoot[transientBranch] = list['display' + (_depth - 1)];
				this.withRecomputeSizes(newRoot, _depth + 1, transientBranch);
				list['display' + _depth] = newRoot;
			}
		}
		switch (_depth) {
			case 5:
				list.display4 = this.EMPTY_TRANS_BLOCK;
			case 4:
				list.display3 = this.EMPTY_TRANS_BLOCK;
			case 3:
				list.display2 = this.EMPTY_TRANS_BLOCK;
			case 2:
				list.display1 = this.EMPTY_TRANS_BLOCK;
			case 1:
				list.display0 = new Array(1);
		}
	},
	setupNewBlockInInitBranch: function setupNewBlockInInitBranch(_depth, transient, list) {
		if (list.transient && _depth !== 2)
			{ this.normalize(_depth - 1, list); }
		if (list.depth === (_depth - 1)) {
			list.depth = _depth;
			var delta = _depth == 2 ? list.display0.length : this.treeSize(list['display' + (_depth - 2)], _depth - 1);
			list['display' + (_depth - 1)] = [null, list['display' + (_depth - 2)], [0, delta]];
		} else {
			var newRoot = this.copyAndIncLeftRoot(list['display' + (_depth - 1)], list.transient, _depth - 1);
			if (list.transient) {
				this.withRecomputeSizes(newRoot, _depth, 1);
				newRoot[1] = list['display' + (_depth - 2)];
			}
			list['display' + (_depth - 1)] = newRoot;
		}
		switch (_depth) {
			case 6:
				list.display4 = this.EMPTY_TRANS_BLOCK;
			case 5:
				list.display3 = this.EMPTY_TRANS_BLOCK;
			case 4:
				list.display2 = this.EMPTY_TRANS_BLOCK;
			case 3:
				list.display1 = this.EMPTY_TRANS_BLOCK;
			case 2:
				list.display0 = new Array(1);
		}
	},
	withComputedSizes: function withComputedSizes(node, currentDepth) {
		var this$1 = this;
		var i = 0;
		var acc = 0;
		var end = node.length - 1;
		if (end > 1) {
			var sizes = new Array(end);
			while (i < end) {
				acc += this$1.treeSize(node[i], currentDepth - 1);
				sizes[i] = acc;
				i += 1;
			}
			if (this.notBalanced(node, sizes, currentDepth, end))
				{ node[end] = sizes; }
		} else if (end == 1 && currentDepth > 2) {
			var childSizes = this.aLast(node[0]);
			if (childSizes != null) {
				node[end] = childSizes.length != 1 ? [childSizes[childSizes.length - 1]] : childSizes;
			}
		}
		return node;
	},
	withComputedSizes1: function withComputedSizes1(node) {
		var i = 0;
		var acc = 0;
		var end = node.length - 1;
		if (end > 1) {
			var sizes = new Array(end);
			while (i < end) {
				acc += node[i].length;
				sizes[i] = acc;
				i += 1;
			}
			if (sizes(end - 2) != ((end - 1) << 5))
				{ node[end] = sizes; }
		}
		return node;
	},
	makeNewRoot0: function makeNewRoot0(node/* Array<T>*/) {
		var dLen = node.length;
		var dSizes = node[dLen - 1];
		var sizes = null;
		if (dSizes != null) {
			var dSize = dSizes[dLen - 2] || 0;
			sizes = [dSize, dSize];
		}
		return [node, null, sizes];
	},
	makeNewRoot1: function makeNewRoot1(node, currentDepth) {
		return [null, node, [0, this.treeSize(node, currentDepth - 1)]]
	},
	copyAndIncRightRoot: function copyAndIncRightRoot(node, transient, currentLevel) {
		var len = node.length;
		var newRoot = new Array(len + 1);
		this.arraycopy(node, 0, newRoot, 0, len - 1);
		var oldSizes = node[len - 1];
		if (oldSizes != null) {
			var newSizes = this.makeIntArray(len);
			this.arraycopy(oldSizes, 0, newSizes, 0, len - 1);
			if (transient) {
				newSizes[len - 1] = 1 << (5 * currentLevel);
			}
			newSizes[len - 1] = newSizes[len - 2] || 0;
			newRoot[len] = newSizes;
		}
		return newRoot
	},
	copyAndIncLeftRoot: function copyAndIncLeftRoot(node, transient, currentLevel) {
		var len = node.length;
		var newRoot = new Array(len + 1);
		this.arraycopy(node, 0, newRoot, 1, len - 1);
		var oldSizes = node[len - 1];
		var newSizes = this.makeIntArray(len);
		if (oldSizes != null) {
			if (transient) {
				this.arraycopy(oldSizes, 1, newSizes, 2, len - 2);
			} else {
				this.arraycopy(oldSizes, 0, newSizes, 1, len - 1);
			}
		} else {
			var subTreeSize = 1 << (5 * currentLevel);
			var acc = 0;
			var i = 1;
			while (i < len - 1) {
				acc += subTreeSize;
				newSizes[i] = acc;
				i += 1;
			}
			newSizes[i] = acc + this.treeSize(node[node.length - 2], currentLevel);
		}
		newRoot[len] = newSizes;
		return newRoot
	},
	stabilizeDisplayPath: function stabilizeDisplayPath(depth, focus, list) {
		switch (depth) {
			case 1:
				return;
			case 2 :
				list.display1[(focus >> 5) & 31] = list.display0;
				return;
			case 3 :
				list.display2[(focus >> 10) & 31] = list.display1;
				list.display1[(focus >> 5 ) & 31] = list.display0;
				return;
			case 4 :
				list.display3[(focus >> 15) & 31] = list.display2;
				list.display2[(focus >> 10) & 31] = list.display1;
				list.display1[(focus >> 5 ) & 31] = list.display0;
				return;
			case 5 :
				list.display4[(focus >> 20) & 31] = list.display3;
				list.display3[(focus >> 15) & 31] = list.display2;
				list.display2[(focus >> 10) & 31] = list.display1;
				list.display1[(focus >> 5 ) & 31] = list.display0;
				return;
			case 6 :
				list.display5[(focus >> 25) & 31] = list.display4;
				list.display4[(focus >> 20) & 31] = list.display3;
				list.display3[(focus >> 15) & 31] = list.display2;
				list.display2[(focus >> 10) & 31] = list.display1;
				list.display1[(focus >> 5 ) & 31] = list.display0;
				return
		}
	},
	computeBranching: function computeBranching(displayLeft, concat, displayRight, currentDepth) {
		var leftLength = (displayLeft == null) ? 0 : displayLeft.length - 1;
		var concatLength = (concat == null) ? 0 : concat.length - 1;
		var rightLength = (displayRight == null) ? 0 : displayRight.length - 1;
		var branching = 0;
		if (currentDepth == 1) {
			branching = leftLength + concatLength + rightLength;
			if (leftLength != 0)
				{ branching -= 1; }
			if (rightLength != 0)
				{ branching -= 1; }
		} else {
			var i = 0;
			while (i < leftLength - 1) {
				branching += displayLeft[i].length;
				i += 1;
			}
			i = 0;
			while (i < concatLength) {
				branching += concat[i].length;
				i += 1;
			}
			i = 1;
			while (i < rightLength) {
				branching += displayRight[i].length;
				i += 1;
			}
			if (currentDepth != 2) {
				branching -= leftLength + concatLength + rightLength;
				if (leftLength != 0)
					{ branching += 1; }
				if (rightLength != 0)
					{ branching += 1; }
			}
		}
		return branching;
	},
	depthFromLength: function depthFromLength(len) {
		return (len < 1024 ? 1 : (
					len < 32768 ? 2 : (
							len < 1048576 ? 3 : (
									len < 33554432 ? 4 : (
											len < 1073741824 ? 5 : 6)))));
	}
};

var AppendTrait = Object.assign({}, CtorTrait,
	TreeTrait,
	{append: function append(value, list) {
		if (list.length === 0) {
			var vec = this.empty();
			vec.length = 1;
			vec.focusEnd = 1;
			vec.display0 = [value];
			return vec;
		}
		var vec = this.fromFocusOf(list);
		vec.transient = list.transient;
		var oldLen = list.length;
		vec.length += 1;
		if (((vec.focusStart + vec.focus) ^ (oldLen - 1)) >= 32) {
			this.normalizeAndFocusOn(oldLen - 1, vec);
		}
		var elemIndexInBlock = (oldLen - vec.focusStart) & 31;
		if (elemIndexInBlock === 0) {
			this._appendBackNewBlock(value, oldLen, vec);
		} else {
			vec.focusEnd = vec.length;
			var d0 = vec.display0.slice(0);
			d0[elemIndexInBlock] = value;
			vec.display0 = d0;
			this.makeTransientIfNeeded(vec);
		}
		return vec;
	},
	appendǃ: function append_(value, vec) {
		if (vec.length === 0) {
			vec.length = 1;
			vec.focusEnd = 1;
			vec.display0 = [value];
			return vec;
		}
		var oldLen = vec.length;
		vec.length += 1;
		if (((vec.focusStart + vec.focus) ^ (oldLen - 1)) >= 32) {
			this.normalizeAndFocusOn(oldLen - 1, vec);
		}
		var elemIndexInBlock = (oldLen - vec.focusStart) & 31;
		if (elemIndexInBlock === 0) {
			this._appendBackNewBlock(value, oldLen, vec);
		} else {
			vec.focusEnd = vec.length;
			vec.display0[elemIndexInBlock] = value;
			this.makeTransientIfNeeded(vec);
		}
		return vec;
	},
	_appendBackNewBlock: function _appendBackNewBlock(elem, _length, list) {
		var this$1 = this;
		var oldDepth = list.depth;
		var newRelaxedIndex = _length - list.focusStart + list.focusRelax;
		var focusJoined = list.focus | list.focusRelax;
		var xor = newRelaxedIndex ^ focusJoined;
		this.setupNewBlockInNextBranch(xor, list.transient, list);
		if (oldDepth == list.depth) {
			var i = xor < 1024 ? 2 :
				(xor < 32768 ? 3 :
					(xor < 1048576 ? 4 :
						(xor < 33554432 ? 5 :
							6)));
			if (i < oldDepth) {
				var _focusDepth = list.focusDepth;
				var display = list['display' + i];
				do {
					var displayLen = display.length - 1;
					var oldSizes = display[displayLen];
					var newSizes = (i >= _focusDepth && oldSizes != null) ?
						this$1.makeTransientSizes(oldSizes, displayLen - 1)
						: null;
					var newDisplay = new Array(display.length);
					this$1.arraycopy(display, 0, newDisplay, 0, displayLen - 1);
					if (i >= _focusDepth)
						{ newDisplay[displayLen] = newSizes; }
					switch (i) {
						case 2 :
							list.display2 = newDisplay;
							display = list.display3;
							break;
						case 3 :
							list.display3 = newDisplay;
							display = list.display4;
							break;
						case 4 :
							list.display4 = newDisplay;
							display = list.display5;
							break;
						case 5 :
							list.display5 = newDisplay;
					}
					i += 1;
				} while (i < oldDepth)
			}
		}
		if (oldDepth == list.focusDepth) {
			list.focus = _length;
			list.focusStart = 0;
			list.focusDepth = list.depth;
			list.focusRelax = 0;
		} else {
			list.focus = 0;
			list.focusStart = _length;
			list.focusDepth = 1;
			list.focusRelax = newRelaxedIndex & -32;
		}
		list.focusEnd = _length + 1;
		list.display0[0] = elem;
		list.transient = true;
	}});

var NthTrait = Object.assign({}, TreeTrait,
	{nth: function nth(index, list, notFound) {
		var focusStart = list.focusStart;
		var focusEnd = list.focusEnd;
		var focus = list.focus;
		var length = list.length;
		if (index < 0)
			{ index += length; }
		if (index < 0 || length <= index) {
			return notFound
		}
		if (focusStart <= index && index < focusEnd) {
			var indexInFocus = index - focusStart;
			return this._getElemInFocus(indexInFocus, indexInFocus ^ focus, list, notFound);
		}
		if (list.transient) {
			this.normalize(list.depth, list);
			list.transient = false;
		}
		return this._getElementFromRoot(index, list)
	},
	_getElemInFocus: function _getElemInFocus(index, xor, list, notFound){
		if (xor < 32) { return this._getElemD(1, index, list.display0); }
		if (xor < 1024) { return this._getElemD(2, index, list.display1); }
		if (xor < 32768) { return this._getElemD(3, index, list.display2); }
		if (xor < 1048576) { return this._getElemD(4, index, list.display3); }
		if (xor < 33554432) { return this._getElemD(5, index, list.display4); }
		if (xor < 1073741824) { return this._getElemD(6, index, list.display5); }
		return notFound;
	},
	_getElementFromRoot: function _getElementFromRoot(index, list) {
		var this$1 = this;
		var depth = list.depth;
		var display = list["display" + (depth - 1)];
		var sizes = display[display.length - 1];
		do {
			var sizesIdx = this$1.getIndexInSizes(sizes, index);
			if (sizesIdx != 0)
				{ index -= sizes[sizesIdx - 1]; }
			display = display[sizesIdx];
			if (depth > 2)
				{ sizes = display[display.length - 1]; }
			else
				{ sizes = null; }
			depth -= 1;
		} while (sizes != null);
		return this._getElemD(depth, index, display);
	},
	_getElemD: function _getElemD(depth, i, display) {
		switch (depth) {
			case 6:
				return display[(i >> 25) & 31][(i >> 20) & 31][(i >> 15) & 31][(i >> 10) & 31][(i >> 5) & 31][(i & 31)];
			case 5:
				return display[(i >> 20) & 31][(i >> 15) & 31][(i >> 10) & 31][(i >> 5) & 31][(i & 31)];
			case 4:
				return display[(i >> 15) & 31][(i >> 10) & 31][(i >> 5) & 31][(i & 31)];
			case 3:
				return display[(i >> 10) & 31][(i >> 5) & 31][(i & 31)];
			case 2:
				return display[(i >> 5) & 31][(i & 31)];
			case 1:
				return display[(i & 31)]
		}
	}});

var AppendAllTrait = Object.assign({}, NthTrait,
	AppendTrait,
	{appendAll: function appendAll(left, right) {
		if (left.length == 0) { return right; }
		if (right.length == 0) { return left; }
		var vec = this.fromFocusOf(left);
		vec.length = left.length;
		vec.transient = left.transient;
		if (1024 > left.length && right.length <= 32) {
			return this._appendLeafs(vec, right);
		}
		return this._mergeTrees(vec, right);
	},
	_appendLeafs: function _appendLeafs(left, right) {
		var this$1 = this;
		var _right = right.display0;
		var currentEndIndex = left.length;
		var newEndIndex = left.length = currentEndIndex + right.length;
		this.focusOnLastBlock(currentEndIndex, left);
		this.makeTransientIfNeeded(left);
		var i = 0;
		while (currentEndIndex < newEndIndex) {
			var elemIndexInBlock = (currentEndIndex - left.focusStart) & 31;
			if (elemIndexInBlock != 0) {
				var batchSize = Math.min(32 - elemIndexInBlock, _right.length - i);
				var d0 = new Array(elemIndexInBlock + batchSize);
				this$1.arraycopy(left.display0, 0, d0, 0, elemIndexInBlock);
				this$1.arraycopy(right.display0, i, d0, elemIndexInBlock, batchSize);
				left.display0 = d0;
				currentEndIndex += batchSize;
				left.focusEnd = currentEndIndex;
				i += batchSize;
			} else /* next element will go in a new block position */ {
				this$1._appendBackNewBlock(this$1.nth(i, right), currentEndIndex, left);
				currentEndIndex += 1;
				i += 1;
			}
		}
		return left;
	},
	_mergeTrees: function _mergeTrees(left, that) {
		var d0 = null;
		var d1 = null;
		var d2 = null;
		var d3 = null;
		var d4 = null;
		var d5 = null;
		var concat;
		var currentSize = left.length;
		left.length = left.length + that.length;
		var thisDepth = left.depth;
		var thatDepth = that.depth;
		if (left.transient) {
			this.normalize(thisDepth, left);
			left.transient = false;
		}
		if (that.transient) {
			this.normalize(thatDepth, that);
			that.transient = false;
		}
		this.focusOn(currentSize - 1, left);
		var maxDepth = Math.max(left.depth, that.depth);
		if (maxDepth === 1) {
			concat = this._rebalancedLeafs(left.display0, that.display0, true);
			return this._initFromRoot(concat, currentSize <= 32 ? 1 : 2, left);
		}
		if (((that.focus | that.focusRelax) & -32) == 0) {
			d5 = that.display5;
			d4 = that.display4;
			d3 = that.display3;
			d2 = that.display2;
			d1 = that.display1;
			d0 = that.display0;
		} else {
			d5 = that.display5;
			d4 = d5 ? d5[0] : that.display4;
			d3 = d4 ? d4[0] : that.display3;
			d2 = d3 ? d3[0] : that.display2;
			d1 = d2 ? d2[0] : that.display1;
			d0 = d1 ? d1[0] : that.display0;
		}
		concat = this._rebalancedLeafs(left.display0, d0, false);
		concat = this._rebalanced(left.display1, concat, d1, 2);
		if (maxDepth >= 3)
			{ concat = this._rebalanced(left.display2, concat, d2, 3); }
		if (maxDepth >= 4)
			{ concat = this._rebalanced(left.display3, concat, d3, 4); }
		if (maxDepth >= 5)
			{ concat = this._rebalanced(left.display4, concat, d4, 5); }
		if (maxDepth == 6)
			{ concat = this._rebalanced(left.display5, concat, d5, 6); }
		if (concat.length == 2) {
			this._initFromRoot(concat[0], maxDepth, left);
		} else {
			this._initFromRoot(this.withComputedSizes(concat, maxDepth + 1), maxDepth + 1, left);
		}
		return left;
	},
	_rebalancedLeafs: function _rebalancedLeafs(displayLeft, displayRight, isTop) {
		var leftLength = displayLeft.length;
		var rightLength = displayRight.length;
		if (leftLength == 32) {
			return [displayLeft, displayRight, null];
		} else if (leftLength + rightLength <= 32) {
			var mergedDisplay = new Array(leftLength + rightLength);
			this.arraycopy(displayLeft, 0, mergedDisplay, 0, leftLength);
			this.arraycopy(displayRight, 0, mergedDisplay, leftLength, rightLength);
			return isTop ? mergedDisplay : [mergedDisplay, null];
		}
		var arr0 = new Array(32);
		var arr1 = new Array(leftLength + rightLength - 32);
		this.arraycopy(displayLeft, 0, arr0, 0, leftLength);
		this.arraycopy(displayRight, 0, arr0, leftLength, 32 - leftLength);
		this.arraycopy(displayRight, 32 - leftLength, arr1, 0, rightLength - 32 + leftLength);
		return [arr0, arr1, null];
	},
	_rebalanced: function _rebalanced(displayLeft, concat, displayRight, currentDepth) {
		var this$1 = this;
		var leftLength = (displayLeft == null) ? 0 : displayLeft.length - 1;
		var concatLength = (concat == null) ? 0 : concat.length - 1;
		var rightLength = (displayRight == null) ? 0 : displayRight.length - 1;
		var branching = this.computeBranching(displayLeft, concat, displayRight, currentDepth);
		var top = new Array((branching >> 10) + (((branching & 1023) == 0) ? 1 : 2));
		var mid = new Array(((branching >> 10) == 0) ? ((branching + 31) >> 5) + 1 : 33);
		var bot;
		var iSizes = 0;
		var iTop = 0;
		var iMid = 0;
		var iBot = 0;
		var i = 0;
		var j = 0;
		var d = 0;
		var currentDisplay;
		var displayEnd = 0;
		do {
			switch (d) {
				case 0 :
					if (displayLeft != null) {
						currentDisplay = displayLeft;
						displayEnd = (concat == null) ? leftLength : leftLength - 1;
					}
					break;
				case 1 :
					if (concat == null)
						{ displayEnd = 0; }
					else {
						currentDisplay = concat;
						displayEnd = concatLength;
					}
					i = 0;
					break;
				case 2 :
					if (displayRight != null) {
						currentDisplay = displayRight;
						displayEnd = rightLength;
						i = (concat == null) ? 0 : 1;
					}
					break;
			}
			while (i < displayEnd) {
				var displayValue = currentDisplay[i];
				var displayValueEnd = (currentDepth == 2) ? displayValue.length : displayValue.length - 1;
				if ((iBot | j) == 0 && displayValueEnd == 32) {
					if (currentDepth != 2 && bot != null) {
						this$1.withComputedSizes(bot, currentDepth - 1);
						bot = null;
					}
					mid[iMid] = displayValue;
					i += 1;
					iMid += 1;
					iSizes += 1;
				} else {
					var numElementsToCopy = Math.min(displayValueEnd - j, 32 - iBot);
					if (iBot == 0) {
						if (currentDepth != 2 && bot != null)
							{ this$1.withComputedSizes(bot, currentDepth - 1); }
						var _min = (branching - (iTop << 10) - (iMid << 5), 32);
						var __len = Math.min(branching - (iTop << 10) - (iMid << 5), 32) + (currentDepth == 2 ? 0 : 1);
						if (__len !== 32) {
							'foo';
						} else {
							'foo';
						}
						bot = new Array(__len);
						mid[iMid] = bot;
					}
					arraycopy$1(displayValue, j, bot, iBot, numElementsToCopy);
					j += numElementsToCopy;
					iBot += numElementsToCopy;
					if (j == displayValueEnd) {
						i += 1;
						j = 0;
					}
					if (iBot == 32) {
						iMid += 1;
						iBot = 0;
						iSizes += 1;
						if (currentDepth != 2 && bot != null)
							{ this$1.withComputedSizes(bot, currentDepth - 1); }
					}
				}
				if (iMid == 32) {
					top[iTop] = (currentDepth == 1) ? this$1.withComputedSizes1(mid) : this$1.withComputedSizes(mid, currentDepth);
					iTop += 1;
					iMid = 0;
					var remainingBranches = branching - ((iTop << 10) | (iMid << 5) | iBot);
					if (remainingBranches > 0)
						{ mid = new Array(((remainingBranches >> 10) == 0) ? (remainingBranches + 63) >> 5 : 33); }
					else
						{ mid = null; }
				}
			}
			d += 1;
		} while (d < 3);
		if (currentDepth != 2 && bot != null)
			{ this.withComputedSizes(bot, currentDepth - 1); }
		if (mid != null)
			{ top[iTop] = (currentDepth == 1) ? this.withComputedSizes1(mid) : this.withComputedSizes(mid, currentDepth); }
		return top
	},
	_initFromRoot: function _initFromRoot(root, depth, rrb) {
		rrb['display' + (depth - 1)] = root;
		rrb.depth = depth;
		rrb.focusEnd = rrb.focusStart;
		rrb['display' + (depth - 1)] = root;
		this.focusOn(0, rrb);
		return rrb;
	}});

var DropTrait = Object.assign({}, CtorTrait,
	TreeTrait,
	{drop: function drop(n, rrb) {
		var this$1 = this;
		if (n <= 0)
			{ return rrb; }
		if (n >= rrb.length)
			{ return this.empty(); }
		if (rrb.transient) {
			this.normalize(rrb.depth, rrb);
			rrb.transient = false;
		}
		var vec = this.fromFocusOf(rrb);
		vec.length = rrb.length - n;
		if (vec.depth > 1) {
			this.focusOn(n, vec);
			var cutIndex = vec.focus | vec.focusRelax;
			var d0Start = cutIndex & 31;
			if (d0Start != 0) {
				var d0len = vec.display0.length - d0Start;
				vec.display0 = this.arraycopy(vec.display0, d0Start, new Array(d0len), 0, d0len);
			}
			this._cleanTopDrop(cutIndex, vec);
			if (vec.depth > 1) {
				var i = 2;
				var display = vec.display1;
				while (i <= vec.depth) {
					var splitStart = (cutIndex >> (5 * (i - 1))) & 31;
					var newLen = display.length - splitStart - 1;
					var newDisplay = this$1.arraycopy(display, splitStart + 1, new Array(newLen + 1), 1, newLen - 1);
					if (i > 1) {
						newDisplay[0] = vec['display' + (i - 2)];
						vec['display' + (i - 1)] = this$1.withComputedSizes(newDisplay, i);
						if (display < 6)
							{ display = vec['display' + i]; }
					}
					i += 1;
				}
			}
			vec.focusEnd = vec.display0.length;
		} else {
			var newLen = vec.display0.length - n;
			vec.focusEnd = newLen;
			vec.display0 = this.arraycopy(vec.display0, n, new Array(newLen), 0, newLen);
		}
		vec.focus = 0;
		vec.focusStart = 0;
		vec.focusDepth = 1;
		vec.focusRelax = 0;
		return vec
	},
	_cleanTopDrop: function _cleanTopDrop(cutIndex, rrb) {
		var newDepth = 0;
		var depth = rrb.depth;
		var display1 = rrb.display1;
		var display2 = rrb.display2;
		var display3 = rrb.display3;
		var display4 = rrb.display4;
		var display5 = rrb.display5;
		if (depth == 1)
			{ return; }
		if (depth < 6 || (cutIndex >> 25) == display5.length - 2) {
			rrb.display5 = null;
			if (depth < 5 || (cutIndex >> 20) == display4.length - 2) {
				rrb.display4 = null;
				if (depth < 4 || (cutIndex >> 15) == display3.length - 2) {
					rrb.display3 = null;
					if (depth < 3 || (cutIndex >> 10) == display2.length - 2) {
						rrb.display2 = null;
						if ((cutIndex >> 5) == display1.length - 2) {
							rrb.display1 = null;
							newDepth = 1;
						} else
							{ newDepth = 2; }
					} else
						{ newDepth = 3; }
				} else
					{ newDepth = 4; }
			} else
				{ newDepth = 5; }
		} else
			{ newDepth = 6; }
		rrb.depth = newDepth;
	}});

var TakeTrait = Object.assign({}, CtorTrait,
	TreeTrait,
	{take: function take(n, rrb) {
		var this$1 = this;
		if (0 >= n) {
			return this.empty();
		}
		if (n >= rrb.length) {
			return rrb;
		}
		if (rrb.transient) {
			this.normalize(rrb.depth, rrb);
			rrb.transient = false;
		}
		var vec = this.fromFocusOf(rrb);
		vec.length = n;
		vec.focusEnd = n;
		if (rrb.depth > 1) {
			this.focusOn(n - 1, vec);
			var focusInblock = (vec.focus & 31) + 1;
			if (focusInblock != 32) {
				vec.display0 = vec.display0.slice(0, focusInblock);
			}
			var cutIndex = vec.focus | vec.focusRelax;
			this._cleanTopTake(cutIndex, vec);
			vec.focusDepth = Math.min(vec.depth, vec.focusDepth);
			if (!(vec.depth > 1))
				{ return vec; }
			this.copyDisplays(vec.focusDepth, cutIndex, vec);
			var i = vec.depth;
			var offset = 0;
			while (i > vec.focusDepth) {
				var display = vec['display' + (i + 1)];
				var oldSizes = display[display.length - 1];
				var newLen = ((vec.focusRelax >> (5 * (i - 1))) & 31) + 1;
				var newSizes = new Array(newLen);
				this$1.arraycopy(oldSizes, 0, newSizes, 0, newLen - 1);
				newSizes[newLen - 1] = n - offset;
				if (newLen > 1)
					{ offset += newSizes[newLen - 2]; }
				var newDisplay = new Array(newLen + 1);
				this$1.arraycopy(display, 0, newDisplay, 0, newLen);
				newDisplay[newLen - 1] = null;
				newDisplay[newLen] = newSizes;
				switch (i) {
					case 2 :
						vec.display1 = newDisplay;
					case 3 :
						vec.display2 = newDisplay;
					case 4 :
						vec.display3 = newDisplay;
					case 5 :
						vec.display4 = newDisplay;
					case 6 :
						vec.display5 = newDisplay;
				}
				i -= 1;
			}
			this.stabilizeDisplayPath(vec.depth, cutIndex, vec);
		} else if (/* depth==1 && */ n != 32) {
			vec.display0 = vec.display0.slice(0, n);
			vec.focus = 0;
			vec.focusStart = 0;
			vec.focusDepth = 1;
			vec.focusRelax = 0;
		}
		return vec
	},
	_cleanTopTake: function _cleanTopTake(cutIndex, rrb){
		var newDepth = 0;
		var depth = rrb.depth;
		if (depth == 1)
			{ return; }
		if (depth < 6 || cutIndex < 33554432) {
			rrb.display5 = null;
			if (depth < 5 || cutIndex < 1048576) {
				rrb.display4 = null;
				if (depth < 4 || cutIndex < 32768) {
					rrb.display3 = null;
					if (depth < 3 || cutIndex < 1024) {
						rrb.display2 = null;
						if (cutIndex < 32) {
							rrb.display1 = null;
							newDepth = 1;
						} else
							{ newDepth = 2; }
					} else
						{ newDepth = 3; }
				} else
					{ newDepth = 4; }
			} else
				{ newDepth = 5; }
		} else
			{ newDepth = 6; }
		rrb.depth = newDepth;
	}});

var PrependTrait = Object.assign({}, CtorTrait,
	TreeTrait,
	{prepend: function prepend(value, list, create) {
		if (list.length === 0) {
			var vec = this.empty(create);
			vec.length = 1;
			vec.display0 = [value];
			return vec;
		}
		var vec = this.fromFocusOf(list, create);
		vec.length = list.length;
		vec.transient = list.transient;
		vec.length = list.length + 1;
		this.focusOnFirstBlock(vec);
		if (list.display0.length < 32) {
			this._prependOnCurrentBlock(value, vec);
		} else {
			this._prependFrontNewBlock(value, vec);
		}
		return vec
	},
	_prependOnCurrentBlock: function _prependOnCurrentBlock(value, list) {
		var oldD0 = list.display0;
		var newLen = oldD0.length + 1;
		list.focusEnd = newLen;
		var d0 = new Array(newLen);
		d0[0] = value;
		for (var i = 0, l = oldD0.length; l > i; i++) {
			d0[i + 1] = oldD0[i];
		}
		list.display0 = d0;
		this.makeTransientIfNeeded(list);
	},
	_prependFrontNewBlock: function _prependFrontNewBlock(elem, list) {
		var this$1 = this;
		var currentDepth = list.focusDepth;
		if (currentDepth == 1)
			{ currentDepth += 1; }
		if (currentDepth == 1)
			{ currentDepth = 2; }
		var display = list['display' + (currentDepth - 1)];
		while (display != null && display.length == 33) {
			currentDepth += 1;
			switch (currentDepth) {
				case 2 : display = list.display1; break;
				case 3 : display = list.display2; break;
				case 4 : display = list.display3; break;
				case 5 : display = list.display4; break;
				case 6 : display = list.display5; break;
			}
		}
		var oldDepth = list.depth;
		this.setupNewBlockInInitBranch(currentDepth, list.transient, list);
		if (oldDepth == list.depth) {
			var i = currentDepth;
			if (i < oldDepth) {
				var _focusDepth = list.focusDepth;
				display = list['display' + i];
				do {
					var displayLen = display.length - 1;
					var newSizes = i >= _focusDepth ? this$1.makeTransientSizes(display[displayLen], 1) : null;
					var newDisplay = new Array(display.length);
					arraycopy(display, 1, newDisplay, 1, displayLen - 1);
					if (i >= _focusDepth)
						{ newDisplay[displayLen] = newSizes; }
					switch (i) {
						case 2:
							list.display2 = newDisplay;
							display = list.display3;
							break;
						case 3:
							list.display3 = newDisplay;
							display = list.display4;
							break;
						case 4:
							list.display4 = newDisplay;
							display = list.display5;
							break;
						case 5:
							list.display5 = newDisplay;
							break;
					}
					i += 1;
				} while (i < oldDepth)
			}
		}
		list.focus = 0;
		list.focusStart = 0;
		list.focusEnd = 1;
		list.focusDepth = 1;
		list.focusRelax = 0;
		list.display0[0] = elem;
		list.transient = true;
		return list;
	}});

var UpdateTrait = Object.assign({}, CtorTrait,
	TreeTrait,
	{update: function update(i, value, rrb, notFound) {
		var vec = this.fromFocusOf(rrb);
		vec.transient = rrb.transient;
		vec.length = rrb.length;
		if (i < rrb.focusStart || rrb.focusEnd <= i || ((i - rrb.focusStart) & ~31) != (rrb.focus & ~31)) {
			if (i < 0 || rrb.length <= i)
				{ return notFound; }
			this.normalizeAndFocusOn(i, vec);
		}
		if (vec.depth > 1 && !vec.transient) {
			this.copyDisplaysAndNullFocusedBranch(vec.depth, vec.focus | vec.focusRelax, vec);
			vec.transient = true;
		}
		var d0 = vec.display0.slice(0);
		d0[(i - vec.focusStart) & 31] = value;
		vec.display0 = d0;
		return vec;
	}});

function iterator$1(start, end, rrb) {
	if (typeof start == 'object') {
		rrb = start;
		start = 0;
	}
	var len = rrb.length;
	if (typeof start == 'undefined') { start = 0; }
	if (typeof end == 'undefined') { end = len; }
	if (0 > end) { end += len; }
	if (0 > start) { start += len; }
	if (start > end){
	}
	return new RangedIterator(start, end, rrb);
}
function reverseIterator$1(start, end, rrb) {
	if (typeof start == 'object') {
		rrb = start;
		start = 0;
	}
	var len = rrb.length;
	if (typeof start == 'undefined') { start = 0; }
	if (typeof end == 'undefined') { end = len; }
	if (0 > end) { end += len; }
	if (0 > start) { start += len; }
	if (start > end) {
	}
	return new ReverseRangedIterator(start, end, rrb);
}
function RangedIterator(startIndex, endIndex, rrb) {
	this.NEXT = { value: null, done: false};
	if (rrb.transient) {
		this.normalize(rrb.depth, rrb);
		rrb.transient = false;
	}
	this.copyFocus(rrb, this);
	if (startIndex < endIndex) {
		this._hasNext = true;
		this.focusOn(startIndex, this);
		this.blockIndex = this.focusStart + (this.focus & -32);
		this.lo = this.focus & 31;
		if (startIndex < this.focusEnd) {
			this.focusEnd = endIndex;
		}
		this.endLo = Math.min(this.focusEnd - this.blockIndex, 32);
	} else {
		this.blockIndex = 0;
		this.lo = 0;
		this.endLo = 1;
		this.display0 = [];
	}
}
Object.assign(RangedIterator.prototype, TreeTrait);
RangedIterator.prototype.next = function next() {
	var next = this.NEXT;
	next.value = this.display0[this.lo];
	this.lo++;
	if (this.lo == this.endLo)
		{ this.goToNextBlock(); }
	if (!this._hasNext)
		{ next.done = true; }
	return next;
};
RangedIterator.prototype.reduce = function(fn, acc) {
	var this$1 = this;
	var blockIndex = this.blockIndex;
	var lo = this.lo;
	var endLo = this.endLo;
	var hasNext = this._hasNext;
	while (hasNext) {
		acc = fn(acc, this$1.display0[lo++]);
		if (lo == endLo) {
			var oldBlockIndex = blockIndex;
			var newBlockIndex = oldBlockIndex + endLo;
			blockIndex = newBlockIndex;
			lo = 0;
			var _focusEnd = this$1.focusEnd;
			if (newBlockIndex < _focusEnd) {
				var _focusStart = this$1.focusStart;
				var newBlockIndexInFocus = newBlockIndex - _focusStart;
				this$1.gotoNextBlockStart(newBlockIndexInFocus, newBlockIndexInFocus ^ (oldBlockIndex - _focusStart), this$1);
				endLo = Math.min(_focusEnd - newBlockIndex, 32);
			} else {
				var _length = this$1.length;
				if (newBlockIndex < _length) {
					this$1.focusOn(newBlockIndex, this$1);
					if (_length < this$1.focusEnd)
						{ this$1.focusEnd = _length; }
					endLo = Math.min(this$1.focusEnd - newBlockIndex, 32);
				} else {
					lo = 0;
					blockIndex = _length;
					endLo = 1;
					hasNext = false;
				}
			}
		}
	}
	return acc;
};
RangedIterator.prototype.find = function find(predicate) {
	var this$1 = this;
	var blockIndex = this.blockIndex;
	var lo = this.lo;
	var endLo = this.endLo;
	var hasNext = this._hasNext;
	var index = 0;
	while (hasNext) {
		if (predicate(this$1.display0[lo++])) {
			return {
				index: index,
				value: this$1.display0[lo - 1]
			}
		}
		index++;
		if (lo == endLo) {
			var oldBlockIndex = blockIndex;
			var newBlockIndex = oldBlockIndex + endLo;
			blockIndex = newBlockIndex;
			lo = 0;
			var _focusEnd = this$1.focusEnd;
			if (newBlockIndex < _focusEnd) {
				var _focusStart = this$1.focusStart;
				var newBlockIndexInFocus = newBlockIndex - _focusStart;
				this$1.gotoNextBlockStart(newBlockIndexInFocus, newBlockIndexInFocus ^ (oldBlockIndex - _focusStart), this$1);
				endLo = Math.min(_focusEnd - newBlockIndex, 32);
			} else {
				var _length = this$1.length;
				if (newBlockIndex < _length) {
					this$1.focusOn(newBlockIndex, this$1);
					if (_length < this$1.focusEnd)
						{ this$1.focusEnd = _length; }
					endLo = Math.min(this$1.focusEnd - newBlockIndex, 32);
				} else {
					lo = 0;
					blockIndex = _length;
					endLo = 1;
					hasNext = false;
				}
			}
		}
	}
	return {
		index: -1,
		value: undefined
	}
};
RangedIterator.prototype.goToNextBlock = function nextBlock() {
	var oldBlockIndex = this.blockIndex;
	var newBlockIndex = oldBlockIndex + this.endLo;
	this.blockIndex = newBlockIndex;
	this.lo = 0;
	var _focusEnd = this.focusEnd;
	if (newBlockIndex < _focusEnd) {
		var _focusStart = this.focusStart;
		var newBlockIndexInFocus = newBlockIndex - _focusStart;
		this.gotoNextBlockStart(newBlockIndexInFocus, newBlockIndexInFocus ^ (oldBlockIndex - _focusStart), this);
		this.endLo = Math.min(_focusEnd - newBlockIndex, 32);
	} else {
		var _length = this.length;
		if (newBlockIndex < _length) {
			this.focusOn(newBlockIndex, this);
			if (_length < this.focusEnd)
				{ this.focusEnd = _length; }
			this.endLo = Math.min(this.focusEnd - newBlockIndex, 32);
		} else {
			this.lo = 0;
			this.blockIndex = _length;
			this.endLo = 1;
			this._hasNext = false;
		}
	}
};
RangedIterator.prototype.gotoNextBlockStart = function gotoNextBlockStart(index, xor, rrb) {
	if (xor < 1024) {
		rrb.display0 = rrb.display1[(index >> 5) & 31];
	} else if (xor < 32768) {
		var d1 = rrb.display2[(index >> 10) & 31];
		rrb.display1 = d1;
		rrb.display0 = d1[0];
	} else if (xor < 1048576) {
		var d2 = rrb.display3[(index >> 15) & 31];
		var d1 = d2[0];
		rrb.display0 = d1[0];
		rrb.display1 = d1;
		rrb.display2 = d2;
	} else if (xor < 33554432) {
		var d3 = rrb.display4[(index >> 20) & 31];
		var d2 = d3[0];
		var d1 = d2[0];
		rrb.display0 = d1[0];
		rrb.display1 = d1;
		rrb.display2 = d2;
		rrb.display3 = d3;
	} else if (xor < 1073741824) {
		var d4 = rrb.display5[(index >> 25) & 31];
		var d3 = d4[0];
		var d2 = d3[0];
		var d1 = d2[0];
		rrb.display0 = d1[0];
		rrb.display1 = d1;
		rrb.display2 = d2;
		rrb.display3 = d3;
		rrb.display4 = d4;
	}
};
RangedIterator.prototype.copyFocus = copyFocus;
function copyFocus(src, dest) {
	dest.focus = src.focus;
	dest.focusStart = src.focusStart;
	dest.focusEnd = src.focusEnd;
	dest.focusDepth = src.focusDepth;
	dest.focusRelax = src.focusRelax;
	dest.display0 = src.display0;
	dest.display1 = src.display1;
	dest.display2 = src.display2;
	dest.display3 = src.display3;
	dest.display4 = src.display4;
	dest.display5 = src.display5;
	dest.depth = src.depth;
	dest.length = src.length;
	dest.transient = src.transient;
}
function ReverseRangedIterator(startIndex, endIndex, rrb) {
	this.startIndex = startIndex;
	this.NEXT = { value: null, done: false};
	this._hasNext = startIndex < endIndex;
	if (rrb.transient) {
		this.normalize(rrb.depth, rrb);
		rrb.transient = false;
	}
	this.copyFocus(rrb, this);
	if (this._hasNext) {
		var idx = endIndex - 1;
		this.focusOn(idx, this);
		this.lastIndexOfBlock = idx;
		this.lo = (idx - this.focusStart) & 31;
		this.endLo = Math.max(startIndex - this.focusStart - this.lastIndexOfBlock, 0);
	} else {
		this.lastIndexOfBlock = 0;
		this.lo = 0;
		this.endLo = 0;
		this.display0 = [];
	}
}
Object.assign(ReverseRangedIterator.prototype, TreeTrait);
ReverseRangedIterator.prototype.copyFocus = copyFocus;
ReverseRangedIterator.prototype.next = function() {
	var next = this.NEXT;
	next.value = this.display0[this.lo];
	if (!this._hasNext)
		{ next.done = true; }
	this.lo--;
	if (this.lo < this.endLo)
		{ this.gotoPrevBlock(); }
	return next;
};
ReverseRangedIterator.prototype.reduce = function(fn, seed) {
	var this$1 = this;
	var startIndex = this.startIndex;
	var lastIndexOfBlock = this.lastIndexOfBlock;
	var lo = this.lo;
	var endLo = this.endLo;
	var hasNext = this._hasNext;
	while(hasNext) {
		seed = fn(seed, this$1.display0[lo]);
		lo--;
		if (lo < endLo) {
			var newBlockIndex = lastIndexOfBlock - 32;
			if (this$1.focusStart <= newBlockIndex) {
				var _focusStart = this$1.focusStart;
				var newBlockIndexInFocus = newBlockIndex - _focusStart;
				this$1.gotoPrevBlockStart(newBlockIndexInFocus, newBlockIndexInFocus ^ (lastIndexOfBlock - _focusStart), this$1);
				lastIndexOfBlock = newBlockIndex;
				lo = 31;
				endLo = Math.max(startIndex - this$1.focusStart - this$1.focus, 0);
			} else if (startIndex < this$1.focusStart) {
				lastIndexOfBlock = this$1.focusStart - 1;
				this$1.focusOn(lastIndexOfBlock, this$1);
				lo = (lastIndexOfBlock - this$1.focusStart) & 31;
				endLo = Math.max(startIndex - this$1.focusStart - lastIndexOfBlock, 0);
			} else {
				hasNext = false;
			}
		}
	}
	return seed;
};
ReverseRangedIterator.prototype.find = function(predicate) {
	var this$1 = this;
	var startIndex = this.startIndex;
	var lastIndexOfBlock = this.lastIndexOfBlock;
	var lo = this.lo;
	var endLo = this.endLo;
	var hasNext = this._hasNext;
	while(hasNext) {
		if (predicate(this$1.display0[lo])) {
			return {
				index: index,
				value: this$1.display0[lo]
			}
		}
		lo--;
		if (lo < endLo) {
			var newBlockIndex = lastIndexOfBlock - 32;
			if (this$1.focusStart <= newBlockIndex) {
				var _focusStart = this$1.focusStart;
				var newBlockIndexInFocus = newBlockIndex - _focusStart;
				this$1.gotoPrevBlockStart(newBlockIndexInFocus, newBlockIndexInFocus ^ (lastIndexOfBlock - _focusStart), this$1);
				lastIndexOfBlock = newBlockIndex;
				lo = 31;
				endLo = Math.max(startIndex - this$1.focusStart - this$1.focus, 0);
			} else if (startIndex < this$1.focusStart) {
				lastIndexOfBlock = this$1.focusStart - 1;
				this$1.focusOn(lastIndexOfBlock, this$1);
				lo = (lastIndexOfBlock - this$1.focusStart) & 31;
				endLo = Math.max(startIndex - this$1.focusStart - lastIndexOfBlock, 0);
			} else {
				hasNext = false;
			}
		}
	}
	return {
		value: undefined,
		index: -1
	};
};
ReverseRangedIterator.prototype.gotoPrevBlock = function() {
	var newBlockIndex = this.lastIndexOfBlock - 32;
	if (this.focusStart <= newBlockIndex) {
		var _focusStart = this.focusStart;
		var newBlockIndexInFocus = newBlockIndex - _focusStart;
		this.gotoPrevBlockStart(newBlockIndexInFocus, newBlockIndexInFocus ^ (this.lastIndexOfBlock - _focusStart), this);
		this.lastIndexOfBlock = newBlockIndex;
		this.lo = 31;
		this.endLo = Math.max(this.startIndex - this.focusStart - this.focus, 0);
	} else if (this.startIndex < this.focusStart) {
		var newIndex = focusStart - 1;
		this.focusOn(newIndex, this);
		this.lastIndexOfBlock = newIndex;
		this.lo = (newIndex - this.focusStart) & 31;
		this.endLo = Math.max(this.startIndex - this.focusStart - this.lastIndexOfBlock, 0);
	} else {
		this._hasNext = false;
	}
};
ReverseRangedIterator.prototype.gotoPrevBlockStart = function(index, xor, rrb) {
	if (xor < 1024) {
		rrb.display0 = rrb.display1[(index >> 5) & 31];
	} else if (xor < 32768) {
		var d1 = rrb.display2[(index >> 10) & 31];
		rrb.display1 = d1;
		rrb.display0 = d1[31];
	} else if (xor < 1048576) {
		var d2 = rrb.display3[(index >> 15) & 31];
		rrb.display2 = d2;
		var d1 = d2[31];
		rrb.display1 = d1;
		rrb.display0 = d1[31];
	} else if (xor < 33554432) {
		var d3 = rrb.display4[(index >> 20) & 31];
		rrb.display3 = d3;
		var d2 = d3[31];
		rrb.display2 = d2;
		var d1 = d2[31];
		rrb.display1 = d1;
		rrb.display0 = d1[31];
	} else if (xor < 1073741824) {
		var d4 = rrb.display5[(index >> 25) & 31];
		rrb.display4 = d4;
		var d3 = d4[31];
		rrb.display3 = d3;
		var d2 = d3[31];
		rrb.display2 = d2;
		var d1 = d2[31];
		rrb.display1 = d1;
		rrb.display0 = d1[31];
	}
};

function setup(factory) {
	var lib = Object.assign({}, {iterator: iterator$1,
		reverseIterator: reverseIterator$1},
		DropTrait,
		TakeTrait,
		NthTrait,
		UpdateTrait,
		PrependTrait,
		AppendTrait,
		AppendAllTrait,
		{factory: factory});
	var VectorApi = [
		'nth',
		'drop',
		'take',
		'update',
		'prepend',
		'append',
		'appendǃ',
		'appendAll',
		'empty',
		'iterator',
		'reverseIterator'
	].reduce(function (api, name) {
		api[name] = lib[name].bind(lib);
		return api;
	}, {});
	return VectorApi;
}

function List(len) {
	this.length = len || 0;
}
var factory = function (len) { return new List(len); };
function isList(thing) {
	return thing instanceof List;
}
function Builder() {
	if (!(this instanceof Builder))
		{ return new Builder(); }
	this.sequences = null;
	this.pipe = null;
	this.pre = null;
	this.accumulator = null;
}
function isBuilder(maybe) {
	return maybe instanceof Builder
}
var rrbit = setup(factory);

function SinglyLinkedList(data, len, next) {
	this.data = data;
	this.next = next;
	this.length = len;
}
function of(value, list) {
    if (list) { return list.add(value); }
	return new SinglyLinkedList(value, 1, null)
}

function isLinkedList(list) {
	return list instanceof SinglyLinkedList;
}
var proto$2 = SinglyLinkedList.prototype;
proto$2.add = function(value) {
	return new new SinglyLinkedList(value, this.length, this)
};
proto$2.nth = function(i, notFound) {
	var list = this;
	if (0 > i)
		{ i = i + list.length; }
	if (i > list.length)
		{ return notFound; }
	while (list) {
		if ((list.length -1) == i)
			{ return list.data; }
		list = list.next;
	}
	return notFound;
};
proto$2.take = function take(n) {
	var list = this;
	n = list.length - n;
	while(list && list.length != n) {
		list = list.next;
	}
	return list
};
proto$2.drop = function drop(n) {
	var list = this;
	if (n >= list.length) { return; }
	var newLen = list.length - n;
	var temp = new Array(newLen);
	while(newLen) {
		temp[--i] = list.data;
		list = list.next;
	}
	return this.fromArray(temp)
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
	return maybe && typeof maybe[Symbol.iterator] == 'function'
}
function last$1(fn) {
	if (typeof fn == 'function')
		{ return new Last(fn); }
	return fn;
}
var Last = function Last(fn) {
	this.stepFn = fn;
};
Last.prototype.init = function init () {};
Last.prototype.step = function step (result, input) {
	return this.stepFn(result, input)
};
Last.prototype.result = function result (result$1) {
	return result$1
};
function Reduced(value) {
	this.value = value;
	this.isReduced = true;
}
function isReduced(x) {
	return x instanceof Reduced
}
function toReduced(x) {
	return isReduced(x) ? x : new Reduced(x);
}
function toValue(x) {
	return isReduced(x) ? x.value : x
}
function compose(a,b,c,d,e,f,g,h,i,j) {
	switch(arguments.length) {
		case 2: return function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
			return a(b.apply(void 0, args));
	};
		case 3: return function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
			return a(b(c.apply(void 0, args)));
	};
		case 4: return function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
			return a(b(c(d.apply(void 0, args))));
	};
		case 5: return function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
			return a(b(c(d(e.apply(void 0, args)))));
	};
		case 6: return function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
			return a(b(c(d(e(f.apply(void 0, args))))));
	};
		case 7: return function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
			return a(b(c(d(e(f(g.apply(void 0, args)))))));
	};
		case 8: return function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
			return a(b(c(d(e(f(g(h.apply(void 0, args))))))));
	};
		case 9: return function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
			return a(b(c(d(e(f(g(h(i.apply(void 0, args)))))))));
	};
		case 10:return function () {
			var args = [], len = arguments.length;
			while ( len-- ) args[ len ] = arguments[ len ];
			return a(b(c(d(e(f(g(h(i(j.apply(void 0, args))))))))));
	};
	}
	var args = Array.prototype.slice.call(arguments).reverse();
	return args.reduce(function (f, func) { return function (value) { return f(fn(value)); }; }, args.shift())
}
var ITransformer = function ITransformer () {};
ITransformer.prototype.init = function init () {
	return this.xf.init()
};
ITransformer.prototype.step = function step (result, value) {
	return value;
};
ITransformer.prototype.result = function result (result$1) {
	return this.xf.result(result$1)
};
var PassThru = (function (ITransformer) {
	function PassThru(xf) {
		ITransformer.call(this);
		this.xf = xf;
	}
	if ( ITransformer ) PassThru.__proto__ = ITransformer;
	PassThru.prototype = Object.create( ITransformer && ITransformer.prototype );
	PassThru.prototype.constructor = PassThru;
	PassThru.prototype.step = function step (result, value) {
		return this.xf.step(result)
	};
	return PassThru;
}(ITransformer));
var passThru = function () { return function (next) { return new PassThru(next); }; };
var Mapper = (function (ITransformer) {
	function Mapper(fn, xf) {
		ITransformer.call(this);
		this.fn = fn;
		this.xf = xf;
	}
	if ( ITransformer ) Mapper.__proto__ = ITransformer;
	Mapper.prototype = Object.create( ITransformer && ITransformer.prototype );
	Mapper.prototype.constructor = Mapper;
	Mapper.create = function create (fn) {
		return function (next) { return new Mapper(fn, next); }
	};
	Mapper.prototype.step = function step (result, value) {
		return this.xf.step(result, this.fn(value))
	};
	return Mapper;
}(ITransformer));
var map = Mapper.create;
var Filter = (function (ITransformer) {
	function Filter(predicate, xf) {
		ITransformer.call(this);
		this.predicate = predicate;
		this.xf = xf;
	}
	if ( ITransformer ) Filter.__proto__ = ITransformer;
	Filter.prototype = Object.create( ITransformer && ITransformer.prototype );
	Filter.prototype.constructor = Filter;
	Filter.create = function create (predicate) {
		return function (next) { return new Filter(predicate, next); }
	};
	Filter.prototype.step = function step (result, value) {
		return this.predicate(value) ? this.xf.step(result, value) : result
	};
	return Filter;
}(ITransformer));
var filter = Filter.create;
var Scan = (function (ITransformer) {
	function Scan(fn, seed, xf) {
		ITransformer.call(this);
		this.fn = fn;
		this.seed = seed;
		this.xf = xf;
	}
	if ( ITransformer ) Scan.__proto__ = ITransformer;
	Scan.prototype = Object.create( ITransformer && ITransformer.prototype );
	Scan.prototype.constructor = Scan;
	Scan.create = function create (fn, seed) {
		return function (next) { return new Scan(fn, seed, next); }
	};
	Scan.prototype.step = function step (result, value) {
		this.seed = this.fn(this.seed, value);
		return this.xf.step(result, this.seed)
	};
	return Scan;
}(ITransformer));
var scan = Scan.create;
var Take = (function (ITransformer) {
	function Take(fn, xf) {
		ITransformer.call(this);
		this.fn = fn;
		this.xf = xf;
	}
	if ( ITransformer ) Take.__proto__ = ITransformer;
	Take.prototype = Object.create( ITransformer && ITransformer.prototype );
	Take.prototype.constructor = Take;
	Take.create = function create (n) {
		return function (next) { return new Take(n, next); }
	};
	Take.prototype.step = function step (result, value) {
		return this.n-- > 0 ? this.xf.step(result, value) : toReduced(result)
	};
	return Take;
}(ITransformer));
var take$1 = Take.create;
var TakeWhile = (function (ITransformer) {
	function TakeWhile(predicate, xf) {
		ITransformer.call(this);
		this.fn = predicate;
		this.xf = xf;
	}
	if ( ITransformer ) TakeWhile.__proto__ = ITransformer;
	TakeWhile.prototype = Object.create( ITransformer && ITransformer.prototype );
	TakeWhile.prototype.constructor = TakeWhile;
	TakeWhile.create = function create (predicate) {
		return function (next) { return new TakeWhile(predicate, next); }
	};
	TakeWhile.prototype.step = function step (result, value) {
		return this.fn(value) ? this.xf.step(result, value) : toReduced(result)
	};
	return TakeWhile;
}(ITransformer));
var takeWhile = TakeWhile.create;
var Drop = (function (ITransformer) {
	function Drop(n, xf) {
		ITransformer.call(this);
		this.n = n;
		this.xf = xf;
	}
	if ( ITransformer ) Drop.__proto__ = ITransformer;
	Drop.prototype = Object.create( ITransformer && ITransformer.prototype );
	Drop.prototype.constructor = Drop;
	Drop.create = function create (n) {
		return function (next) { return new Drop(n, next); }
	};
	Drop.prototype.step = function step (result, value) {
		return this.n-- > 0 ? result : this.xf.step(result, value);
	};
	return Drop;
}(ITransformer));
var drop$1 = Drop.create;
var DropWhile = (function (ITransformer) {
	function DropWhile(predicate, xf) {
		ITransformer.call(this);
		this.fn = predicate;
		this.xf = xf;
		this.isDropping = true;
	}
	if ( ITransformer ) DropWhile.__proto__ = ITransformer;
	DropWhile.prototype = Object.create( ITransformer && ITransformer.prototype );
	DropWhile.prototype.constructor = DropWhile;
	DropWhile.create = function create (predicate) {
		return function (next) { return new DropWhile(predicate, next); }
	};
	DropWhile.prototype.step = function step (result, value) {
		if (this.isDropping) {
			if (this.fn(value))
				{ return result; }
			this.isDropping = false;
		}
		return this.xf.step(result, value);
	};
	return DropWhile;
}(ITransformer));
var dropWhile = DropWhile.create;
var Intersperse = (function (ITransformer) {
	function Intersperse(separator, xf) {
		ITransformer.call(this);
		this.sep = separator;
		this.first = true;
		this.xf = xf;
	}
	if ( ITransformer ) Intersperse.__proto__ = ITransformer;
	Intersperse.prototype = Object.create( ITransformer && ITransformer.prototype );
	Intersperse.prototype.constructor = Intersperse;
	Intersperse.create = function create (separator) {
		return function (next) { return new Intersperse(separator, next); }
	};
	Intersperse.prototype.step = function step (result, value) {
		if (this.first) {
			this.first = false;
			return this.xf.step(result, value)
		}
		var next = this.xf.step(result, this.sep);
		return isReduced(next) ? next : this.xf.step(next, value)
	};
	return Intersperse;
}(ITransformer));
var intersperse = Intersperse.create;
var Unique = (function (ITransformer) {
	function Unique(fn, xf){
		ITransformer.call(this);
		this.seen = [];
		this.fn = fn || (function (x) { return x; });
		this.xf = xf;
	}
	if ( ITransformer ) Unique.__proto__ = ITransformer;
	Unique.prototype = Object.create( ITransformer && ITransformer.prototype );
	Unique.prototype.constructor = Unique;
	Unique.create = function create (fn) {
		return function (next) { return new Unique(fn, next); }
	};
	Unique.prototype.step = function step (result, input){
		var computed = this.fn(input);
		if (this.seen.includes(computed)){
			this.seen.push(computed);
			return this.xf.step(result, input);
		}
		return result;
	};
	return Unique;
}(ITransformer));
var unique = Unique.create;
function transduce(collection, xf, iterator, seed) {
	if (!xf)
		{ xf = passThru(); }
	xf = xf(last$1(iterator));
	var result = Sequence.of(collection)
						.reduce(xf.step.bind(xf), seed === undefined ? xf.init() : seed);
	return toValue(xf.result(toValue(result)));
}
var Sequence = function Sequence(list) {
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
	} else if (typeof list == 'object') {
		this.type = "Unknown";
	} else {
		this.type = "Unknown";
	}
	this.list = list;
};
Sequence.of = function of$$1 (list) {
	return Sequence.isSequence(list) ? list : new Sequence(list)
};
Sequence.from = function from () {
		var collections = [], len = arguments.length;
		while ( len-- ) collections[ len ] = arguments[ len ];
	return ReSequence.of(collections)
};
Sequence.isCollection = function isCollection (maybe) {
	return maybe && (
		isList(maybe) ||
		Array.isArray(maybe) ||
		isIterable(maybe) ||
		isLinkedList(maybe) ||
		isSequence(maybe))
};
Sequence.isSequence = function isSequence (maybe) {
	return maybe instanceof Sequence
};
Sequence.prototype.reduce = function reduce (fn, seed) {
	return this['reduce' + this.type](fn, seed, this.list);
};
Sequence.prototype.reduceArray = function reduceArray (fn, seed, array) {
	for (var i = 0, len = array.length; len > i; i++) {
		seed = fn(seed, array[i]);
		if (isReduced(seed))
			{ return seed; }
	}
	return seed
};
Sequence.prototype.reduceVector = function reduceVector (fn, seed, vector) {
	vector.iterator().find(function (value) { return isReduced((seed = fn(seed, value))); });
	return seed
};
Sequence.prototype.reduceBuilder = function reduceBuilder (fn, seed, builder) {
	return seed
};
Sequence.prototype.reduceLinkedList = function reduceLinkedList (fn, seed, list) {
	while (list) {
		seed = fn(seed, list.data);
		if (isReduced(seed))
			{ return seed; }
		list = list.next;
	}
	return seed;
};
Sequence.prototype.reduceIterable = function reduceIterable (fn, seed, iterable) {
	var it = iterable[Symbol.iterator]();
	var x = it.next();
	while (!(x = it.next()).done) {
		seed = fn(seed, x.value);
		if (isReduced(seed))
			{ return seed; }
	}
	return seed;
};
Sequence.prototype.reduceSequence = function reduceSequence (fn, seed, seq) {
	return seq.reduce(fn, seed)
};
Sequence.prototype.reduceUnknown = function reduceUnknown () {
	throw new TypeError("unknown collection type, cannot reduce");
};
var ReSequence = function ReSequence() {
	var collections = [], len = arguments.length;
	while ( len-- ) collections[ len ] = arguments[ len ];
	this.type = 'ReSequence';
	this.sequences = collections.map(function (collection) { return Sequence.of(collection); });
};
ReSequence.of = function of$$1 (collections) {
	return new ReSequence(collections || [])
};
ReSequence.isReSequence = function isReSequence (maybe) {
	return maybe instanceof ReSequence
};
ReSequence.prototype.add = function add (collection) {
	this.sequences.push(Sequence.of(collection));
};
ReSequence.prototype.pre = function pre (collection) {
	this.sequences.unshift(Sequence.of(collection));
};
ReSequence.prototype.reduce = function reduce (fn, seed) {
	var seqs = this.sequences;
	for (var i = 0, len = seqs.length; len > i; i++) {
		seed = seqs[i].reduce(fn, seed);
		if (isReduced(seed))
			{ return seed }
	}
	return seed
};

var this$1 = undefined;
var proto$1 = Builder.prototype;
Builder.isBuilder = isBuilder;
proto$1.append = function (singleValue) {
	rrbit.appendǃ((this.accumulator || (this.accumulator = rrbit.empty())), singleValue);
	return this;
};
proto$1.appendAll = function(collection) {
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
proto$1.prepend = function(item) {
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
	this.pipe = addToPipe(map(fn), this.pipe);
	return this;
};
proto$1.scan = function(fn, seed) {
	this.pipe = addToPipe(scan(fn, seed), this.pipe);
	return this;
};
proto$1.reduce = function(fn, seed) {
	return this.into(fn, seed);
};
proto$1.unique = function(fn) {
	this.pipe = addToPipe(unique(fn), this.pipe);
	return this;
};
proto$1.intersperse = function(separator) {
	this.pipe = addToPipe(intersperse(separator), this.pipe);
	return this;
};
proto$1.into = function(reducer, seed) {
	if (this.pre) {
		this.sequences.pre(this.pre);
		this.pre = null;
	}
	return transduce(this.sequences, this.pipe, reducer, seed)
};
proto$1.toList = function() {
    var intoVector = function (list, item) { return rrbit.appendǃ(item, list); };
	return this.into(intoVector, rrbit.empty())
};
proto$1.toArray = function() {
	var intoArray = function (list, item) { return list.push(item); };
	return this.into(intoArray, [])
};
proto$1.join = function (separator) {
    if (separator) {
        this$1.intersperse(separator);
    }
	return this$1.into(function (prev, next) { return prev + next; }, "")
};
proto$1.any = function(predicate) {
	this.into(function (prev, next) { return prev || predicate(next); }, false);
};
proto$1.all = function(predicate) {
	this.into(function (prev, next) { return prev && predicate(next); }, true);
};

var nth = rrbit.nth;
var drop = rrbit.drop;
var take = rrbit.take;
var update = rrbit.update;
var append = rrbit.append;
var appendǃ = rrbit.appendǃ;
var empty = rrbit.empty;
var iterator = rrbit.iterator;
var reverseIterator = rrbit.reverseIterator;
List.empty = empty;
List.isList = List.prototype.isList = isList;
function _of() {
    var values = [], len = arguments.length;
    while ( len-- ) values[ len ] = arguments[ len ];
    return values.length == 1 ? append(values[0], empty()) : _from(values);
}
List.of = List.prototype.of = _of;
List.Builder = List.prototype.Builder = Builder;
function _from(collection) {
    if (isList(collection))
        { return collection; }
    if (Array.isArray(collection)) {
        return _fromArray(collection);
    }
    if (typeof collection.reduce == 'function') {
		return collection.reduce(function (list, value) { return appendǃ(value, list); }, empty())
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
    return (this.reduce(function (acc, value) { return appendǃ(fn(value), acc); }, empty()));
};
proto.append = proto.push = function(value) {
    return append(value, this);
};
proto.prepend = proto.unshift = function(value) {
	return this.of(value).appendAll(this);
};
proto.filter = function(fn) {
    return this.reduce(function (list, value) { return fn(value) ? append(value, list) : list; }, empty());
};
proto.drop = function(n) {
    return drop(n, this);
};
proto.take = function(n) {
    return take(n, this);
};
proto.nth = proto.get = function(i, notFound) {
  return nth(i, this, notFound);
};
proto.update = function(i, value) {
    return update(i, value, this);
};
proto.slice = function(from, to) {
    if (typeof from == 'undefined') { from = 0; }
	if (typeof to == 'undefined') { to = this.length; }
    if (0 > to) { to += this.length; }
    if (0 > from) { from += this.length; }
    if (from > to) { return empty(); }
    return this.take(to).drop(from);
};
proto.indexOf = function(value) {
    return this.find(function (_value) { return _value === value; }).index
};
proto.includes = function(value) {
   return this.indexOf(value) !== -1
};
proto.find = function(predicate) {
    return this.iterator().find(predicate);
};
proto.reduce = function(fn, seed) {
    return iterator(0, this.length, this).reduce(fn, seed);
};
proto.foldl = function(fn, seed) {
    return (iterator(0, this.length, this)
            .reduce(function (acc, value) { return fn(value, acc); }, seed));
};
proto.foldr = function(fn, seed ){
    return (reverseIterator(0, this.length, this)
            .reduce(function (acc, value) { return fn(value, acc); }, seed));
};
proto.appendAll = proto.concat = function(iterable) {
	var addIn = function (list, value) { return appendǃ(value, list); };
	var vec = this.reduce(addIn, empty());
	return Sequence.of(iterable).reduce(addIn, vec)
};
proto.reverseIterator = function(from, to) {
	return reverseIterator(from || 0, to || this.length, this);
};
proto[Symbol.iterator] = proto.iterator = function(from, to) {
	return iterator(from || 0, to || this.length, this)
};
proto.every = function(predicate) {
    return this.find(function (value) { return !predicate(value); }).index == -1;
};
proto.some = function(predicate) {
    return this.find(predicate).index !== -1;
};
proto.removeAt = function(i) {
	return this.take(i).appendAll(this.drop(i + 1));
};
proto.remove = function(value) {
    var i = this.find(function (val) { return val === value; }).index;
	return i === -1 ? this : this.removeAt(i, value);
};
proto.insertAt = function(i, value) {
    return (this.take(i)
                .append(value)
                .appendAll(this.drop(i)));
};
function times(n, fn) {
	var vec = empty();
	for (var i = 0; n > i; i++) {
		vec = appendǃ(fn(i), vec);
	}
	return vec;
}
List.times = proto.times = times;
function range(start, end) {
	return times(end - start, function (i) { return i + start; })
}
List.range = proto.range = range;
proto.intersperse = function(separator) {
	return (this.length < 2) ?
		this :
		this.iterator(1, this.length)
			.reduce(function (acc, value) { return appendǃ(separator, append(value, acc)); }, appendǃ(this.nth(0), empty()));
};
proto.join = function(separator) {
	if (this.length == 0) { return ""; }
	if (this.length == 1) { return "" + this.nth(0); }
	return (this.iterator(1, this.length)
				.reduce(function (acc, value) { return acc + separator + value; }, this.nth(0) + ""))
};
proto.ap = function ap(values) {
	return this.map(function (fn) { return values.map(fn); });
};
proto.chain = proto.flatMap = function(fn) {
	function _addIn(list, value) {
		return Sequence.isSeqable(value) ? Sequence.of(value).reduce(_addIn, list) : appendǃ(fn(v), list)
	}
	return this.reduce(_addIn, empty())
};
proto.traverse = function(fn, of) {
    return this.map(fn).sequence(of);
};
proto.sequence = function(of) {
};

exports.List = List;
exports['default'] = List;
