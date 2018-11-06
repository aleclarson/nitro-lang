# nitro: balance of simple and practical

### Comments

Inline comments only

```js
// You know what it is.
```

### Variables

Declare your first variable:

```js
a = 1
```

Now, mutate the variable:

```js
a = 2
```

Scopes can only mutate their own variables.

```js
a = 1
do {
  a = 2
  b = 2
  print(a) // 2
}
print(a) // 1
print(b) // void
```

### Holes

```js
// Sparse list
list = [1, _, 3]
list[1] // => void

// Shorthand void return
noop = () => _
noop() // => void

// Ignored params
cb = (_, _, c) => c
```

### Objects

```js
foo = (a: 1, b: 2)
empty = ()

bar = (foo)
assert(bar.foo == foo)
```

Function calls let you omit parentheses when an object is the only argument.

```js
// 1 argument
print(a: 1, b: 2)

// 2+ arguments
print((a: 1), (b: 2))
```

### Null

The intentional value for "nothing yet something".

```js
a = null
assert(typeof a == 'null')
```

### Strings

```js
// Interned string
foo = 'hi there'

// Interpolated string
bar = "{foo} everyone"
print(bar) // "hi there everyone"

// Multi-line
bar = "
  hello
  world
"
print(bar) // "hello\nworld"

// Concatenated string
foo = 'a' + 'b'
```

### Reactivity

Reactive bindings tie a variable or parameter to another variable.

```js
// Bind `foo` to `bar + 1`
*foo = bar + 1

// Reactive functions can have reactive arguments.
test = *(a, b) { ... }
test(bar)  // BAD
test(*bar) // GOOD
test(*foo)  // GOOD

// Strip reactivity from `foo`
foo = *foo
foo = null

// Strip reactivity from `test`
test = *test
test = null
```

### Catch blocks

Catch blocks can follow any block.

```js
do {
  throw 'any value'
} catch(e) {
  throw e // re-throwing is okay
}

if (foo) {
  throw 'foo == true'
} else {
  throw 'foo == false'
} catch(e) {
  // errors come from `if` or `else` blocks
}
```

### Lists

Lists are immutable, ordered collections.

```js
foo = [1, 2, 3]
assert(foo[0] == 1)

// Re-binding preserves identity
bar = foo
assert(bar == foo)

// Mutating produces a copy
bar[0] = 2
assert(bar ~= foo)
```

And here is multi-line syntax:

```js
list = [
  1,
  2,
  3,
]
```

### Equality

```js
assert(1 == 1) // exact
assert(1 != 1) // not exact
assert(1 ~= 1) // shallow equal
```

### Boolean chaining

```js
a = b and c
```

The `and` operator returns `b` when `b` is falsy, else it returns `c`.

```js
a = b or c
```

The `or` operator returns `b` when `b` is truthy, else if returns `c`.

### Ternary operator

```js
a = b ? c : d
```

When `b` and `c` are strict equal, you can shorten the expression:

```js
a = b ?: d
```

### Enums

```js
enum Foo { A, B, C }

assert(Foo.A == 1)
assert(Foo.B == 2)
assert(Foo.C == 4)

// Function that takes a Foo enum value.
test = (foo: Foo): number {
  foo > .A ? 1 : 0
}
test(Foo.A) // => 0
test(Foo.B) // => 1
test(Foo.C) // => 1

// To avoid importing anything:
test(.Bar)

test(1)
// error: expected enum Foo, got 1
```

### Sets

Sets are lists with built-in deduplication.

```js
foo = Set(1, 2, 3)
assert(foo[0] == 1)

bar = foo
assert(bar == foo)

bar.add(4)
assert(bar != foo)
```

### Maps

```js
map = {
  'a' = 1, // string key
  1 = 2,   // number key
  k = 3,   // any key
}
```

### Destructuring

```js
// Lists / Sets
[a, b, ..rest] = [1, 2, 3, 4]
assert(a == 1)
assert(b == 2)
assert(rest ~= [3, 4])

// Records / Maps
(a, b, ..rest) = (a: 1, b: 2, c: 3)
assert(a == 1)
assert(b == 2)
assert(rest ~= (c: 3))
```

### Symbols

```js
// Create a symbol.
foo = @"a b"

// Symbols have an identity.
assert(foo != @"a b")

// Access a property with a symbol.
obj[foo]
obj[@"a b"] // => never
```

### Imports

```js
// Import parts of a module.
import (a, b, c) from './path/to/module'

// Import all of a module.
import foo from './path/to/module'
```

### Exports

