import type { BaseObject } from './interfaces/index.js';
import type { RoundMode } from '../rescale/index.js';

import { add, multiply, split, subtract } from '../operators/index.js';
import { normalize } from '../normalize/index.js';
import { rescale } from '../rescale/index.js';
import { Base } from '../base/index.js';

/**
 * An immutable decimal number with arbitrary precision, backed by a `bigint` and a scale
 * (the amount of digits after the decimal point). Unlike `number`, every operation is
 * exact: `0.1 + 0.2` is `0.3`.
 *
 * Every instance is kept normalized, meaning the trailing zeros of the decimal part are
 * removed (`"1.50"` is stored as `1.5`), and every method returns a new instance instead
 * of modifying the current one.
 *
 * The scale can't be greater than 16383 digits, so any operation whose result needs more
 * decimals than that throws a `RangeError`.
 *
 * @example
 * const a = new Numeric('0.1');
 * const b = new Numeric('0.2');
 * a.add(b).toString();     // "0.3"
 * a.toFixed(3);            // "0.100"
 */
export class Numeric {
    #value: Base;

    /**
     * Creates a new `Numeric` from:
     * - A `string` in plain decimal notation: an optional `-`, at least one integer digit,
     *   and optionally a `.` followed by at least one digit (`"12"`, `"-0.5"`, `"007.10"`).
     *   Signs like `+`, whitespace, exponents (`"1e3"`) and forms like `".5"` or `"5."`
     *   are rejected.
     * - A `number`, converted through its `toString()`. Numbers that JavaScript writes in
     *   exponent notation (`>= 1e21` or `< 1e-6`, e.g. `1e-7`), `NaN` and `Infinity` are
     *   rejected. Keep in mind that the value is taken exactly as JavaScript prints it, so
     *   `0.1 + 0.2` becomes `0.30000000000000004`; prefer strings for exact values.
     * - A `bigint`, taken as an integer (`5n` is `5`).
     * - An object with a `bigint` `value` and a `number` `scale`, representing
     *   `value / 10^scale` (`{ value: 125n, scale: 2 }` is `1.25`).
     *
     * @param input The value to represent.
     * @throws {TypeError} If `input` has an unsupported type or format.
     * @throws {RangeError} If the scale is negative, isn't an integer, or exceeds the
     * maximum scale.
     */
    constructor(input: string | number | bigint | BaseObject) {
        switch (typeof input) {
            case 'bigint':
            case 'number':
            case 'string': {
                if (typeof input !== 'string') {
                    input = input.toString();
                }

                const regex = /^(?<int>-?[0-9]+)(?:\.(?<dec>[0-9]+))?$/;
                const parts = regex.exec(input)?.groups as {
                    int: string;
                    dec: string;
                };

                if (!parts) {
                    throw new TypeError(`The value "${input}" isn't a safe number`);
                }

                if (typeof parts.dec !== 'string') {
                    parts.dec = '';
                }

                const target = new Base(
                    BigInt(parts.int + parts.dec),
                    parts.dec.length
                );

                const { value, scale } = normalize(target);
                this.#value = new Base(value, scale);
                break;
            }

            default: {
                if (
                    typeof input?.value === 'bigint' &&
                    typeof input?.scale === 'number'
                ) {
                    // `normalize` turns any zero into scale 0, so an invalid scale must be
                    // rejected before it disappears. The maximum is checked afterwards by
                    // `Base`, because a result may exceed it only before being normalized
                    // (e.g. a product whose trailing zeros are removed).
                    if (!Number.isInteger(input.scale) || input.scale < 0) {
                        throw new RangeError(`The scale value ${input.scale} must be a non-negative integer`);
                    }

                    const { value, scale } = normalize(input);
                    this.#value = new Base(value, scale);
                } else {
                    throw new TypeError(`The value expected to be string, number or a bigint`);
                }
            }
        }
    }

    /**
     * Returns the value in plain decimal notation, without trailing zeros in the decimal
     * part, and without a decimal point when the value is an integer.
     *
     * @example
     * new Numeric('1.50').toString();  // "1.5"
     * new Numeric('-3.0').toString();  // "-3"
     */
    toString(): string {
        return this.#value.toString();
    }

