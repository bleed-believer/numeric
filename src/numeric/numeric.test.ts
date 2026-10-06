import { describe, it } from 'node:test';
import { RoundMode } from '../rescale/index.js';
import { Numeric } from './numeric.js';

describe('Numeric', () => {
    describe('Numeric.toFixed()', () => {
        it(`'5' → 2 decimals → '5.00'`, (t: it.TestContext) => {
            const n = new Numeric('5');
            t.assert.strictEqual(n.toFixed(2), '5.00');
        });

        it(`'5' → 0 decimals → '5'`, (t: it.TestContext) => {
            const n = new Numeric('5');
            t.assert.strictEqual(n.toFixed(0), '5');
        });

        it(`'1.5' → 3 decimals → '1.500'`, (t: it.TestContext) => {
            const n = new Numeric('1.5');
            t.assert.strictEqual(n.toFixed(3), '1.500');
        });

        it(`'1.005' → 2 decimals → '1.01'`, (t: it.TestContext) => {
            const n = new Numeric('1.005');
            t.assert.strictEqual(n.toFixed(2), '1.01');
        });

        it(`'1.005' → 2 decimals, Down → '1.00'`, (t: it.TestContext) => {
            const n = new Numeric('1.005');
            t.assert.strictEqual(n.toFixed(2, RoundMode.Down), '1.00');
        });

        it(`'2.5' → 0 decimals → '3'`, (t: it.TestContext) => {
            const n = new Numeric('2.5');
            t.assert.strictEqual(n.toFixed(0), '3');
        });

        it(`'2.5' → 0 decimals, HalfEven → '2'`, (t: it.TestContext) => {
            const n = new Numeric('2.5');
            t.assert.strictEqual(n.toFixed(0, RoundMode.HalfEven), '2');
        });

        it(`'-2.5' → 0 decimals → '-3'`, (t: it.TestContext) => {
            const n = new Numeric('-2.5');
            t.assert.strictEqual(n.toFixed(0), '-3');
        });

        it(`'-1.25' → 1 decimal, Ceiling → '-1.2'`, (t: it.TestContext) => {
            const n = new Numeric('-1.25');
            t.assert.strictEqual(n.toFixed(1, RoundMode.Ceiling), '-1.2');
        });

        it(`'0.004' → 2 decimals → '0.00'`, (t: it.TestContext) => {
            const n = new Numeric('0.004');
            t.assert.strictEqual(n.toFixed(2), '0.00');
        });

        it(`'-0.004' → 2 decimals → '0.00'`, (t: it.TestContext) => {
            const n = new Numeric('-0.004');
            t.assert.strictEqual(n.toFixed(2), '0.00');
        });

        it(`'0.999' → 2 decimals → '1.00'`, (t: it.TestContext) => {
            const n = new Numeric('0.999');
            t.assert.strictEqual(n.toFixed(2), '1.00');
        });

        it(`'123.456' → 2 decimals → '123.46'`, (t: it.TestContext) => {
            const n = new Numeric('123.456');
            t.assert.strictEqual(n.toFixed(2), '123.46');
        });

        it(`does not change the original value`, (t: it.TestContext) => {
            const n = new Numeric('1.5');
            n.toFixed(4);
            t.assert.strictEqual(n.toString(), '1.5');
        });

        it(`negative decimals → RangeError`, (t: it.TestContext) => {
            const n = new Numeric('1.5');
            t.assert.throws(() => n.toFixed(-1), RangeError);
        });

        it(`decimals beyond the maximum scale → RangeError`, (t: it.TestContext) => {
            const n = new Numeric('1.5');
            t.assert.throws(() => n.toFixed(16384), RangeError);
        });
    });

    describe('new Numeric(BaseObject)', () => {
        it(`{ 0n, scale 1e8 } → '0' without looping`, (t: it.TestContext) => {
            const n = new Numeric({ value: 0n, scale: 1e8 });
            t.assert.strictEqual(n.toString(), '0');
        });

        it(`{ 0n, scale -1 } → RangeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric({ value: 0n, scale: -1 }), RangeError);
        });

        it(`{ 0n, scale 1.5 } → RangeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric({ value: 0n, scale: 1.5 }), RangeError);
        });

        it(`{ 0n, scale Infinity } → RangeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric({ value: 0n, scale: Infinity }), RangeError);
        });

        it(`{ 0n, scale NaN } → RangeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric({ value: 0n, scale: NaN }), RangeError);
        });

        it(`{ 1n, scale 16384 } → RangeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric({ value: 1n, scale: 16384 }), RangeError);
        });

        it(`a scale beyond the maximum is accepted if normalizing brings it back`, (t: it.TestContext) => {
            const n = new Numeric({ value: 10n ** 2000n, scale: 18000 });
            t.assert.strictEqual(n.toFixed(16000), `0.${'0'.repeat(15999)}1`);
        });
    });
});
