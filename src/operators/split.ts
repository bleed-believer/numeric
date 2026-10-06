import type { BaseObject } from './interfaces/index.js';

import { RoundMode, rescale } from '../rescale/index.js';

/**
 * Divides `a` by `b`. A division may never end (`1 / 3 = 0.333…`), so the scale of the
 * result must be given explicitly, and the digits beyond it are rounded with `mode`
 * (`RoundMode.HalfUp` by default).
 */
export function split(
    a: BaseObject,
    b: BaseObject,
    scale: number,
    mode?: RoundMode
): BaseObject {
    if (b.value === 0n) {
        throw new RangeError('Division by zero');
    }

    // Every Base is an integer shifted by a power of ten:
    //     a = a.value / 10^a.scale
    //     b = b.value / 10^b.scale
    //
    // The result must be another Base `r` with the requested scale, which means finding
    // the integer `r.value` such that:
    //     r.value / 10^scale ≈ a / b
    //
    // Solving for `r.value`:
    //     r.value ≈ (a / b) * 10^scale
    //             = (a.value / 10^a.scale) / (b.value / 10^b.scale) * 10^scale
    //             = a.value * 10^(scale + b.scale - a.scale) / b.value
    //
    // e.g. 5 / 2 at scale 1 → 5 * 10^(1 + 0 - 0) / 2 = 50 / 2 = 25 → 2.5
    //
    // This function only divides: rounding is `rescale`'s job. So instead of stopping at
    // `scale`, the division goes one digit further (the "guard" digit), and `rescale`
    // cuts it afterwards.
    const extended = scale + 1;
    const exponent = extended + b.scale - a.scale;

    // `bigint` has no negative powers, so when the exponent is negative (e.g. 0.001 / 2
    // at scale 0 → exponent -2), the power of ten multiplies the divisor instead:
    //     a.value * 10^-2 / b.value  ===  a.value / (b.value * 10^2)
    const dividend = exponent >= 0 ? a.value * 10n ** BigInt(exponent) : a.value;
    const divisor  = exponent >= 0 ? b.value : b.value * 10n ** BigInt(-exponent);

    // Both sides are integers now, so the native division gives the quotient truncated
    // towards zero, with the guard digit as its last digit.
    const quotient = dividend / divisor;
    const remainder = dividend % divisor;

    // The guard digit alone isn't enough to round: `0.25` and `0.2500001` share the
    // same guard digit (5), but only the first one is a tie. So one more "sticky" digit
    // is appended, which is 1 when the division isn't exact (there is something beyond
    // the guard digit) and 0 otherwise. With both digits, `rescale` sees exactly where
    // the real value is: below the half (e.g. 41), a tie (50), above the half (51), or
    // not exact at all (e.g. 01). The sticky digit takes the sign of the result, so it
    // pushes the value away from zero like the discarded digits would.
    const negative = (dividend < 0n) !== (divisor < 0n);
    const sticky = remainder === 0n
    ?   0n
    :   negative ? -1n : 1n;

    return rescale(
        { value: quotient * 10n + sticky, scale: extended + 1 },
        scale,
        mode
    );
}
