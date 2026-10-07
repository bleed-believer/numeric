import { describe, it } from 'node:test';

import { compare } from './compare.js';

describe('compare(BaseObject, BaseObject) comparator', () => {
    it('5 vs 5 → 0', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 5n, scale: 0 };
        t.assert.strictEqual(compare(a, b), 0);
    });

    it('5 vs 6 → -1', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 6n, scale: 0 };
        t.assert.strictEqual(compare(a, b), -1);
    });

    it('6 vs 5 → 1', (t: it.TestContext) => {
        const a = { value: 6n, scale: 0 };
        const b = { value: 5n, scale: 0 };
        t.assert.strictEqual(compare(a, b), 1);
    });

    it('1.5 vs 1.50 → 0 (different scales)', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 150n, scale: 2 };
        t.assert.strictEqual(compare(a, b), 0);
        t.assert.strictEqual(compare(b, a), 0);
    });

    it('1.5 vs 1.51 → -1', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 151n, scale: 2 };
        t.assert.strictEqual(compare(a, b), -1);
        t.assert.strictEqual(compare(b, a), 1);
    });

    it('1.5 vs 15 → -1 (same value, different scale)', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 15n, scale: 0 };
        t.assert.strictEqual(compare(a, b), -1);
        t.assert.strictEqual(compare(b, a), 1);
    });

    it('0.9 vs 0.12 → 1 (more digits isn\'t bigger)', (t: it.TestContext) => {
        const a = { value: 9n, scale: 1 };
        const b = { value: 12n, scale: 2 };
        t.assert.strictEqual(compare(a, b), 1);
        t.assert.strictEqual(compare(b, a), -1);
    });

    it('-1.5 vs 1.5 → -1', (t: it.TestContext) => {
        const a = { value: -15n, scale: 1 };
        const b = { value: 15n, scale: 1 };
        t.assert.strictEqual(compare(a, b), -1);
        t.assert.strictEqual(compare(b, a), 1);
    });

    it('-1.5 vs -1.25 → -1', (t: it.TestContext) => {
        const a = { value: -15n, scale: 1 };
        const b = { value: -125n, scale: 2 };
        t.assert.strictEqual(compare(a, b), -1);
        t.assert.strictEqual(compare(b, a), 1);
    });

    it('0 vs 0.000 → 0', (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: 0n, scale: 3 };
        t.assert.strictEqual(compare(a, b), 0);
    });

    it('0 vs 0.001 → -1', (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: 1n, scale: 3 };
        t.assert.strictEqual(compare(a, b), -1);
        t.assert.strictEqual(compare(b, a), 1);
    });

    it('0 vs -0.001 → 1', (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: -1n, scale: 3 };
        t.assert.strictEqual(compare(a, b), 1);
        t.assert.strictEqual(compare(b, a), -1);
    });

    it('9007199254740993.1 vs 9007199254740993.10001 → -1', (t: it.TestContext) => {
        const a = { value: 90071992547409931n, scale: 1 };
        const b = { value: 900719925474099310001n, scale: 5 };
        t.assert.strictEqual(compare(a, b), -1);
        t.assert.strictEqual(compare(b, a), 1);
    });

    it('does not mutate its operands', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 151n, scale: 2 };
        compare(a, b);
        t.assert.deepStrictEqual(a, { value: 15n, scale: 1 });
        t.assert.deepStrictEqual(b, { value: 151n, scale: 2 });
    });
});
