import { describe, it } from 'node:test';
import { Base } from './base.js';

describe('Base', () => {
    describe('Base.toString()', () => {
        it(`new Base(366n, 2).toString()`, (t: it.TestContext) => {
            const n = new Base(366n, 2);
            const v = n.toString();
            t.assert.strictEqual(v, '3.66');
        });

        it(`new Base(-366n, 2).toString()`, (t: it.TestContext) => {
            const n = new Base(-366n, 2);
            const v = n.toString();
            t.assert.strictEqual(v, '-3.66');
        });

        it(`new Base(6n, 3).toString()`, (t: it.TestContext) => {
            const n = new Base(6n, 3);
            const v = n.toString();
            t.assert.strictEqual(v, '0.006');
        });

        it(`new Base(-6n, 3).toString()`, (t: it.TestContext) => {
            const n = new Base(-6n, 3);
            const v = n.toString();
            t.assert.strictEqual(v, '-0.006');
        });

        it(`new Base(5n).toString()`, (t: it.TestContext) => {
            const n = new Base(5n);
            const v = n.toString();
            t.assert.strictEqual(v, '5');
        });

        it(`new Base(-11n).toString()`, (t: it.TestContext) => {
            const n = new Base(-11n);
            const v = n.toString();
            t.assert.strictEqual(v, '-11');
        });

        it(`new Base(0n).toString()`, (t: it.TestContext) => {
            const n = new Base(0n);
            const v = n.toString();
            t.assert.strictEqual(v, '0');
        });

        it(`new Base(0n, 2).toString()`, (t: it.TestContext) => {
            const n = new Base(0n, 2);
            const v = n.toString();
            t.assert.strictEqual(v, '0.00');
        });

        it(`new Base(-120n, 1).toString()`, (t: it.TestContext) => {
            const n = new Base(-120n, 1);
            const v = n.toString();
            t.assert.strictEqual(v, '-12.0');
        });
        it(`new Base(5n, 1).toString()`, (t: it.TestContext) => {
            t.assert.strictEqual(new Base(5n, 1).toString(), '0.5');
        });

        it(`new Base(-5n, 1).toString()`, (t: it.TestContext) => {
            t.assert.strictEqual(new Base(-5n, 1).toString(), '-0.5');
        });

        it(`new Base(15n, 1).toString()`, (t: it.TestContext) => {
            t.assert.strictEqual(new Base(15n, 1).toString(), '1.5');
        });

        it(`new Base(-1000n, 3).toString()`, (t: it.TestContext) => {
            t.assert.strictEqual(new Base(-1000n, 3).toString(), '-1.000');
        });

        it(`new Base(1n, 20).toString()`, (t: it.TestContext) => {
            t.assert.strictEqual(new Base(1n, 20).toString(), `0.${'0'.repeat(19)}1`);
        });
    });

    describe('Base.validateScale()', () => {
        it('0 is valid', (t: it.TestContext) => {
            t.assert.strictEqual(Base.validateScale(0), 0);
        });

        it('Base.MAX_SCALE is valid', (t: it.TestContext) => {
            t.assert.strictEqual(Base.validateScale(Base.MAX_SCALE), Base.MAX_SCALE);
        });

        it('Base.MAX_SCALE + 1 → RangeError', (t: it.TestContext) => {
            t.assert.throws(() => Base.validateScale(Base.MAX_SCALE + 1), RangeError);
        });

        it('-1 → RangeError', (t: it.TestContext) => {
            t.assert.throws(() => Base.validateScale(-1), RangeError);
        });

        it('1.5 → RangeError', (t: it.TestContext) => {
            t.assert.throws(() => Base.validateScale(1.5), RangeError);
        });

        it('NaN → RangeError', (t: it.TestContext) => {
            t.assert.throws(() => Base.validateScale(NaN), RangeError);
        });

        it('Infinity → RangeError', (t: it.TestContext) => {
            t.assert.throws(() => Base.validateScale(Infinity), RangeError);
        });

        it('a string → TypeError', (t: it.TestContext) => {
            t.assert.throws(() => Base.validateScale('2' as unknown as number), TypeError);
        });

        it('new Base(1n, Base.MAX_SCALE + 1) → RangeError', (t: it.TestContext) => {
            t.assert.throws(() => new Base(1n, Base.MAX_SCALE + 1), RangeError);
        });
    });
});
