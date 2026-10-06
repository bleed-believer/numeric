import type { BaseObject } from './interfaces/index.js';

/**
 * Removes the trailing zeros of the decimal part, reducing the scale as much as possible
 * without rounding (the represented number never changes): `1.500 → 1.5`, `10.0 → 10`.
 */
export function normalize(target: BaseObject): BaseObject {
    // Zero is divisible by 10 forever, so the loop below would only stop when the scale
    // reaches 0 (or never, with a non-integer or infinite scale).
    if (target.value === 0n) {
        return { value: 0n, scale: 0 };
    }

    let value = target.value;
    let scale = target.scale;
    while (scale > 0 && value % 10n === 0n) {
        value /= 10n;
        scale--;
    }

    return { value, scale };
}
