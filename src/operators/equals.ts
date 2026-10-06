import type { BaseObject } from './interfaces/index.js';
import { rescale } from '../rescale/index.js';

export function equals(a: BaseObject, b: BaseObject): boolean {
    const scale = a.scale >= b.scale
    ?   a.scale
    :   b.scale;

    const aa = rescale(a, scale);
    const bb = rescale(b, scale);
    return aa.value === bb.value;
}