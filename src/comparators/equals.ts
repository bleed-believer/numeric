import type { BaseObject } from './interfaces/index.js';

/**
 * Checks if `a` and `b` represent the same number. Both operands MUST be normalized (no
 * trailing zeros in the decimal part, and zero at scale 0), which makes the representation
 * of every number unique: there is nothing to align, so both fields are compared as is.
 */
export function equals(a: BaseObject, b: BaseObject): boolean {
    return a.value === b.value && a.scale === b.scale;
}
