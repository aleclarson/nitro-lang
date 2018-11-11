# nitro.stdlib

*TODO:* Look at other standard libraries. ;)

## Global

### `assert(cond: boolean): void`

Failed assertions throw an `AssertionError` whose message contains the expression passed to `assert` (like [better-assert](https://github.com/tj/better-assert) but built-in).

```js
a = 1
b = 2
assert(a == b) // AssertionError: `a == b`
```

### `type(value: any): Function`

Get the constructor of any value.

```js
type(1)     == Number
type('')    == String
type(a: 1)  == Object
type(false) == Boolean
```

## Math

```js
(
  :abs
  :max
  :min
  :floor
  :ceil
  :sin
  :cos
  :tan
) = Math
```
