import { describe, it } from 'node:test';

import { multiply } from './multiply.js';

describe('multiply(BaseObject, BaseObject) operator', () => {
    it('2.2 * 2.2 → 4.84', (t: it.TestContext) => {
        const a = { value: 22n, scale: 1 };
        const b = { value: 22n, scale: 1 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 484n);
    });

    it('2.2 * 2.22 → 4.884', (t: it.TestContext) => {
        const a = { value: 22n, scale: 1 };
        const b = { value: 222n, scale: 2 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 4884n);
    });

    it('5 * 6 → 30', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 6n, scale: 0 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 30n);
    });

    it('0 * 0 → 0', (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: 0n, scale: 0 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('7 * 0 → 0', (t: it.TestContext) => {
        const a = { value: 7n, scale: 0 };
        const b = { value: 0n, scale: 0 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('1.25 * 0.00 → 0.0000', (t: it.TestContext) => {
        const a = { value: 125n, scale: 2 };
        const b = { value: 0n, scale: 2 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 4);
        t.assert.strictEqual(r.value, 0n);
    });

    it('1 * 3.14 → 3.14', (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const b = { value: 314n, scale: 2 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 314n);
    });

    it('1.0 * 3.14 → 3.140', (t: it.TestContext) => {
        const a = { value: 10n, scale: 1 };
        const b = { value: 314n, scale: 2 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 3140n);
    });

    it('0.5 * 0.5 → 0.25', (t: it.TestContext) => {
        const a = { value: 5n, scale: 1 };
        const b = { value: 5n, scale: 1 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 25n);
    });

    it('0.1 * 0.1 → 0.01', (t: it.TestContext) => {
        const a = { value: 1n, scale: 1 };
        const b = { value: 1n, scale: 1 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 1n);
    });

    it('0.001 * 0.001 → 0.000001', (t: it.TestContext) => {
        const a = { value: 1n, scale: 3 };
        const b = { value: 1n, scale: 3 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 6);
        t.assert.strictEqual(r.value, 1n);
    });

    it('10 * 0.1 → 1.0', (t: it.TestContext) => {
        const a = { value: 10n, scale: 0 };
        const b = { value: 1n, scale: 1 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 10n);
    });

    it('3 * 0.333 → 0.999', (t: it.TestContext) => {
        const a = { value: 3n, scale: 0 };
        const b = { value: 333n, scale: 3 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 999n);
    });

    it('-2.5 * 4 → -10.0', (t: it.TestContext) => {
        const a = { value: -25n, scale: 1 };
        const b = { value: 4n, scale: 0 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, -100n);
    });

    it('2.5 * -4 → -10.0', (t: it.TestContext) => {
        const a = { value: 25n, scale: 1 };
        const b = { value: -4n, scale: 0 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, -100n);
    });

    it('-2.5 * -4 → 10.0', (t: it.TestContext) => {
        const a = { value: -25n, scale: 1 };
        const b = { value: -4n, scale: 0 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 100n);
    });

    it('-0.5 * 0 → 0.0', (t: it.TestContext) => {
        const a = { value: -5n, scale: 1 };
        const b = { value: 0n, scale: 0 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 0n);
    });

    it('9007199254740993 * 9007199254740993 → 81129638414606699710187514626049', (t: it.TestContext) => {
        const a = { value: 9007199254740993n, scale: 0 };
        const b = { value: 9007199254740993n, scale: 0 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 81129638414606699710187514626049n);
    });

    it('1e-21 * 1e-21 → 1e-42 (scale 42)', (t: it.TestContext) => {
        const a = { value: 1n, scale: 21 };
        const b = { value: 1n, scale: 21 };
        const r = multiply(a, b);
        t.assert.strictEqual(r.scale, 42);
        t.assert.strictEqual(r.value, 1n);
    });

    it('a * b === b * a', (t: it.TestContext) => {
        const a = { value: -15n, scale: 1 };
        const b = { value: 25n, scale: 3 };
        const ab = multiply(a, b);
        const ba = multiply(b, a);
        t.assert.strictEqual(ab.scale, ba.scale);
        t.assert.strictEqual(ab.value, ba.value);
    });

    it('(a * b) * c === a * (b * c)', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: -25n, scale: 2 };
        const c = { value: 333n, scale: 3 };
        const l = multiply(multiply(a, b), c);
        const r = multiply(a, multiply(b, c));
        t.assert.strictEqual(l.scale, r.scale);
        t.assert.strictEqual(l.value, r.value);
    });

    it('does not mutate its operands', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        multiply(a, b);
        t.assert.strictEqual(a.scale, 1);
        t.assert.strictEqual(a.value, 15n);
        t.assert.strictEqual(b.scale, 2);
        t.assert.strictEqual(b.value, 25n);
    });
});
