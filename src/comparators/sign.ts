import type { BaseObject } from './interfaces/index.js';

/**
 * Returns `-1` if `a` is negative, `1` if it's positive, or `0` if it's zero. The scale
 * never changes the sign, so only the value is checked.
 */
export function sign(a: BaseObject): -1 | 0 | 1 {
    if (a.value > 0n) {
        return 1;
    } else if (a.value < 0n) {
        return -1;
    } else {
        return 0;
    }
}
