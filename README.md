# nitro-lang

Enjoy a language that embraces: **simplicity, immutability, and reactivity**

Nitro apps run anywhere by compiling to [WASM](https://webassembly.org/).

- **File extension:** `.nt`
- **Strongly typed?** Yes, with [type inference](https://en.wikipedia.org/wiki/Type_inference)
- **Compiles to:** `.wasm`
- **Inspired by:** [TypeScript][ts], JavaScript, [CoffeeScript][coffee], [Lua][lua], C, [Ghost][ghost]

[coffee]: https://github.com/jashkenas/coffeescript
[ghost]: https://github.com/jamiebuilds/ghost-lang
[lua]: https://en.wikipedia.org/wiki/Lua_(programming_language)
[ts]: https://github.com/Microsoft/TypeScript

&nbsp;

> ### ⚠️ **NITRO IS JUST A CONCEPT LANGUAGE.** Help us make it!

&nbsp;

### JSX in Nitro

Since JSX is the new hotness, let's learn about JSX in Nitro before anything else. Even before comments! Why teach JSX in Nitro before all else? Because we believe Nitro is familiar enough for you to understand what you're about to see.

Nitro's stdlib has JSX utilities built-in.

```js
import (render, useContext, ReactNode) from 'nitro-react'

type Props = (id: string, items: ReactNode[])

Foo = (props: Props, children) {
  theme = useContext(ThemeContext)

  // Expressions must be wrapped with parens..
  <div hidden id=(props.id)>
    // ..except strings and comments
    <h1 theme()>"Hello world"</h1>
    // Here is an if expression!
    (if children {
      // The `theme()` part lets a function alter the props and introspect the component tree.
      <p theme()>(children)</p>
    })
    // Here is a for..in expression!
    (for (key, value) in props.items {
      // The `:key` part sets the "key" prop to the `key` variable.
      <div :key class="item" theme()>
        // Ternary operator to the rescue.
        (value ? <p>value</p> : null)
      </div>
    })
  </div>
}

items = (a: 1, b: 0, c: 1)
render(
  <Foo id="foo" :items>
    "Hello world"
  </Foo>
)
```

In the future, the stdlib will have useful primitives for creating your own React-like library. This will provide maximum interoperability between component-based frameworks.

&nbsp;

### Comments

Inline comments only

```js
// You know what it is.
```

&nbsp;

### Logging

```js
log 'hello world'
log(foo)

// Log an error string or object via stderr
log.error(Error('wtf'))
```

&nbsp;

### Variables

```js
// Declare your first variable:
a = 1

// Override your first variable:
a = 2
```

Because assignment is actually an override, nested scopes cannot affect their parent scopes (without reactivity).

```js
a = 1
do {
  a = 2
  b = 2
  log(a) // 2
  log(b) // 2
}
log(a) // 1
log(b) // error: 'b' was never declared
```

Conditional overrides affect the variable type:

```js
a = 1
b = 1
do {
  a = a > 0 ? 'foo' : _
  if b > 0: b = true

  assert(a is string | void)
  assert(b is true | number)
}
```

[Do blocks](#do-blocks) and [if statements](#if-statements) are described later on.

&nbsp;

### Reactive variables

Variables can be reactive. They always reflect the latest evaluation of their expression.

```js
*foo = bar + 1
assert(foo == bar + 1)

// Cache the current value:
snapshot = foo
assert(foo == snapshot)

// Trigger an update:
bar += 1
assert(foo == bar + 1)
assert(foo != snapshot)

// Disable reactivity by re-binding `foo`:
foo = null

// You can export reactive variables.
export *foo
```

Reactive objects/arrays/sets are the only way for nested scopes to affect their parent scopes.

```js
*state = (a: 1)
do {
  state.a = 2
}
assert(state.a == 2)
```

&nbsp;

### Global variables

To ensure type safety, global variables must be statically assigned. This restriction also exists for local variables.

```js
global foo = true
foo // => true
```

Local variables override (but not overwrite) global variables.

```js
foo = false
global foo = true

foo // => false
global.foo // => true
```

Global variables can be reactive.

```js
// Depend on any reactive variables used inside `bar`
global *foo = bar()
```

Global variables cannot be declared in a nested scope.

```js
// OK
global foo = true

// OK
global bar = foo ? 1 : 0

// BAD
if something {
  global jQuery = null
}
```

Global variables cannot be mutated or redeclared.

Global naming collisions are compiler errors.

Global variables are only visible to modules that directly import them, have a direct dependency that imports them, or have an indirect dependency that imports them.

&nbsp;

### null

The primitive value for "intentional nothing".

```js
a = null
assert(typeof a == 'null')
```

&nbsp;

### void

Functions that return nothing have a return type of `void`.

The only `void` value is the hole value: `_`

Learn more about holes [here](#holes).

&nbsp;

### Strings

Strings are groups of characters surrounded by unescaped quotes.

```js
// A static string
foo = 'bar'
```

Static strings are the most efficient string. They have no support for interpolation, but you can use the `+` operator to combine it with other values. Property names are inherently static strings, so using dot-notation like `foo.bar` is identical to `foo['bar']` in terms of performance.

The syntax for joining two strings is familiar to most web developers:

```js
log 'a' + "b"
// prints "ab"
```

&nbsp;

### Interpolated Strings

Interpolated strings must use double quotes.

For variables, use the `$` prefix syntax.

For expressions, use the `$()` wrapper syntax.

Both syntaxes coerce the value to a string by calling the `toString` meta-method.

```js
foo = 1
log "$foo sec => $(foo * 1000)ms"
// prints "1 sec => 1000ms"
```

&nbsp;

### Multi-Line Strings

Multi-line strings must use double quotes.

```c
foo = ("
  a b c      // comments are ignored
")

// Same as:
bar = "a b c"
assert(foo == bar)
```

The parentheses are **required.**

&nbsp;

### Numbers

```rust
// Whole numbers
12345

// Fractions
0.5

// Scientific notation
1e3

// Big ints
2i
```

The hole value (`_`) can be used to improve readability of long numbers.

```rust
1_000_000
```

The following values are built-in constants:

```rust
inf // infinite positive number
π   // an approximation of PI
```

Of course, numbers can be compared:

```rust
x > y
x < y
x >= y
x <= y
```

And bitwise operators exist:

```rust
x & y   // and
x | y   // or
x ^ y   // xor
~x      // not
x << y  // left shift
x >> y  // sign-propagating right shift
x >>> y // zero-fill right shift
```

By default, all number literals are the `number` type.

Use type-casting to optimize memory usage:

```rust
a = 1
b = <int8>a

assert(a is number)
assert(b is int8)
```

&nbsp;

### Ranges

```rust
// Closed ranges
range = 1..3
range = 1..<3

// Open ranges
range = <3
range = >=0

// Fractional ranges
range = 1.5..2.5
```

Ranges can be used to slice strings and lists:

```js
array = [1, 2, 3, 4]

array[>1]    // => [3, 4]
array[1..2]  // => [2, 3]

'abcd'[>1]   // => "cd"
'abcd'[1..2] // => "bc"
```

&nbsp;

### The `in` operator

```js
let result: boolean
result = value in sequence
```

The `sequence` is one of `Range | Array | Set | Object`.

The meaning of `result == true` depends on the `sequence` type:
- `Range` means `value` is in the given range
- `Array|Set` means `value` is in the given array/set
- `Object` means `value` is a key that's defined in the object

```js
// w/ ranges
0 in >1       // => false
1.99 in 0..2  // => true

// w/ arrays
0 in []       // => false
0 in [1]      // => false
1 in [1]      // => true

// w/ objects
'a' in ()     // => false
'a' in (a: 1) // => true
```

The `!in` operator does the opposite.

```js
assert(0 !in >1)
assert(0 !in [])
assert(0 !in ())
```

&nbsp;

### Equality operators

```js
assert(1 == 1) // exact
assert(1 != 1) // not exact
assert(1 ~= 1) // shallow equal
```

&nbsp;

### The `typeof` operator

```js
typeof [] == "array"
typeof () == "object"
typeof Set() == "set"
typeof 0 == "number"
typeof Foo == "class"
typeof Foo() == "object"
typeof (add() {}).add == "method"
typeof (add() => {}) == "function"
typeof null == "null"
typeof _ == "void"
typeof ^{} == "fiber"
```

&nbsp;

### Objects

To create an object:

```js
foo = (a: 1, b: (c: 1))
assert(foo.a == foo.b.c)

// Use variable names and values.
bar = (:foo, bar: 1)
assert(bar.foo == foo)
```

To mutate an object:

```js
foo = (a: 1)
bar = foo

foo.a = 2
assert(foo != bar)
assert(foo.a == 2)
assert(bar.a == 1)

// Remove a property:
foo.a = _
assert('a' !in foo)
```

Function calls let you omit parentheses when an object is the only argument.

```js
// 1 argument
log(a: 1, b: 2)

// 2+ arguments
log((a: 1), (b: 2))
```

You can call an object to shallow merge other objects.

```js
obj = (a: 1, b: (c: 1))
obj(a: 2, b: (), c: 2)

assert(obj.a == 2)
assert(obj.b.c == _)
assert(obj.c == 2)
```

Object keys can be _any_ value.

For non-strings, use `[]` to get/set on existing objects:

```js
// Numbers
obj[0] = true
obj[0.1] = true

// Objects
obj[obj] = obj

// Anything
obj[null] = true
```

For non-strings, use `[]:` to define on new objects:

```js
obj = (
  a: 1,
  0: true,
  [inf]: true,
  [null]: true,
)
```

Getters and setters as you know them from Javascript are _not_ supported.

&nbsp;

#### Private keys

Object keys prefixed like `_ foo: 1` are private.

Private keys are neither readable or writable from outside the module.

Private keys are never shown via IntelliSense (outside the module).

```js
obj = (
  _ a: true,
  _ 1: true,
  _ [var]: () => _,
  _ method() {},
)

obj.a      // => true
'a' in obj // => true
```

Both `_ foo` and `_foo` create a private key, but with different names.

```js
obj = (
  _a: true,
  _method() {},
  _ method() {},
)

obj._a      // => true
'_a' in obj // => true

// Both private, different name
assert(obj._method)
assert(obj.method)
```

&nbsp;

#### Reactive objects

An object property can wrap its value in `*()` to become reactive.

```js
foo = 0
obj = (
  foo: *(foo + 1),
)

assert(obj.foo == 1)
foo += 1
assert(obj.foo == 2)
```

An entire object is reactive when declared like this:

```js
obj = *(foo: 1)
```

Reactive objects cannot be mutated.

&nbsp;

### Arrays

Arrays are immutable, ordered collections.

```js
foo = [1, 2, 3]
assert(foo[0] == 1)

// Re-binding preserves identity
bar = foo
assert(bar == foo)

// Mutating triggers an implicit copy
bar[0] = 2
assert(bar != foo)
```

The multi-line syntax allows for trailing commas:

```js
array = [
  1,
  2,
  3,
]
```

&nbsp;

### Length operator

The length operator is taken from Lua.

```js
// Number of items
array = []
assert(#array == 0)

// Number of keys
object = ()
assert(#object == 0)

// Length of string
string = ''
assert(#string == 0)
```

&nbsp;

### Holes

```js
// Sparse array
array = [1, _, 3]
array[1] // => _

// Shorthand void return
noop = () => _
noop() // => _

// Ignored params
cb = (_, _, c) => c

// Ignore all params
truth = _ => true

// Currying
fun = (a, b) => a / b
fun(_, 2)(6) // => 3
```

&nbsp;

### Destructuring

```js
// Arrays / Sets
[a, b, ..rest] = [1, 2, 3, 4]
assert(a == 1)
assert(b == 2)
assert(rest ~= [3, 4])

// Objects
(:a, :b, ..rest) = (a: 1, b: 2, c: 3)
assert(a == 1)
assert(b == 2)
assert(rest ~= (c: 3))
```

The rest operator (`..`) can only appear once per statement. It can be anywhere in the list of variable names.

```js
[..rest, last] = [1, 2]
assert(rest is Array<number>)
assert(rest[0] == 1)
assert(last == 2)

[a, ..foo, b] = [1, 2, 3, 4]
assert(a == 1)
assert(b == 4)
assert(foo[0] == 2)
assert(foo[1] == 3)
```

You can use array destructuring to swap variables.

```js
a = 1
b = 2

// This magic moment
[a, b] = [b, a]

assert(a == 2)
assert(b == 1)
```

The ["Functions" section](#functions) will teach you about destructuring an argument in the parameter list!

&nbsp;

### Boolean chaining

```js
a = b and c
```

The `and` operator returns `b` when `b` is falsy, else it returns `c`.

```js
a = b or c
```

The `or` operator returns `b` when `b` is truthy, else if returns `c`.

&nbsp;

### Ternary operator

```js
a = b ? c : d
```

When `b` and `c` are strict equal, you can shorten the expression:

```js
a = b ?: d
```

&nbsp;

### If statements

```js
// One-liner
if foo: bar()

// Multi-line
if foo {
  // do something if `foo` is truthy
} else if cond {
  // do something if `foo` and `bar` are falsy and `cond` is truthy
} else {
  // do something if `foo`, `bar`, and `cond` are falsy
}
```

You can bind a variable in the condition of an `if` statement:

```js
let a: (b?: (c?: (d: number)))
a = ()

// The `foo` variable is only accessible inside the `if` block.
if foo = a.b.c.d {
  // Since `a.b` is void, `a.b.c.d` cannot be resolved.
  // Instead of a runtime error, the `if` block is skipped.
  // Of course, "if bindings" are still type-safe.
}
```

<sup>Psst. If anyone asks, they're called "if bindings".</sup>

&nbsp;

### Do blocks

Do blocks are [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)s done right.

```js
result = do {
  // do something in a new scope
}
```

The last expression of a do block is always its return value.

The `try` keyword is an alias of `do`.

&nbsp;

### Catch blocks

Catch blocks can follow _any_ block, not just `try` blocks.

They prevent `throw` statements from crashing the program.

They can optionally bind the thrown value to a variable, which is only accessible inside the catch block.

```js
try {
  throw 'any value'
} catch(e) {
  throw e // re-throwing is okay
}

if (foo) {
  throw 'foo == true'
} else {
  throw 'foo == false'
} catch {
  // do something when `if` or `else` blocks throw
}
```

Catch blocks can declare which value types they expect.

```js
try {}
// Only catch errors (the default behavior)
catch(e: Error) {
  throw e
}
// To catch non-errors, you must use explicit types:
catch(value: any) {
  log(value)
}
```

Catch blocks can follow catch blocks. :)

The compiler throws if you place a catch block with a broader type (ie: less specific) before a catch block with a narrower type (ie: more specific).

&nbsp;

### Finally blocks

Finally blocks are guaranteed to run before their scope pops, just like in Javascript.

Unlike `catch` blocks, `finally` blocks have no binding (eg: `catch error`).

Other than that, they are identical to `catch` blocks.

&nbsp;

### Loops

Loops can be one-liners or blocks.

Of course, `break` and `continue` exist.

```js
// for..of (one-liner)
for value of [1, 2, 3]: log(value)

// for..of
for value of [1, 2, 3] {
  log(value)
}

// for..in (one-liner)
for i in 1..3: log(i)

// for..in (with object)
for key in obj {
  assert(key in obj)
}
for (key, value) in obj {
  assert(obj[key] == value)
}

// for..in (with array)
for index in array {
  assert(index in 0 ..< #array)
}
for (index, value) in array {
  assert(array[index] == value)
}

// for..in (with types)
for (key: id) in (a: 1, b: 2) {
  log(key)
}

// while (one-liner)
while true: foo()

// while
while a > b {
  foo(a, b)
}

// until (one-liner)
until false: foo()

// until
until a < b {
  foo()
}

// do..while (one-liner)
do { foo(a, b) } while true

// do..until (one-liner)
do { foo(a, b) } until a > b

// try..catch..while
try {
  foo(a, b)
}
catch(err: Error) {
  // Catches `do` errors, then moves to `while` condition
  // if this block doesn't throw as well.
}
while a < b
```

The `for..of` and `for..in` loops are null-safe, which means the loop is skipped when its source is non-iterable.

`do/try..while` loops are incapable of being one-liners.

&nbsp;

### Functions

Functions take an input value (in the form of an argument list) and return an output value (more commonly called the "return value").

```js
// Function block (explicit types)
bar = (a: number, b: number): number {
  a + b
}

// One-line function (inferred types)
add = (a, b) { a + b }
assert(add is (a: any, b: any) => any)
// (explicit types)
add = (a: number, b: number): number { a + b }
assert(add is (a: number, b: number) => number)
```

&nbsp;

#### Implicit returns

All functions have implicit return values, but you can opt-out on a per-function basis by declaring `void` as the return type.

```js
bar = (a, b): void { a + b }
bar() // => _
```

&nbsp;

#### Early returns

To return early, use the `return` keyword.

You _cannot_ use `return` in the last statement of a function.

```js
foo = (a, b) {
  if a < 0 or b < 0: return 0
  //
  // [insert tons of code here]
  //
}
```

You must use reactive objects/arrays to mutate above your own scope:

```js
*state = (a: 1)
foo = () { state.a += 1 }

foo()
assert(state.a == 2)

foo()
assert(state.a == 3)
```

&nbsp;

### Argument destructuring

You can use object/array/set destructuring inside the parameter list:

```js
// An object
Point = ((x, y): (x: number, y: number)) {
  log(:x, :y)
}

// An array
Point = ([x, y]: [number, number]) {
  log(:x, :y)
}

// Both in one function
Component = (
  [a, b, c]: [any, any, any],
  (x, y, z): (x: number, y: number, z: number),
) {
  log(:a, :b, :c, :x, :y, :z)
}
```

&nbsp;

### Optional arguments

An optional argument _cannot_ precede a required argument.

```js
foo = (a?, b?: number) => a or b

foo()     // => _
foo(1)    // => 1
foo(0, 2) // => 2
```

&nbsp;

### Rest arguments

Just like with destructuring, the rest operator can appear anywhere in the argument list.

```js
foo = (a, ..b: number[]) => b

foo(1, 2, 3) // => [2, 3]
```

&nbsp;

### Currying

```js
add = (a: number, b: number) => a + b
addFive = add(5, _)
addFive(1) // => 6

// Holes can go anywhere
addFive = add(_, 5)
```

&nbsp;

### Pipelines

```js
add = (a, b) => a + b
div = (a, b, c) => a / b / c

// Pipe operator + currying
bar = foo | add(5, _) | div(1, _, 3)
```

In pipelines, you can only use one hole (`_`) per curry. Also, you cannot pipe into a function with 2+ required arguments. You should curry those functions into 1-argument functions first.

&nbsp;

### Optional parens

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

&nbsp;

### Methods and the `this` keyword

"Methods" are functions that are known to be owned by an object.

They are hidden from `for..in` loops and the `in` operator.

Every method has an implicit context called `this`.

```js
// NOTE: The explicit types are optional.

type Foo = (
  foo: number,
  addFoo(n: number): void,
  bar?(): void,
)

obj = <Foo>(
  foo: 1,
  addFoo(n) { this.foo + n },
)

// Call a method
obj.addFoo() // => 1

// Call a possible method
obj.bar?() // => _

// Methods can become functions
(:addFoo) = obj

// But their `this` argument becomes the first argument
addFoo(obj, 1) // => 2
```

Declare a `this` argument to turn any function declaration into a method declaration:

```js
// Method declaration
add = (this: (foo: number), n: number) {
  this.foo + n
}

bar = (foo: 1, add)
bar.add(1)       // => 2

// Other ways to call unbound methods:
add((foo: 1), 1) // => 2
(foo: 1):add(1)  // => 2

// Bind `this` with the `bind` method (only available on methods)
boundAdd = add.bind(foo: 1)
boundAdd(1) // => 2
```

&nbsp;

### Bound functions

In bound functions, `this` refers to the parent scope's `this`.

If the parent scope has no implicit context, using `this` is a compiler error.

```js
// same penalty as accessing a variable from the parent scope
fn = () => this
```

If you never use `this`, the context is optimized out.

```js
// no this, no penalty
fn = () => 1
```

Bound functions can be multi-line:

```js
fn = (a, b) => {
  a + b
}
```

Function declarations should have explicit argument types. The return type can be implicit!

```js
fn = (a: number, b: number) => a + b
assert(fn is (a: number, b: number) => number)

// Inline functions can omit argument types.
doSomething((a, b) => a + b)
```

&nbsp;

### The `:` operator

The `:` operator lets functions be used as makeshift methods.

```js
add = (a: number, b: number) { a + b }

// The expression to the left of `:` becomes the first argument
foo = 1
foo:add(1) // => 2
```

&nbsp;

### Fibers

Fibers enable cooperative concurrency.

The active fiber is in control of its thread until it yields.

```js
// We are always on a fiber!
assert(Fiber.self())

// A yielding function (not a fiber)
foo = (a, b) {
  // On every yield, the current fiber is suspended.
  // The yielded value is given to whoever resumed the fiber.
  while (a < b): yield a++
}
```

_All functions_ are allowed to yield, because there is always an active fiber.

Fibers must be resumed manually, unless yielded to the current fiber.

Fibers die when there is nothing left to do. They cannot be reused.

The script responsible for resuming your fiber gets to decide how to interpret the values you `yield`.

The main fiber ise resumed in the following circumstances:
- A yielded promise has resolved
- All fibers that yielded before it have yielded again

Core functions may yield their fiber (eg: network requests, disk I/O).

&nbsp;

### Creating fibers

```js
foo = ^{
  yield 1
  result = yield // same as `yield _`
  assert(Fiber.main is Fiber)
  assert(Fiber.self() is Fiber)
  result
}
catch {
  // Catch any errors thrown by the fiber.
}
assert(foo)
assert(foo is Fiber)
```

After creating our fiber, we want to run it. The first option is to `yield` it to whatever fiber we're on. This tells our parent fiber to manage the newly created fiber, instead of doing it ourselves.

Otherwise, you can call the fiber in a loop and handle its state manually.

```js
// The easy way
yield foo

// The flexible way
values = while foo.next: foo.next()
```

Calling `fiber.next` in a loop is most useful when you care about what values are yielded by the fiber.

You can also use `for..of` on fibers, like a Javascript generator.

```js
for value of foo {
  // For every value yielded.
}
// The fiber exited.
```

If you just want all yielded values in an array:

```js
values = [..foo]
```

&nbsp;

### Sets

Sets are arrays with transparent deduplication.

```js
// Set literal
foo = Set(1, 2, 3, 2, 3, 1)
assert(foo is Set<number>)
assert(type(foo) extends Array<number>)

// Array{} -> Set{}
foo = Set(..[ 1, 1 ])

// Object{} -> Set{}
foo = Set(..Object.keys(a: 1, b: 2))
bar = Set(..Object.values(0: 'a', 1: 'b'))
foo = Set(..for key in obj: key)
bar = Set(..for val of obj: val)

// Sets are a subclass of arrays, so they can be compared.
assert(foo ~= ['a', 'b'])
assert(bar ~= ['a', 'b'])

// Capture the current value into `bar`
bar = foo
assert(foo == bar)

// Add a value to `bar`
bar.push(4)
assert(foo != bar)
bar = foo
```

&nbsp;

### Symbols

```js
// Create a symbol.
foo = @"a b"

// Symbols have an identity.
assert(foo != @"a b")

// Access a property with a symbol.
obj[foo]
obj[@"a b"] // => _
```

&nbsp;

### RegExp

The syntax for `RegExp` literals is familiar to most web developers:

```js
foo = /[a-z]+/gi
```

Multi-line `RegExp` literals are great for readability.

```js
foo = (/
  .+    // whitespace and comments are ignored
/gi)
```

The parentheses are **required.**

&nbsp;

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

// You can avoid importing `Foo`
test(.B) // => 1

test(1)
// error: expected enum Foo, got 1
```

&nbsp;

### Imports

```js
// Import parts of a module.
import (a, b, c) from './path/to/module'

// Import all of a module.
import foo from './path/to/module'

// Do both at once.
import foo, (a, b, c) from './path/to/module'

// Reactive variables must be marked as such.
import (*foo) from './path/to/module'
```

&nbsp;

### Exports

When the `export` keyword is first used with an object literal, that object is used to hold all future exports. All other object literals are merged into it. Pass anything else to override the current exports.

```js
// Export any variable or expression
export (
  foo: a + 1,
  bar: b,
  c,
  d,
  e,
)

// Override previous exports with any value
export 1 + 1

// Export a constant
export foo = 1 + 1
log(foo) // => 2

// Export a reactive variable
export *bar = foo + 1
```

&nbsp;

### Async imports

Async `import()` is a yielding function.

```js
import('https://cdn.nitro-lang.com/lodash@4.17.11/lodash.min.nt')
```

&nbsp;

### Import hooks

```js
// Load the JS->NT compiler to translate & memoize on-demand.
import.extend(/\.js$/, nitro.compileJS)
```

&nbsp;

### Runtime type-checking

```js
assert(1 is number) // => true
assert(typeof 1)    // => 'number'
```

&nbsp;

## Static Typing

The type system tries to adhere to TypeScript norms when possible.

Primitive types:
- `void`
- `null`
- `bool`
  - `true`
  - `false`
- `number`
  - `int8`
  - `uint8`
- `string`
- `object`
- `function`
- `fiber`
- `never` (extends every type)
- `any` (extended by every type)

Generic types:
- `([key: any]: any)` (an object with known key/value type)
- `Set<any>` (a set containing anything)

Collection types:
- `any[]` (an array of anything)
- `[number]` (a fixed array containing one number)

&nbsp;

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

&nbsp;

### Explicit types

```js
let foo: number
let bar: () => number

foo = '1'
// error: expected number, got string

bar = (a) => 1
// error: expected function type has no arguments
```

The type of a `let` binding can never change.

&nbsp;

### Non-nullable

Use `!` to denull a value.

```js
let foo: number?
let bar: number

bar = foo!
```

&nbsp;

### Type casting

Type casting puts the developer in full control.

```js
foo = (a: number) => _

// Cast an argument
foo(<any>'1')

// Cast a return value
bar = <any>foo(1)
```

Type casting is forbidden inside JSX.