    /**
     * Returns the value as a string with exactly `decimals` digits after the decimal point,
     * padding with zeros or rounding with `mode` (`RoundMode.HalfUp` by default) as needed.
     * Unlike the arithmetic methods, the result is never normalized: `5` with 2 decimals
     * is `"5.00"`.
     *
     * @param decimals The exact amount of digits after the decimal point.
     * @param mode How to round the discarded digits. `RoundMode.HalfUp` by default.
     * @throws {RangeError} If `decimals` is negative, isn't an integer, or exceeds the
     * maximum scale.
     *
     * @example
     * new Numeric('5').toFixed(2);                         // "5.00"
     * new Numeric('1.005').toFixed(2);                     // "1.01"
     * new Numeric('2.5').toFixed(0, RoundMode.HalfEven);   // "2"
     */
    toFixed(decimals: number, mode?: RoundMode): string {
        const { value, scale } = rescale(this.#value, decimals, mode);
        return new Base(value, scale).toString();
    }

    /**
     * Rounds the value to at most `decimals` digits after the decimal point. The result is
     * normalized, so it never gains decimals: use `toFixed` to get a fixed amount of them.
     *
     * @param decimals The maximum amount of digits after the decimal point.
     * @param mode How to round the discarded digits. `RoundMode.HalfUp` by default.
     * @throws {RangeError} If `decimals` is negative, isn't an integer, or exceeds the
     * maximum scale.
     *
     * @example
     * new Numeric('1.666').round(1).toString();                // "1.7"
     * new Numeric('1.666').round(1, RoundMode.Down).toString(); // "1.6"
     * new Numeric('5').round(2).toString();                    // "5"
     */
    round(decimals: number, mode?: RoundMode): Numeric {
        const r = rescale(this.#value, decimals, mode);
        return new Numeric(r);
    }

    /**
     * Returns the exact sum of this value and `n`.
     *
     * @example
     * new Numeric('0.1').add(new Numeric('0.2')).toString(); // "0.3"
     */
    add(n: Numeric): Numeric {
        const r = add(this.#value, n.#value);
        return new Numeric(r);
    }

    /**
     * Returns the exact result of subtracting `n` from this value.
     *
     * @example
     * new Numeric('1').subtract(new Numeric('0.01')).toString(); // "0.99"
     */
    subtract(n: Numeric): Numeric {
        const r = subtract(this.#value, n.#value);
        return new Numeric(r);
    }

    /**
     * Returns the exact product of this value and `n`. The decimals of the result are the
     * sum of the decimals of both operands (before normalizing), so chaining many
     * multiplications may eventually exceed the maximum scale; use `round` in between to
     * keep it bounded.
     *
     * @throws {RangeError} If the result needs more decimals than the maximum scale.
     *
     * @example
     * new Numeric('2.5').multiply(new Numeric('4')).toString(); // "10"
     */
    multiply(n: Numeric): Numeric {
        const r = multiply(this.#value, n.#value);
        return new Numeric(r);
    }

    /**
     * Divides this value by `n`. A division may never end (`1 / 3 = 0.333…`), so the
     * result is calculated up to `decimals` digits after the decimal point, and the rest
     * is rounded with `mode`. The rounding is exact: it considers the whole remainder,
     * not only the next digit. The result is normalized afterwards.
     *
     * @param n The divisor.
     * @param decimals The maximum amount of digits after the decimal point.
     * @param mode How to round the discarded digits. `RoundMode.HalfUp` by default.
     * @throws {RangeError} If `n` is zero, or if `decimals` is negative, isn't an integer,
     * or exceeds the maximum scale.
     *
     * @example
     * const one = new Numeric('1');
     * one.split(new Numeric('3'), 6).toString();                       // "0.333333"
     * one.split(new Numeric('8'), 2, RoundMode.HalfEven).toString();   // "0.12"
     * one.split(new Numeric('2'), 6).toString();                       // "0.5"
     */
    split(n: Numeric, decimals: number, mode?: RoundMode): Numeric {
        const r = split(this.#value, n.#value, decimals, mode);
        return new Numeric(r);
    }
}
