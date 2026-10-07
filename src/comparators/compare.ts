import type { BaseObject } from './interfaces/index.js';

import { pow10 } from '../pow10/index.js';
import { sign } from './sign.js';

/**
 * Returns `-1` if `a < b`, `0` if `a === b`, or `1` if `a > b`. Works with any scale,
 * normalized or not.
 */
export function compare(a: BaseObject, b: BaseObject): -1 | 0 | 1 {
    // Different signs (or a zero against a non-zero) decide without touching the scales,
    // which avoids building a power of ten and multiplying long values.
    const sa = sign(a);
    const sb = sign(b);
    if (sa !== sb) {
        return sa > sb ? 1 : -1;
    } else if (sa === 0) {
        return 0;
    }

    // Only the operand with the smaller scale needs to be shifted up to the other one.
    let av = a.value;
    let bv = b.value;
    if (a.scale > b.scale) {
        bv *= pow10(a.scale - b.scale);
    } else if (a.scale < b.scale) {
        av *= pow10(b.scale - a.scale);
    }

    if (av === bv) {
        return 0;
    }

    return av > bv ? 1 : -1;
}
