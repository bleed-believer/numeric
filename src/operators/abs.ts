import type { BaseObject } from './interfaces/index.js';

/**
 * Returns the absolute value of `a`. When `a` isn't negative, `a` itself is returned,
 * without allocating.
 */
export function abs(a: BaseObject): BaseObject {
    if (a.value < 0n) {
        return { value: -a.value, scale: a.scale };
    }

    return a;
}
