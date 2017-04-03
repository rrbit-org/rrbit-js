
## TOC

### List
1. Creating Lists
    * [empty](#List.empty)
    * [of](#List.of)
    * [from](#List.from)
    * [times](#List.times)
    * [range](#List.range)
    * [Builder](#Builder)
    * [toBuilder](#toBuilder)
1. Reading Lists
    * [get](#List.get)
    * [nth](#List.nth)
    * [indexOf](#List.indexOf)
    * [includes](#List.includes)
    * [find](#List.find)
    * [iterator](#List.iterator)
    * [reverseIterator](#List.reverseIterator)
    * [[Symbol.iterator]](#List.[Symbol.iterator])
1. Transforming Lists
    * append
    * push
    * appendAll
    * concat
    * prepend
    * unshift
    * drop
    * take
    * update
    * set
    * slice
    * removeAt
    * remove
    * insertAt
    * reduce
    * reduceRight
    * foldl
    * foldr
    * filter
    * map
    * every
    * some
    * intersperse
    * join
    * flatten
    * flatMap
    * chain
    * ap
    * traverse
    * sequence
    
### Builder
1. sources
    * append
    * push
    * appendAll
    * concat
    * prepend
    * unshift
1. transforms
    * map
    * filter
    * drop
    * dropWhile
    * take
    * takeWhile
    * groupWith
    * flatMap
    * flatten
    * scan
    * intersperse
    * unique
1. terminators
    * reduce [to Any]
    * join [to String]
    * toArray [to native Array]
    * toList [to List]
    * every [to Boolean]
    * some [to Boolean]


# List API


# List.empty
```javascript
List.empty(): List<any>
```
returns a new empty List

fantasy-land compatibility for [Monoid](https://github.com/fantasyland/fantasy-land#monoid)

Example:
```typescript
var none = List.empty();
var nada = none.empty();
```
# List.of
```typescript
List.of<T>(value: T): List<T>
```
creates a list from values provided

example:
```javascript
var one = List.of(1)
```

# List.from
```typescript
List.from(list: Array<T>|List<T>|Iterable<T>): List<T>
```
creates a list from another collection

example:
```javascript
var one = List.of(1)
```

# List.range
```typescript
List.range(start: number, end: number): List<number>
```
example:
```javascript
var nums = List.range(0, 5)
//nums == [0,1,2,3,4]
```

# List.times
```typescript
List.times<T>(n: number, function(i: number): T): List<T>
```
invokes a callback n times and builds into a List

example:
```javascript
var nums = List.range(0, 5)
//nums == [0,1,2,3,4]
```

# List.toBuilder
creates a builder from the current list
see also: [List.Builder](#List.Builder) to create an empty Builder

# List.get
alias for [List.nth]

# List.nth
```typescript
nth<T>(n: number, notFound: any): T|notFound
```
returns the value at the provided index, or notFound if index is out of bounds

example
```javascript
var nums = List.range(0, 5)
var resulta = nums.nth(2);
var resultb = nums.nth(7);
var resultc = nums.nth(7, Maybe.Nothing);
//nums == [0,1,2,3,4]
//resulta = 2
//resultb = undefined
//resultc = Nothing
```

# List.indexOf
```typescript
indexOf<T>(value: T): number
```

# List.includes
```typescript
includes<T>(value: T): boolean
```
# List.find
```typescript
indexOf<T>(function(value: T): boolean): number
```
# List.iterator
```typescript
iterator(start: number, end: number): RangedIterator
```

# List.reverseIterator
```typescript
iterator(start: number, end: number): RangedIterator
```
# List.[Symbol.iterator]
returns a iterator for the current collection

# List.append
```typescript
append<T>(value: T): List<T>
```

# List.push
alias for [List.append](#List.append)

# List.appendAll
```typescript
appendAll<T>(iterable: Iterable<T>): List<T>
```

# List.concat
fantasy-land compatibility for [Semigroup](https://github.com/fantasyland/fantasy-land#semigroup)
alias for [List.appendAll](#List.appendAll)

# List.prepend
```typescript
prepend<T>(value: T): List<T>
```
add an element to the beginning of the list, returning a new list

# List.unshift
alias for [List.prepend](#List.prepend)

# List.drop
```typescript
drop(n: number): List
```
# List.take
```typescript
take(n: number): List
```
# List.update
```typescript
drop(index: number): List
```

# List.set
alias for [List.update](#List.update)

# List.slice
```typescript
slice(from: number, to: number): List
```

# List.removeAt
```typescript
removeAt(index: number): List
```
# List.remove
```typescript
removeAt<T>(value: T): List<T>
```

# List.insertAt
```typescript
removeAt<T>(index: number, value: T): List<T>
```
# List.reduce
```typescript
reduce<T>(callback: function(accumulator: W, next: T): W, seed: W): List<T>
```

# List.reduceRight
```typescript
reduceRight<T>(callback: function(accumulator: W, next: T): W, seed: W): List<T>
```
# List.foldl
```typescript
foldl<T>(callback: function(next: T, accumulator: W): W, seed: W): List<T>
```
# List.foldr
```typescript
foldr<T>(callback: function(next: T, accumulator: W): W, seed: W): List<T>
```
# List.filter
```typescript
filter(callback: function(value: T):Boolean): List<T>
```
# List.map
```typescript
map<T>(callback: function(value: T): W): List<W>
```
# List.every
```typescript
every(callback: function(value: T):Boolean): Boolean
```
# List.some
```typescript
some(callback: function(value: T):Boolean): Boolean
```
# List.intersperse
```typescript
intersperse<T>(separator: T): List<T>
```
# List.join
```typescript
join<T>(separator: string): string
```
# List.flatten
```typescript
flatten(): List
```
# List.flatMap
```typescript
flatMap<T|Array>(callback: function(value: T): W): List<W>
```
# List.chain
fantasy-land compatibility for [Chain](https://github.com/fantasyland/fantasy-land#chain)
alias for [List.flatMap](#List.flatMap)
# List.ap
fantasy-land compatibility for [Applicative](https://github.com/fantasyland/fantasy-land#applicative)
# List.traverse
fantasy-land compatibility for [Traversible](https://github.com/fantasyland/fantasy-land#traversable)
# List.sequence
fantasy-land compatibility for [Traversible](https://github.com/fantasyland/fantasy-land#traversable)

# List.Builder
create a new empty Builder

# Builder
Builders offer faster batched iteration and transformations over multiple collections
(like an iterator of iterators) with a fluent API.



# Builder.appendAll
add a collection to the source list.
Sources are lazily iterated over when builder exectutes a "terminating" statement. 
Any collection type can be used including:
* native Arrays
* Lists
* LinkedLists (an internal type)
* Iterators

Example:
```javascript
var result = List.Builder()
	.appendAll(myArray)
	.appendAll(myList)
	.appendAll(myIterable)
	.toList()
```

# Builder.concat
alias for [appendAll()](#Builder.appendAll)

# Builder.append
add a single item to the sources list.

Example:
```javascript
var result = List.Builder()
	.append(1)
	.append(2)
	.append(3)
	.toList()
// result == [1,2,3]
```

# Builder.push
alias for [append()](#Builder.append)

# Builder.prepend
add a single item to the beginning of sources list.

Example:
```javascript
var result = List.Builder()
	.prepend(3)
	.prepend(2)
	.prepend(1)
	.toList()
// result == [1,2,3]
```

# Builder.unshift
alias for [prepend()](#Builder.prepend)

# Builder.map
calls a provided callback function once for each element in an sources, 
in order, and returns a new replacement element.

Example:
```javascript
const plusOne = (x) => x + 1

var result = List.Builder()
	.appendAll([1,2,3])
	.map(plusOne)
	.toList()
// result == [2,3,4]
```
 
# Builder.filter
calls the provided callcack function once for each element in the sources,
in order, and keeps the element if callback returns true

# Builder.drop
accepts a provided number, removing the first n elements from the sources,
leaving the remaining

# Builder.dropWhile
accepts a provided callback, removing elements until the callback returns true,
leaving the remaining elements untouched

# Builder.take
accepts a provided number, removing the first n elements from the sources,
leaving the remaining

# Builder.takeWhile
accepts a provided callback, keeping elements until the callback returns false,
leaving the remaining elements untouched

# Builder.flatten
merges all elements recursively, if they are an Array, List or Iterable, into a single list

```javascript

var result = List.Builder()
	.appendAll([[1,2,3], [4,5,6], [7,8,9]])
	.flatten()
	.toList()
// result == [1,2,3,4,5,6,7,8,9]
```

# Builder.flatMap
transform each element or sub-element(if iterable), then merges into resulting list

```javascript
const plusOne = (x) => x + 1

var result = List.Builder()
	.appendAll([[1,2,3], [4,5,6], [7,8,9]])
	.flatMap(plusOne)
	.toList()
// result == [2,3,4,5,6,7,8,9,10]
```

# Builder.intersperse
Accepts a single argument an inserts it between every element in the array.
Will not insert as first or last item

```javascript
var result = List.Builder()
	.appendAll([1,2,3])
	.intersperse("-")
	.toList()
// result == [1, "-", 2, "-", 3]
```

# Builder.unique
ensures all elements only occur once in the result
```javascript
var result = List.Builder()
	.appendAll([1,2,3,1,2,3,3,3])
	.unique()
	.toList()
// result == [1, 2, 3]
```

# Builder.scan
Accepts an callback function and an optionally seed value.
incrementally reduces each element in order. 
non-terminal (i.e. does not produce the final builder result)

# Builder.reduce
Accepts a reducer callback and an option seed value.
Terminal. Returns the result of the builder run through the callback.

# Builder.join
Returns the result of the builder as a native Array.
Accepts an optional separator. Terminal.

# Builder.toArray
Returns the result of the builder as an native Array.
Accepts no input arguments. Terminal

# Builder.toList
Returns the result of the builder as an immutable List.
Accepts no input arguments. Terminal

# Builder.every
Accepts a callback function, returning a boolean if all elements pass
Terminal.

# Builder.some
Accepts a callback function, returning a boolean if any elements pass.
Terminal
