import { describe, it } from 'node:test';

import { RoundMode } from './round-mode.js';
import { rescale } from './rescale.js';

describe('rescale(BaseObject, number) operator', () => {
    it('1.2 to scale 3 → 1.200', (t: it.TestContext) => {
        const a = { value: 12n, scale: 1 };
        const r = rescale(a, 3);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 1200n);
    });

    it('1.200 to scale 1 → 1.2', (t: it.TestContext) => {
        const a = { value: 1200n, scale: 3 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 12n);
    });

    it('1.222 to scale 1 → 1.2', (t: it.TestContext) => {
        const a = { value: 1222n, scale: 3 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 12n);
    });

    it('1.666 to scale 1 → 1.7', (t: it.TestContext) => {
        const a = { value: 1666n, scale: 3 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 17n);
    });

    it('1.222 to scale 0 → 1', (t: it.TestContext) => {
        const a = { value: 1222n, scale: 3 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1n);
    });

    it('1.666 to scale 0 → 2', (t: it.TestContext) => {
        const a = { value: 1666n, scale: 3 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 2n);
    });

    it('1.2 to scale 1 → 1.2 (same scale)', (t: it.TestContext) => {
        const a = { value: 12n, scale: 1 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 12n);
    });

    it('5 to scale 2 → 5.00', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const r = rescale(a, 2);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 500n);
    });

    it('0 to scale 3 → 0.000', (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const r = rescale(a, 3);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, 0n);
    });

    it('0.000 to scale 0 → 0', (t: it.TestContext) => {
        const a = { value: 0n, scale: 3 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('-1.2 to scale 3 → -1.200', (t: it.TestContext) => {
        const a = { value: -12n, scale: 1 };
        const r = rescale(a, 3);
        t.assert.strictEqual(r.scale, 3);
        t.assert.strictEqual(r.value, -1200n);
    });

    it('1.25 to scale 1 → 1.3 (exact half rounds up)', (t: it.TestContext) => {
        const a = { value: 125n, scale: 2 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 13n);
    });

    it('1.249 to scale 1 → 1.2', (t: it.TestContext) => {
        const a = { value: 1249n, scale: 3 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 12n);
    });

    it('1.449 to scale 0 → 1 (no double rounding)', (t: it.TestContext) => {
        const a = { value: 1449n, scale: 3 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1n);
    });

    it('0.5 to scale 0 → 1', (t: it.TestContext) => {
        const a = { value: 5n, scale: 1 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 1n);
    });

    it('0.4 to scale 0 → 0', (t: it.TestContext) => {
        const a = { value: 4n, scale: 1 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('0.05 to scale 0 → 0', (t: it.TestContext) => {
        const a = { value: 5n, scale: 2 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('9.99 to scale 1 → 10.0 (carry)', (t: it.TestContext) => {
        const a = { value: 999n, scale: 2 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, 100n);
    });

    it('-1.222 to scale 1 → -1.2', (t: it.TestContext) => {
        const a = { value: -1222n, scale: 3 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, -12n);
    });

    it('-1.666 to scale 1 → -1.7', (t: it.TestContext) => {
        const a = { value: -1666n, scale: 3 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, -17n);
    });

    it('-1.25 to scale 1 → -1.3 (half away from zero)', (t: it.TestContext) => {
        const a = { value: -125n, scale: 2 };
        const r = rescale(a, 1);
        t.assert.strictEqual(r.scale, 1);
        t.assert.strictEqual(r.value, -13n);
    });

    it('-0.5 to scale 0 → -1', (t: it.TestContext) => {
        const a = { value: -5n, scale: 1 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, -1n);
    });

    it('-0.4 to scale 0 → 0', (t: it.TestContext) => {
        const a = { value: -4n, scale: 1 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 0n);
    });

    it('9007199254740993.5 to scale 0 → 9007199254740994', (t: it.TestContext) => {
        const a = { value: 90071992547409935n, scale: 1 };
        const r = rescale(a, 0);
        t.assert.strictEqual(r.scale, 0);
        t.assert.strictEqual(r.value, 9007199254740994n);
    });

    it('does not mutate its target', (t: it.TestContext) => {
        const a = { value: 1666n, scale: 3 };
        rescale(a, 1);
        t.assert.strictEqual(a.scale, 3);
        t.assert.strictEqual(a.value, 1666n);
    });

    it('1 to scale 16383 → 1.000…', (t: it.TestContext) => {
        const a = { value: 1n, scale: 0 };
        const r = rescale(a, 16383);
        t.assert.strictEqual(r.scale, 16383);
        t.assert.strictEqual(r.value, 10n ** 16383n);
    });
});

describe('rescale(BaseObject, number, RoundMode) modes', () => {
    // [input as (value, scale 1), Up, Down, Ceiling, Floor, HalfUp, HalfDown, HalfEven]
    const table: [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint][] = [
        [ 55n,  6n,  5n,  6n,  5n,  6n,  5n,  6n],
        [ 25n,  3n,  2n,  3n,  2n,  3n,  2n,  2n],
        [ 16n,  2n,  1n,  2n,  1n,  2n,  2n,  2n],
        [ 11n,  2n,  1n,  2n,  1n,  1n,  1n,  1n],
        [ 10n,  1n,  1n,  1n,  1n,  1n,  1n,  1n],
        [ 0n,   0n,  0n,  0n,  0n,  0n,  0n,  0n],
        [-10n, -1n, -1n, -1n, -1n, -1n, -1n, -1n],
        [-11n, -2n, -1n, -1n, -2n, -1n, -1n, -1n],
        [-16n, -2n, -1n, -1n, -2n, -2n, -2n, -2n],
        [-25n, -3n, -2n, -2n, -3n, -3n, -2n, -2n],
        [-55n, -6n, -5n, -5n, -6n, -6n, -5n, -6n],
    ];

    const modes = [
        RoundMode.Up,
        RoundMode.Down,
        RoundMode.Ceiling,
        RoundMode.Floor,
        RoundMode.HalfUp,
        RoundMode.HalfDown,
        RoundMode.HalfEven,
    ];

    modes.forEach((mode, i) => {
        describe(`RoundMode.${mode}`, () => {
            for (const row of table) {
                const input = { value: row[0], scale: 1 };
                const expected = row[i + 1];

                // Every input has scale 1, so it reads as "<int>.<last digit>" (e.g. -25n → -2.5).
                const abs = input.value < 0n ? -input.value : input.value;
                const label = `${input.value < 0n ? '-' : ''}${abs / 10n}.${abs % 10n}`;
                it(`${label} to scale 0 → ${expected}`, (t: it.TestContext) => {
                    const r = rescale(input, 0, mode);
                    t.assert.strictEqual(r.scale, 0);
                    t.assert.strictEqual(r.value, expected);
                });
            }
        });
    });

    it('defaults to RoundMode.HalfUp', (t: it.TestContext) => {
        const a = { value: -25n, scale: 1 };
        t.assert.strictEqual(rescale(a, 0).value, rescale(a, 0, RoundMode.HalfUp).value);
    });

    it('HalfEven only looks at the whole discarded part: 2.501 to scale 0 → 3', (t: it.TestContext) => {
        const a = { value: 2501n, scale: 3 };
        const r = rescale(a, 0, RoundMode.HalfEven);
        t.assert.strictEqual(r.value, 3n);
    });

    it('HalfDown only looks at the whole discarded part: 2.5001 to scale 0 → 3', (t: it.TestContext) => {
        const a = { value: 25001n, scale: 4 };
        const r = rescale(a, 0, RoundMode.HalfDown);
        t.assert.strictEqual(r.value, 3n);
    });

    it('Up with a tiny remainder: 1.0001 to scale 2 → 1.01', (t: it.TestContext) => {
        const a = { value: 10001n, scale: 4 };
        const r = rescale(a, 2, RoundMode.Up);
        t.assert.strictEqual(r.scale, 2);
        t.assert.strictEqual(r.value, 101n);
    });

    it('modes do not affect scaling up: -1.5 to scale 3 → -1.500', (t: it.TestContext) => {
        const a = { value: -15n, scale: 1 };
        for (const mode of modes) {
            t.assert.strictEqual(rescale(a, 3, mode).value, -1500n);
        }
    });

    it('unknown mode → TypeError', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        t.assert.throws(() => rescale(a, 0, 'banana' as RoundMode), TypeError);
    });
});
