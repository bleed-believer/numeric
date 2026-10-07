# @bleed-believer/numeric

Exact, arbitrary-precision decimal numbers for JavaScript and TypeScript, backed by `bigint`.

```ts
import { Numeric } from '@bleed-believer/numeric';

0.1 + 0.2;                                              // 0.30000000000000004
new Numeric('0.1').add(new Numeric('0.2')).toString();  // "0.3"
```

`Numeric` is a fixed-point decimal: an integer (`bigint`) plus a scale (the number of digits after the decimal point), the same model used by PostgreSQL's `numeric` and Java's `BigDecimal`. Addition, subtraction and multiplication are always exact. Division is exact up to the number of decimals you ask for, and the rest is rounded with the mode you choose.

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Key concepts](#key-concepts)
- [Creating values](#creating-values)
- [Arithmetic](#arithmetic)
- [Rounding](#rounding)
- [Comparison](#comparison)
- [Conversion](#conversion)
- [Errors](#errors)
- [API reference](#api-reference)
- [License](#license)

## Installation

```sh
npm install @bleed-believer/numeric
```

The package is an ES module with no runtime dependencies, and ships its own TypeScript declarations.

## Quick start

```ts
import { Numeric, RoundMode } from '@bleed-believer/numeric';

const price = new Numeric('19.99');
const quantity = new Numeric('3');
const taxRate = new Numeric('0.19');

const subtotal = price.multiply(quantity);              // 59.97
const tax = subtotal.multiply(taxRate).round(2);        // 11.39
const total = subtotal.add(tax);                        // 71.36

total.toFixed(2);                                       // "71.36"
total.gt(new Numeric('50'));                            // true
JSON.stringify({ total });                              // '{"total":"71.36"}'

// Split a bill among 3 people, rounding to cents:
total.split(new Numeric('3'), 2).toString();            // "23.79"
total.split(new Numeric('3'), 2, RoundMode.Down).toString(); // "23.78"
```

## Key concepts

### Immutable

Every method returns a new `Numeric` (or reuses an existing one when the result is the same value); no method ever modifies the instance it's called on.

```ts
const a = new Numeric('1');
const b = a.add(new Numeric('1'));
a.toString(); // "1"
b.toString(); // "2"
```

### Always normalized

Trailing zeros in the decimal part are removed when a value is created and after every operation, so each number has exactly one representation. `"1.50"`, `"1.5"` and `"1.500"` are the same value, and `toString()` prints all of them as `"1.5"`.

```ts
new Numeric('1.50').toString();                         // "1.5"
new Numeric('0.5').add(new Numeric('0.5')).toString();  // "1"
new Numeric('-0.0').toString();                         // "0"
```

Use [`toFixed`](#tofixeddecimals-mode-string) when you need a fixed number of decimals in the output.

### Maximum scale

A value can have at most **16383** digits after the decimal point, the same limit as PostgreSQL's `numeric`. The integer part has no limit. Any input or result that needs more decimals throws a `RangeError`. Since a product has as many decimals as both operands combined, a long chain of multiplications may reach that limit; use [`round`](#rounddecimals-mode-numeric) in between to keep it bounded.

### Only `Numeric` operands

Arithmetic and comparison methods accept only `Numeric` instances, never raw `number`s or strings. Converting is always explicit, so it's clear where a value comes from and when precision could have been lost:

```ts
total.add(new Numeric('0.1'));  // ✔
total.add(0.1);                 // ✘ TypeScript error
```

### No implicit conversion

`valueOf()` throws, so JavaScript operators can't silently produce wrong results:

```ts
const a = new Numeric('10');
const b = new Numeric('9');

a < b;        // throws TypeError (otherwise it would compare "10" < "9" as strings: true)
a + b;        // throws TypeError (otherwise it would concatenate: "109")
a.lt(b);      // false ✔
a.add(b);     // 19 ✔
```

Converting to a string still works: `String(n)`, template literals (`` `${n}` ``) and `JSON.stringify` all give the same output as `toString()`.

## Creating values

```ts
new Numeric(input: string | number | bigint | { value: bigint, scale: number })
```

### From a string (recommended)

Strings are read exactly as written. The accepted format is plain decimal notation: an optional `-`, at least one integer digit, and optionally a `.` followed by at least one digit.

```ts
new Numeric('12');          // 12
new Numeric('-0.5');        // -0.5
new Numeric('007.10');      // 7.1
new Numeric('123456789012345678901234567890.000000000000000001');
```

These are rejected with a `TypeError`: `'+5'`, `' 5'`, `'1e3'`, `'.5'`, `'5.'`, `'1,5'`, `''`.

A string with more than 16383 decimals is rejected with a `RangeError`, even if they're all trailing zeros.

### From a number

Numbers are converted through their `toString()`, so the value is taken exactly as JavaScript prints it:

```ts
new Numeric(1.25).toString();       // "1.25"
new Numeric(0.1 + 0.2).toString();  // "0.30000000000000004"
```

Numbers that JavaScript prints in exponent notation (`>= 1e21`, or `< 1e-6` like `1e-7`), as well as `NaN` and `Infinity`, are rejected with a `TypeError`. Prefer strings whenever the value must be exact.

### From a bigint

A `bigint` is taken as an integer:

```ts
new Numeric(5n).toString();         // "5"
new Numeric(-(10n ** 30n)).toString(); // "-1000000000000000000000000000000"
```

### From a value and a scale

An object with a `bigint` `value` and an integer `scale` represents `value / 10^scale`. It's useful to build values from integer amounts, such as cents stored in a database:

```ts
new Numeric({ value: 125n, scale: 2 }).toString();   // "1.25"
new Numeric({ value: 1999n, scale: 2 }).toString();  // "19.99"
new Numeric({ value: 1500n, scale: 3 }).toString();  // "1.5" (normalized)
```

A negative or non-integer scale throws a `RangeError`.

## Arithmetic

All arithmetic methods return a new, normalized `Numeric`.

```ts
const a = new Numeric('10.5');
const b = new Numeric('4');

a.add(b).toString();          // "14.5"
a.subtract(b).toString();     // "6.5"
a.multiply(b).toString();     // "42"
a.split(b, 2).toString();     // "2.63"  (2.625 rounded with HalfUp)
a.negate().toString();        // "-10.5"
a.negate().abs().toString();  // "10.5"
```

### Division

A division may never end (`1 / 3 = 0.333…`), so `split` always takes the maximum number of decimals of the result. The remaining digits are rounded with a [`RoundMode`](#rounding), `HalfUp` by default. The rounding is exact: it looks at the whole remainder, not just the next digit.

```ts
const one = new Numeric('1');

one.split(new Numeric('3'), 6).toString();                      // "0.333333"
one.split(new Numeric('3'), 6, RoundMode.Up).toString();        // "0.333334"
one.split(new Numeric('8'), 2, RoundMode.HalfEven).toString();  // "0.12"
one.split(new Numeric('2'), 6).toString();                      // "0.5" (normalized)
```

Dividing by zero throws a `RangeError`.

## Rounding

`round`, `toFixed` and `split` take an optional `RoundMode`, `RoundMode.HalfUp` by default.

| Mode                 | Rule                                            | `2.5` | `-2.5` | `2.1` | `-2.1` | `2.6` |
| -------------------- | ----------------------------------------------- | ----: | -----: | ----: | -----: | ----: |
| `RoundMode.Up`       | Away from zero                                  |   `3` |   `-3` |   `3` |   `-3` |   `3` |
| `RoundMode.Down`     | Towards zero (truncate)                         |   `2` |   `-2` |   `2` |   `-2` |   `2` |
| `RoundMode.Ceiling`  | Towards positive infinity                       |   `3` |   `-2` |   `3` |   `-2` |   `3` |
| `RoundMode.Floor`    | Towards negative infinity                       |   `2` |   `-3` |   `2` |   `-3` |   `2` |
| `RoundMode.HalfUp`   | Nearest; a tie goes away from zero (default)    |   `3` |   `-3` |   `2` |   `-2` |   `3` |
| `RoundMode.HalfDown` | Nearest; a tie goes towards zero                |   `2` |   `-2` |   `2` |   `-2` |   `3` |
| `RoundMode.HalfEven` | Nearest; a tie goes to the even neighbor (banker's rounding) | `2` | `-2` | `2` | `-2` | `3` |

In the `Half*` modes, a tie only exists when the whole discarded part is exactly half a unit: `2.50` rounded to 0 decimals is a tie, but `2.501` isn't (every `Half*` mode rounds it to `3`).

### `round` vs `toFixed`

- `round(decimals, mode?)` returns a `Numeric` with **at most** `decimals` decimals. It's normalized, so it never gains decimals.
- `toFixed(decimals, mode?)` returns a `string` with **exactly** `decimals` decimals, padding with zeros if needed.

```ts
const n = new Numeric('1.666');

n.round(1).toString();                  // "1.7"
n.round(1, RoundMode.Down).toString();  // "1.6"
n.toFixed(5);                           // "1.66600"

new Numeric('5').round(2).toString();   // "5"
new Numeric('5').toFixed(2);            // "5.00"

new Numeric('1.005').toFixed(2);        // "1.01" (unlike (1.005).toFixed(2), which gives "1.00")
new Numeric('-0.004').toFixed(2);       // "0.00" (never "-0.00")
```

## Comparison

```ts
const a = new Numeric('0.9');
const b = new Numeric('0.12');

a.compare(b);   // 1   (-1 if a < b, 0 if equal, 1 if a > b)
a.equals(b);    // false
a.lt(b);        // false
a.lte(b);       // false
a.gt(b);        // true
a.gte(b);       // true

a.min(b).toString();  // "0.12"
a.max(b).toString();  // "0.9"

new Numeric('1.50').equals(new Numeric('1.5'));  // true
new Numeric('-0.5').sign();                      // -1
new Numeric('0.000').isZero();                   // true
```

`compare` works as a sort callback:

```ts
const values = ['2', '-1.5', '0.12', '0', '0.9'].map(x => new Numeric(x));
values.sort((x, y) => x.compare(y));
values.map(String); // ["-1.5", "0", "0.12", "0.9", "2"]
```

When both values are equal, `min` and `max` return the instance they're called on.

## Conversion

```ts
const n = new Numeric('-1234.50');

n.toString();             // "-1234.5"
n.toFixed(3);             // "-1234.500"
n.toJSON();               // "-1234.5"
String(n);                // "-1234.5"
`${n}`;                   // "-1234.5"
JSON.stringify({ n });    // '{"n":"-1234.5"}'
```

`toJSON` returns a string on purpose: a JSON number would be parsed back as a JavaScript `number` and lose precision. To read it back, pass the string to the constructor:

```ts
const data = JSON.parse('{"n":"-1234.5"}');
const n = new Numeric(data.n);
```

## Errors

| Error        | When                                                                                 |
| ------------ | ------------------------------------------------------------------------------------ |
| `TypeError`  | The constructor receives an unsupported type or a string/number with an invalid format. |
| `TypeError`  | `decimals` isn't a `number` (`round`, `toFixed`, `split`).                          |
| `TypeError`  | An unknown `RoundMode` is used while discarding digits.                              |
| `TypeError`  | `valueOf()` is called, explicitly or by an operator like `<`, `+` or `==`.           |
| `RangeError` | A scale or `decimals` is negative, isn't an integer, or exceeds 16383.               |
| `RangeError` | A result needs more than 16383 decimals (e.g. a long chain of multiplications).      |
| `RangeError` | `split` divides by zero.                                                             |

## API reference

### `class Numeric`

#### Creation

| Member | Description |
| --- | --- |
| `new Numeric(input)` | Creates a value from a `string`, `number`, `bigint` or `{ value: bigint, scale: number }`. See [Creating values](#creating-values). |

#### Arithmetic

| Member | Description |
| --- | --- |
| `add(n: Numeric): Numeric` | Exact sum. |
| `subtract(n: Numeric): Numeric` | Exact difference. |
| `multiply(n: Numeric): Numeric` | Exact product. Throws `RangeError` if the result needs more than 16383 decimals. |
| `split(n: Numeric, decimals: number, mode?: RoundMode): Numeric` | Division with at most `decimals` decimals, rounded with `mode`. Throws `RangeError` when `n` is zero. |
| `negate(): Numeric` | The value with its sign flipped. |
| `abs(): Numeric` | The absolute value. Returns the same instance if it isn't negative. |

#### Rounding

| Member | Description |
| --- | --- |
| `round(decimals: number, mode?: RoundMode): Numeric` | Rounds to at most `decimals` decimals. |

#### Comparison

| Member | Description |
| --- | --- |
| `compare(n: Numeric): -1 \| 0 \| 1` | `-1` if this value is less than `n`, `0` if equal, `1` if greater. |
| `equals(n: Numeric): boolean` | `true` if both represent the same number. |
| `lt(n: Numeric): boolean` | Less than. |
| `lte(n: Numeric): boolean` | Less than or equal. |
| `gt(n: Numeric): boolean` | Greater than. |
| `gte(n: Numeric): boolean` | Greater than or equal. |
| `min(n: Numeric): Numeric` | The smaller value (this one if equal). |
| `max(n: Numeric): Numeric` | The greater value (this one if equal). |
| `sign(): -1 \| 0 \| 1` | `-1` if negative, `0` if zero, `1` if positive. |
| `isZero(): boolean` | `true` if the value is zero. |

#### Conversion

| Member | Description |
| --- | --- |
| `toString(): string` | Plain decimal notation, normalized (`"1.5"`, `"-3"`). |
| `toFixed(decimals: number, mode?: RoundMode): string` | Exactly `decimals` decimals, padded or rounded. |
| `toJSON(): string` | Same as `toString()`; used by `JSON.stringify`. |
| `valueOf(): never` | Always throws `TypeError`, to block implicit conversions. |

### `enum RoundMode`

| Member | Value |
| --- | --- |
| `RoundMode.Up` | `'up'` |
| `RoundMode.Down` | `'down'` |
| `RoundMode.Ceiling` | `'ceiling'` |
| `RoundMode.Floor` | `'floor'` |
| `RoundMode.HalfUp` | `'half-up'` (default) |
| `RoundMode.HalfDown` | `'half-down'` |
| `RoundMode.HalfEven` | `'half-even'` |

## License

[MIT](./LICENSE)