When the `export` keyword is first used with an object literal, that object is used to hold all future exports. All other object literals are merged into it. Pass anything else to override the current exports.

```js
// Export variables and expressions.
export (
  foo: a + 1,
  bar: b,
  c,
  d,
  e,
)

// Export anything other than an object literal to override previous exports.
export 1 + 1
```

## Control Flow

### Functions

```js
// Function that does nothing.
noop = () => void

// One-line function w/ inferred types
foo = (a, b) => (a / 2) * (b / 2)
assert(foo is (a: number, b: number) => number)

// Multi-line function w/ explicit types
bar = (
  a: number,
  b: number,
): number {
  a + b
}
```

As you may have noticed, all functions have implicit return values.
To disable implicit return, use `void` as the function's return type.

```js
bar = (a, b): void {
  a + b
}
bar() // => void
```

#### Optional arguments

```js
foo = (a?, b?: number) => a or b
```

#### Rest arguments

```js
foo = (a, ..b: number[]) => b
```

#### Currying

```js
add = (a: number, b: number) => a + b
addFive = add(5, _)
addFive(1) // => 6

// Holes can go anywhere
addFive = add(_, 5)
```

#### Pipelines

```js
add = (a, b) => a + b
div = (a, b, c) => a / b / c

// Pipe operator + currying
bar = foo | add(5, _) | div(1, _, 3)
```

#### Optional parens

If only passing an inline string/object/fiber literal, you can omit the parentheses of a function call.

```js
fun = (arg) => _

foo = fun 'foo bar'
foo = fun "
  foo
  bar
"

// The object parens act as the function parens.
fun(a: 1, b: 2)

fun ^{
  // In another fiber.
}
```

### Logging

```js
print 'hello world'
```

### Fibers

Fibers enable cooperative threading.

The active fiber is in control of its thread until it yields.

```js
foo = (a, b) {
  // On every yield, the current fiber is suspended.
  // The yielded value is given to whoever resumed the fiber.
  while (a < b): yield a++
}
```

Certain actions yield automatically (eg: network requests, disk I/O).

#### Creating fibers

```js
foo = ^{
  yield 1
  yield // same as `yield null`
  assert(Fiber.main is Fiber)
  assert(Fiber.self() is Fiber)
}
catch {
  // Catch any errors thrown by the fiber.
}

// Start or resume the fiber.
assert(foo() == 1)
assert(foo() == null)
assert(foo.done)
assert(foo() == null)
assert(foo.done)
```

Use `do ^{}` to create a fiber whose yielded values are ignored:

```js
do ^{
  // Whatever you yield is ignored.
  yield 3.14

  print 'in fiber'  // this logs later
}
print 'after fiber' // this logs first
```

### If statements

```js
// One-liner
if (foo) bar()

// Multi-line
if (foo) {
  // do something if `foo` is truthy
} then if (bar) {
  // do something if `foo` and `bar` are truthy
} else if (cond) {
  // do something if `foo` and `bar` are falsy and `cond` is truthy
} else {
  // do something if `foo`, `bar`, and `cond` are falsy
}
```

### Do blocks

Do blocks are sleaker IIFEs.

The last expression of a do block is its return value.

```js
do {
  // do stuff..
}
```

### Ranges

```js
// Closed ranges
range = 1..3
range = 1..<3
assert(range is Range)

// Open ranges
range = <3
range = >=0
assert(range is Range)
```

## Static Typing

Primitive types:
- `byte`
- `bool`
- `number`
- `string`
- `object`
- `list`

Abstract types:
- `any` (extended by every type)
- `never` (extends every type)

Collection types:
- `any[]` (a list of anything)
- `[number]` (a fixed list containing one number)

### Inferred types

```js
foo = 1
assert(foo is number)
```

Mutations affect the type information of a variable.

```js
foo = 1
assert(foo is number)
foo = ''
assert(foo is string)
```

Return types are always inferred, but users can narrow them with explicit types.

```js
foo = (a: number) => a + 1
bar = () => 1
assert(foo is (a: number) => number)
assert(bar is () => 1)
```

### Explicit types

For explicit types, tuple/object/function types must be used via type alias.

```js
let foo: number

foo = '1'
// error: expected number, got string
```

The type of a `let` binding can never change.

### Non-nullable

Use `!` to denull a value.

```js
let foo: number?
let bar: number

bar = foo!
```

### Type casting

Type casting puts the developer in full control.

```js
foo = (a: number) => _

// Cast an argument
foo(<any>'1')

// Cast a return value
bar = <any>foo(1)
```
