import type { BaseObject } from './interfaces/index.js';

/**
 * Returns `a` with its sign flipped. The digits don't change, so a normalized operand gives
 * a normalized result (`-0n` is `0n` for a `bigint`).
 */
export function negate(a: BaseObject): BaseObject {
    return { value: -a.value, scale: a.scale };
}
