import { describe, it } from 'node:test';

import { abs } from './abs.js';

describe('abs(BaseObject) operator', () => {
    it(`-1.5 → 1.5`, (t: it.TestContext) => {
        const r = abs({ value: -15n, scale: 1 });
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 15n);
    });

    it(`1.5 → 1.5 (the same object)`, (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        t.assert.strictEqual(abs(a), a);
    });

    it(`0 → 0`, (t: it.TestContext) => {
        const r = abs({ value: 0n, scale: 0 });
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it(`does not mutate its operand`, (t: it.TestContext) => {
        const a = { value: -15n, scale: 1 };
        abs(a);
        t.assert.deepStrictEqual(a, { value: -15n, scale: 1 });
    });
});
