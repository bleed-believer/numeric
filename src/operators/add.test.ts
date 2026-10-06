import { describe, it } from 'node:test';

import { add } from './add.js';

describe('add(BaseObject, BaseObject) operator', () => {
    it(`5 + 6 → 11`, (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 6n, scale: 0 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 11n);
    });
    
    it(`0.6 + 0.3 → 0.9`, (t: it.TestContext) => {
        const a = { value: 6n, scale: 1 };
        const b = { value: 3n, scale: 1 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 9n);
    });
    
    it(`0.05 + 0.06 → 0.11`, (t: it.TestContext) => {
        const a = { value: 5n, scale: 2 };
        const b = { value: 6n, scale: 2 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 11n);
    });

    it(`0 + 0 → 0`, (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: 0n, scale: 0 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it(`1.5 + 0.25 → 1.75`, (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 175n);
    });

    it(`0.25 + 1.5 → 1.75`, (t: it.TestContext) => {
        const a = { value: 25n, scale: 2 };
        const b = { value: 15n, scale: 1 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 175n);
    });

    it(`3 + 0.001 → 3.001`, (t: it.TestContext) => {
        const a = { value: 3n, scale: 0 };
        const b = { value: 1n, scale: 3 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 3001n);
    });

    it(`0.99 + 0.01 → 1.00`, (t: it.TestContext) => {
        const a = { value: 99n, scale: 2 };
        const b = { value: 1n, scale: 2 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 100n);
    });

    it(`-5 + -6 → -11`, (t: it.TestContext) => {
        const a = { value: -5n, scale: 0 };
        const b = { value: -6n, scale: 0 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, -11n);
    });

    it(`-1.5 + 0.25 → -1.25`, (t: it.TestContext) => {
        const a = { value: -15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, -125n);
    });

    it(`0.05 + -0.06 → -0.01`, (t: it.TestContext) => {
        const a = { value: 5n, scale: 2 };
        const b = { value: -6n, scale: 2 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, -1n);
    });

    it(`1.25 + -1.25 → 0.00`, (t: it.TestContext) => {
        const a = { value: 125n, scale: 2 };
        const b = { value: -125n, scale: 2 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 0n);
    });

    it(`9007199254740993 + 9007199254740993 → 18014398509481986`, (t: it.TestContext) => {
        const a = { value: 9007199254740993n, scale: 0 };
        const b = { value: 9007199254740993n, scale: 0 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 18014398509481986n);
    });

    it(`1 + 0.000000000000000000001 (scale 21) → 1.000000000000000000001`, (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const b = { value: 1n, scale: 21 };
        const r = add(a, b);
        t.assert.strictEqual(r.scale, 21);
        t.assert.strictEqual(r.value, 10n ** 21n + 1n);
    });

    it(`does not mutate its operands`, (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        add(a, b);
        t.assert.strictEqual(a.scale, 1);
        t.assert.strictEqual(a.value, 15n);
        t.assert.strictEqual(b.scale, 2);
        t.assert.strictEqual(b.value, 25n);
    });
});
