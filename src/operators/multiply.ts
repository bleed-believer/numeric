import type { BaseObject } from './interfaces/index.js';

export function multiply(a: BaseObject, b: BaseObject): BaseObject {
    return {
        value: a.value * b.value,
        scale: a.scale + b.scale
    };
}
