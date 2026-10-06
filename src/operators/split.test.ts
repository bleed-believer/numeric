import { describe, it } from 'node:test';

import { RoundMode } from '../rescale/index.js';
import { multiply } from './multiply.js';
import { split } from './split.js';

describe('split(BaseObject, BaseObject, number, RoundMode) operator', () => {
    it('5 / 2 at scale 1 → 2.5', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 2n, scale: 0 };
        const r = split(a, b, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 25n);
    });

    it('5 / 2 at scale 3 → 2.500', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 2n, scale: 0 };
        const r = split(a, b, 3);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 2500n);
    });

    it('5 / 2 at scale 0 → 3 (HalfUp by default)', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 2n, scale: 0 };
        const r = split(a, b, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 3n);
    });

    it('5 / 2 at scale 0, HalfEven → 2', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 2n, scale: 0 };
        const r = split(a, b, 0, RoundMode.HalfEven);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 2n);
    });

    it('5 / 2 at scale 0, Down → 2', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 2n, scale: 0 };
        const r = split(a, b, 0, RoundMode.Down);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 2n);
    });

    it('1 / 3 at scale 6 → 0.333333', (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const b = { value: 3n, scale: 0 };
        const r = split(a, b, 6);
        t.assert.strictEqual(r.scale, 6);
        t.assert.strictEqual(r.value, 333333n);
    });

    it('2 / 3 at scale 6 → 0.666667', (t: it.TestContext) => {
        const a = { value: 2n, scale: 0 };
        const b = { value: 3n, scale: 0 };
        const r = split(a, b, 6);
        t.assert.strictEqual(r.scale, 6);
        t.assert.strictEqual(r.value, 666667n);
    });

    it('2 / 3 at scale 6, Down → 0.666666', (t: it.TestContext) => {
        const a = { value: 2n, scale: 0 };
        const b = { value: 3n, scale: 0 };
        const r = split(a, b, 6, RoundMode.Down);
        t.assert.strictEqual(r.scale, 6);
        t.assert.strictEqual(r.value, 666666n);
    });

    it('-2 / 3 at scale 6 → -0.666667', (t: it.TestContext) => {
        const a = { value: -2n, scale: 0 };
        const b = { value: 3n, scale: 0 };
        const r = split(a, b, 6);
        t.assert.strictEqual(r.scale, 6);
        t.assert.strictEqual(r.value, -666667n);
    });

    it('2 / -3 at scale 6 → -0.666667', (t: it.TestContext) => {
        const a = { value: 2n, scale: 0 };
        const b = { value: -3n, scale: 0 };
        const r = split(a, b, 6);
        t.assert.strictEqual(r.scale, 6);
        t.assert.strictEqual(r.value, -666667n);
    });

    it('-2 / -3 at scale 6 → 0.666667', (t: it.TestContext) => {
        const a = { value: -2n, scale: 0 };
        const b = { value: -3n, scale: 0 };
        const r = split(a, b, 6);
        t.assert.strictEqual(r.scale, 6);
        t.assert.strictEqual(r.value, 666667n);
    });

    it('-1 / 3 at scale 0, Ceiling → 0', (t: it.TestContext) => {
        const a = { value: -1n, scale: 0 };
        const b = { value: 3n, scale: 0 };
        const r = split(a, b, 0, RoundMode.Ceiling);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('-1 / 3 at scale 0, Floor → -1', (t: it.TestContext) => {
        const a = { value: -1n, scale: 0 };
        const b = { value: 3n, scale: 0 };
        const r = split(a, b, 0, RoundMode.Floor);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, -1n);
    });

    it('1 / 3 at scale 0, Up → 1', (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const b = { value: 3n, scale: 0 };
        const r = split(a, b, 0, RoundMode.Up);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1n);
    });

    it('1 / 8 at scale 3 → 0.125', (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const b = { value: 8n, scale: 0 };
        const r = split(a, b, 3);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 125n);
    });

    it('1 / 8 at scale 2 → 0.13', (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const b = { value: 8n, scale: 0 };
        const r = split(a, b, 2);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 13n);
    });

    it('1 / 8 at scale 2, HalfEven → 0.12', (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const b = { value: 8n, scale: 0 };
        const r = split(a, b, 2, RoundMode.HalfEven);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 12n);
    });

    it('7 / 7 at scale 0 → 1', (t: it.TestContext) => {
        const a = { value: 7n, scale: 0 };
        const b = { value: 7n, scale: 0 };
        const r = split(a, b, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1n);
    });

    it('0 / 5 at scale 2 → 0.00', (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: 5n, scale: 0 };
        const r = split(a, b, 2);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 0n);
    });

    it('10 / 0.5 at scale 0 → 20', (t: it.TestContext) => {
        const a = { value: 10n, scale: 0 };
        const b = { value: 5n, scale: 1 };
        const r = split(a, b, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 20n);
    });

    it('1.5 / 0.25 at scale 2 → 6.00', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        const r = split(a, b, 2);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 600n);
    });

    it('0.001 / 2 at scale 4 → 0.0005', (t: it.TestContext) => {
        const a = { value: 1n, scale: 3 };
        const b = { value: 2n, scale: 0 };
        const r = split(a, b, 4);
        t.assert.strictEqual(r.scale, 4);
        t.assert.strictEqual(r.value, 5n);
    });

    it('0.001 / 2 at scale 3 → 0.001 (0.0005 rounds up)', (t: it.TestContext) => {
        const a = { value: 1n, scale: 3 };
        const b = { value: 2n, scale: 0 };
        const r = split(a, b, 3);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 1n);
    });

    it('0.001 / 2 at scale 0 → 0 (negative exponent)', (t: it.TestContext) => {
        const a = { value: 1n, scale: 3 };
        const b = { value: 2n, scale: 0 };
        const r = split(a, b, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('1000 / 0.001 at scale 0 → 1000000', (t: it.TestContext) => {
        const a = { value: 1000n, scale: 0 };
        const b = { value: 1n, scale: 3 };
        const r = split(a, b, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1000000n);
    });

    it('10^30 / 3 at scale 0 → 333…3 (30 digits)', (t: it.TestContext) => {
        const a = { value: 10n ** 30n, scale: 0 };
        const b = { value: 3n, scale: 0 };
        const r = split(a, b, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, BigInt('3'.repeat(30)));
    });

    it('(a / b) * b === a when the division is exact', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        const r = multiply(split(a, b, 2), b);
        t.assert.strictEqual(r.scale, 4);
        t.assert.strictEqual(r.value, 15000n);
    });

    it('division by zero → RangeError', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 0n, scale: 2 };
        t.assert.throws(() => split(a, b, 2), RangeError);
    });

    it('1 / 3 at scale 16383 works', (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const b = { value: 3n, scale: 0 };
        const r = split(a, b, 16383);
        t.assert.strictEqual(r.scale, 16383);
        t.assert.strictEqual(r.value, BigInt('3'.repeat(16383)));
    });

    it('does not mutate its operands', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 25n, scale: 2 };
        split(a, b, 4);
        t.assert.strictEqual(a.scale, 1);
        t.assert.strictEqual(a.value, 15n);
        t.assert.strictEqual(b.scale, 2);
        t.assert.strictEqual(b.value, 25n);
    });

    it('7 / -2 at scale 0, Ceiling → -3', (t: it.TestContext) => {
        const r = split({ value: 7n, scale: 0 }, { value: -2n, scale: 0 }, 0, RoundMode.Ceiling);
        t.assert.strictEqual(r.value, -3n);
    });

    it('-7 / -2 at scale 0 → 4', (t: it.TestContext) => {
        const r = split({ value: -7n, scale: 0 }, { value: -2n, scale: 0 }, 0);
        t.assert.strictEqual(r.value, 4n);
    });

    it('2.501 / 1 at scale 0, HalfEven → 3 (uses the whole remainder)', (t: it.TestContext) => {
        const r = split({ value: 2501n, scale: 3 }, { value: 1n, scale: 0 }, 0, RoundMode.HalfEven);
        t.assert.strictEqual(r.value, 3n);
    });

    it('exact divisions ignore the mode: 6 / 3 → 2', (t: it.TestContext) => {
        for (const mode of Object.values(RoundMode)) {
            const r = split({ value: -6n, scale: 0 }, { value: 3n, scale: 0 }, 0, mode);
            t.assert.strictEqual(r.value, -2n);
        }
    });

    it('unknown mode → TypeError', (t: it.TestContext) => {
        const a = { value: 7n, scale: 0 };
        const b = { value: 2n, scale: 0 };
        t.assert.throws(() => split(a, b, 0, 'banana' as RoundMode), TypeError);
    });
});
