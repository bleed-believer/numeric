import { describe, it } from 'node:test';

import { normalize } from './normalize.js';

describe('normalize(BaseObject) operator', () => {
    it('1.500 → 1.5', (t: it.TestContext) => {
        const r = normalize({ value: 1500n, scale: 3 });
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 15n);
    });

    it('10.0 → 10 (removes every decimal)', (t: it.TestContext) => {
        const r = normalize({ value: 100n, scale: 1 });
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 10n);
    });

    it('100 → 100 (never touches the integer part)', (t: it.TestContext) => {
        const r = normalize({ value: 100n, scale: 0 });
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 100n);
    });

    it('1.25 → 1.25 (nothing to remove)', (t: it.TestContext) => {
        const r = normalize({ value: 125n, scale: 2 });
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 125n);
    });

    it('1.05 → 1.05 (inner zeros are kept)', (t: it.TestContext) => {
        const r = normalize({ value: 105n, scale: 2 });
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 105n);
    });

    it('0.000 → 0', (t: it.TestContext) => {
        const r = normalize({ value: 0n, scale: 3 });
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('0 at scale Infinity → 0 (does not loop forever)', (t: it.TestContext) => {
        const r = normalize({ value: 0n, scale: Infinity });
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('0 at scale 1e8 → 0 (does not loop through the scale)', (t: it.TestContext) => {
        const r = normalize({ value: 0n, scale: 1e8 });
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('-12.3400 → -12.34', (t: it.TestContext) => {
        const r = normalize({ value: -123400n, scale: 4 });
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, -1234n);
    });

    it('-0.0010 → -0.001', (t: it.TestContext) => {
        const r = normalize({ value: -10n, scale: 4 });
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, -1n);
    });

    it('1 followed by 30 zeros at scale 30 → 1', (t: it.TestContext) => {
        const r = normalize({ value: 10n ** 30n, scale: 30 });
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1n);
    });

    it('does not mutate its target', (t: it.TestContext) => {
        const a = { value: 1500n, scale: 3 };
        normalize(a);
        t.assert.strictEqual(a.scale, 3);
        t.assert.strictEqual(a.value, 1500n);
    });

    it('returns the same object when there is nothing to remove', (t: it.TestContext) => {
        const target = { value: 125n, scale: 2 };
        t.assert.strictEqual(normalize(target), target);
    });

    it('returns the same object for an integer', (t: it.TestContext) => {
        const target = { value: 100n, scale: 0 };
        t.assert.strictEqual(normalize(target), target);
    });

    it('doesn\'t modify the target when removing zeros', (t: it.TestContext) => {
        const target = { value: 1500n, scale: 3 };
        const r = normalize(target);
        t.assert.notStrictEqual(r, target);
        t.assert.deepStrictEqual(target, { value: 1500n, scale: 3 });
    });

    it('-1.500 → -1.5', (t: it.TestContext) => {
        const r = normalize({ value: -1500n, scale: 3 });
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, -15n);
    });

    it('1.0 → 1 (a single zero)', (t: it.TestContext) => {
        const r = normalize({ value: 10n, scale: 1 });
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1n);
    });

    it('returns the same object for an odd value', (t: it.TestContext) => {
        const target = { value: -12345n, scale: 2 };
        t.assert.strictEqual(normalize(target), target);
    });

    it('returns the same object for an even value without trailing zeros', (t: it.TestContext) => {
        const target = { value: -1234n, scale: 2 };
        t.assert.strictEqual(normalize(target), target);
    });

    it('removes zeros from values longer than 64 bits', (t: it.TestContext) => {
        const r = normalize({ value: -(7n * 10n ** 40n), scale: 45 });
        t.assert.strictEqual(r.scale, 5);
        t.assert.strictEqual(r.value, -7n);
    });

    it('returns the same object for odd and even values longer than 64 bits', (t: it.TestContext) => {
        for (const value of [ 10n ** 40n + 1n, -(10n ** 40n + 2n) ]) {
            const target = { value, scale: 45 };
            t.assert.strictEqual(normalize(target), target);
        }
    });
});
