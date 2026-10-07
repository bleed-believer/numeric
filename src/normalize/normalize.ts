import type { BaseObject } from './interfaces/index.js';

/**
 * Removes the trailing zeros of the decimal part, reducing the scale as much as possible
 * without rounding (the represented number never changes): `1.500 → 1.5`, `10.0 → 10`.
 * When there is nothing to remove, `target` itself is returned.
 */
export function normalize(target: BaseObject): BaseObject {
    // Zero is divisible by 10 forever, so the loop below would only stop when the scale
    // reaches 0 (or never, with a non-integer or infinite scale).
    if (target.value === 0n) {
        return { value: 0n, scale: 0 };
    }

    // Most values have no trailing zeros, so they are returned as is, without allocating.
    if (target.scale === 0 || target.value % 10n !== 0n) {
        return target;
    }

    let value = target.value / 10n;
    let scale = target.scale - 1;
    while (scale > 0 && value % 10n === 0n) {
        value /= 10n;
        scale--;
    }

    return { value, scale };
}
