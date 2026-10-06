import type { BaseObject } from './interfaces/index.js';

import { rescale } from '../rescale/index.js';

export function add(a: BaseObject, b: BaseObject): BaseObject {
    const scale = a.scale >= b.scale
    ?   a.scale
    :   b.scale;

    const aa = rescale(a, scale);
    const bb = rescale(b, scale);
    return {
        value: aa.value + bb.value,
        scale
    };
}