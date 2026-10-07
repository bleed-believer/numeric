import type { BaseObject } from './interfaces/index.js';

import { pow10 } from '../pow10/index.js';

export function add(a: BaseObject, b: BaseObject): BaseObject {
    // Only the operand with the smaller scale needs to be shifted up to the other one.
    if (a.scale === b.scale) {
        return { value: a.value + b.value, scale: a.scale };
    } else if (a.scale > b.scale) {
        return { value: a.value + b.value * pow10(a.scale - b.scale), scale: a.scale };
    } else {
        return { value: a.value * pow10(b.scale - a.scale) + b.value, scale: b.scale };
    }
}
