import type { BaseObject } from './interfaces/index.js';

import { add } from './add.js';

export function subtract(
    a: BaseObject,
    b: BaseObject
): BaseObject {
    return add(a, {
        value: b.value * -1n,
        scale: b.scale
    });
}