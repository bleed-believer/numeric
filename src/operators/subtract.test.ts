import { describe, it } from 'node:test';

import { subtract } from './subtract.js';

describe('subtract(BaseObject, BaseObject) operator', () => {
    it(`5 - 6 → -1`, (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 6n, scale: 0 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, -1n);
    });

    it(`6 - 5 → 1`, (t: it.TestContext) => {
        const a = { value: 6n, scale: 0 };
        const b = { value: 5n, scale: 0 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1n);
    });

    it(`0 - 0 → 0`, (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: 0n, scale: 0 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it(`5 - 0 → 5`, (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 0n, scale: 0 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 5n);
    });

    it(`0 - 5 → -5`, (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: 5n, scale: 0 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, -5n);
    });

    it(`0.11 - 0.06 → 0.05`, (t: it.TestContext) => {
        const a = { value: 11n, scale: 2 };
        const b = { value: 6n, scale: 2 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 5n);
    });

    it(`1.75 - 0.25 → 1.50`, (t: it.TestContext) => {
        const a = { value: 175n, scale: 2 };
        const b = { value: 25n, scale: 2 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 150n);
    });

    it(`1.5 - 0.25 → 1.25`, (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 125n);
    });

    it(`0.25 - 1.5 → -1.25`, (t: it.TestContext) => {
        const a = { value: 25n, scale: 2 };
        const b = { value: 15n, scale: 1 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, -125n);
    });

    it(`3 - 0.001 → 2.999`, (t: it.TestContext) => {
        const a = { value: 3n, scale: 0 };
        const b = { value: 1n, scale: 3 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 2999n);
    });

    it(`1.00 - 0.01 → 0.99 (borrow)`, (t: it.TestContext) => {
        const a = { value: 100n, scale: 2 };
        const b = { value: 1n, scale: 2 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 99n);
    });

    it(`1.25 - 1.25 → 0.00`, (t: it.TestContext) => {
        const a = { value: 125n, scale: 2 };
        const b = { value: 125n, scale: 2 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 0n);
    });

    it(`-5 - -6 → 1`, (t: it.TestContext) => {
        const a = { value: -5n, scale: 0 };
        const b = { value: -6n, scale: 0 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1n);
    });

    it(`-5 - 6 → -11`, (t: it.TestContext) => {
        const a = { value: -5n, scale: 0 };
        const b = { value: 6n, scale: 0 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, -11n);
    });

    it(`5 - -6 → 11`, (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: -6n, scale: 0 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 11n);
    });

    it(`-1.5 - 0.25 → -1.75`, (t: it.TestContext) => {
        const a = { value: -15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, -175n);
    });

    it(`0 - -0.001 → 0.001`, (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: -1n, scale: 3 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 1n);
    });

    it(`18014398509481986 - 9007199254740993 → 9007199254740993`, (t: it.TestContext) => {
        const a = { value: 18014398509481986n, scale: 0 };
        const b = { value: 9007199254740993n, scale: 0 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 9007199254740993n);
    });

    it(`1 - 0.000000000000000000001 (scale 21) → 0.999999999999999999999`, (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const b = { value: 1n, scale: 21 };
        const r = subtract(a, b);
        t.assert.strictEqual(r.scale, 21);
        t.assert.strictEqual(r.value, 10n ** 21n - 1n);
    });

    it(`a - b === -(b - a)`, (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: -25n, scale: 2 };
        const ab = subtract(a, b);
        const ba = subtract(b, a);
        t.assert.strictEqual(ab.scale, ba.scale);
        t.assert.strictEqual(ab.value, -ba.value);
    });

    it(`does not mutate its operands`, (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        subtract(a, b);
        t.assert.strictEqual(a.scale, 1);
        t.assert.strictEqual(a.value, 15n);
        t.assert.strictEqual(b.scale, 2);
        t.assert.strictEqual(b.value, 25n);
    });
});
