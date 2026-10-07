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

    describe('new Numeric(string | number | bigint)', () => {
        it(`12 → 12`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('12').toString(), '12');
        });

        it(`-0.5 → -0.5`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('-0.5').toString(), '-0.5');
        });

        it(`007.10 → 7.1`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('007.10').toString(), '7.1');
        });

        it(`1.500 → 1.5`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('1.500').toString(), '1.5');
        });

        it(`10.00 → 10`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('10.00').toString(), '10');
        });

        it(`100 → 100`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('100').toString(), '100');
        });

        it(`-3.0 → -3`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('-3.0').toString(), '-3');
        });

        it(`-0.0 → 0`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('-0.0').toString(), '0');
        });

        it(`0.000 → 0`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('0.000').toString(), '0');
        });

        it(`-0.00120 → -0.0012`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric('-0.00120').toString(), '-0.0012');
        });

        it(`1.25 → 1.25`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric(1.25).toString(), '1.25');
        });

        it(`-7 → -7`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric(-7).toString(), '-7');
        });

        it(`120n → 120`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric(120n).toString(), '120');
        });

        it(`-5n → -5`, (t: it.TestContext) => {
            t.assert.strictEqual(new Numeric(-5n).toString(), '-5');
        });

        it(`+1 → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric('+1'), TypeError);
        });

        it(` 1 → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric(' 1'), TypeError);
        });

        it(`1e3 → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric('1e3'), TypeError);
        });

        it(`.5 → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric('.5'), TypeError);
        });

        it(`5. → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric('5.'), TypeError);
        });

        it(`1.2.3 → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric('1.2.3'), TypeError);
        });

        it(`empty string → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric(''), TypeError);
        });

        it(`- → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric('-'), TypeError);
        });

        it(`NaN → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric(NaN), TypeError);
        });

        it(`Infinity → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric(Infinity), TypeError);
        });

        it(`1e-7 → TypeError`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric(1e-7), TypeError);
        });

        it(`the maximum amount of decimals is accepted`, (t: it.TestContext) => {
            const n = new Numeric(`0.${'0'.repeat(16382)}1`);
            t.assert.strictEqual(n.toFixed(16383), `0.${'0'.repeat(16382)}1`);
        });

        it(`more decimals than the maximum → RangeError, even if they are zeros`, (t: it.TestContext) => {
            t.assert.throws(() => new Numeric(`1.${'0'.repeat(16384)}`), RangeError);
        });
    });

    describe('Numeric operations', () => {
        it(`results are normalized: 0.5 + 0.5 → '1'`, (t: it.TestContext) => {
            const r = new Numeric('0.5').add(new Numeric('0.5'));
            t.assert.strictEqual(r.toString(), '1');
        });

        it(`results are normalized: 1.5 - 1.5 → '0'`, (t: it.TestContext) => {
            const r = new Numeric('1.5').subtract(new Numeric('1.5'));
            t.assert.strictEqual(r.toString(), '0');
            t.assert.strictEqual(r.toFixed(1), '0.0');
        });

        it(`results are normalized: 1.25 × 4 → '5'`, (t: it.TestContext) => {
            const r = new Numeric('1.25').multiply(new Numeric('4'));
            t.assert.strictEqual(r.toString(), '5');
        });

        it(`results are normalized: round(1.2001, 2) → '1.2'`, (t: it.TestContext) => {
            const r = new Numeric('1.2001').round(2);
            t.assert.strictEqual(r.toString(), '1.2');
        });

        it(`results are normalized: 1 / 2 at 6 decimals → '0.5'`, (t: it.TestContext) => {
            const r = new Numeric('1').split(new Numeric('2'), 6);
            t.assert.strictEqual(r.toString(), '0.5');
        });

        it(`results without trailing zeros are kept: 1.25 + 0.01 → '1.26'`, (t: it.TestContext) => {
            const r = new Numeric('1.25').add(new Numeric('0.01'));
            t.assert.strictEqual(r.toString(), '1.26');
        });

        it(`results are new Numeric instances and the operands don't change`, (t: it.TestContext) => {
            const a = new Numeric('1.5');
            const b = new Numeric('2.25');
            const results = [
                a.add(b), a.subtract(b), a.multiply(b), a.split(b, 4), a.round(0)
            ];

            for (const r of results) {
                t.assert.ok(r instanceof Numeric);
                t.assert.notStrictEqual(r, a);
                t.assert.notStrictEqual(r, b);
            }

            t.assert.strictEqual(a.toString(), '1.5');
            t.assert.strictEqual(b.toString(), '2.25');
        });

        it(`results can be chained`, (t: it.TestContext) => {
            const r = new Numeric('19.99')
                .multiply(new Numeric('3'))
                .multiply(new Numeric('1.21'))
                .round(2);

            t.assert.strictEqual(r.toString(), '72.56');
        });

        it(`a product beyond the maximum scale → RangeError`, (t: it.TestContext) => {
            const a = new Numeric(`0.${'0'.repeat(8999)}1`);
            t.assert.throws(() => a.multiply(a), RangeError);
        });

        it(`a product beyond the maximum scale is accepted if normalizing brings it back`, (t: it.TestContext) => {
            // 5^3000 × 2^3000 = 10^3000: at scale 18000 it normalizes to 1 at scale 15000.
            const a = new Numeric({ value: 5n ** 3000n, scale: 9000 });
            const b = new Numeric({ value: 2n ** 3000n, scale: 9000 });
            const r = a.multiply(b);
            t.assert.strictEqual(r.toFixed(15000), `0.${'0'.repeat(14999)}1`);
        });

        for (const decimals of [ -1, 1.5, NaN, Infinity, 16384, 1e9 ]) {
            it(`round(${decimals}) → RangeError`, (t: it.TestContext) => {
                t.assert.throws(() => new Numeric('1.5').round(decimals), RangeError);
            });

            it(`round(${decimals}) of zero → RangeError`, (t: it.TestContext) => {
                t.assert.throws(() => new Numeric('0').round(decimals), RangeError);
            });

            it(`split(3, ${decimals}) → RangeError`, (t: it.TestContext) => {
                const n = new Numeric('1.5');
                t.assert.throws(() => n.split(new Numeric('3'), decimals), RangeError);
            });

            it(`toFixed(${decimals}) → RangeError`, (t: it.TestContext) => {
                t.assert.throws(() => new Numeric('1.5').toFixed(decimals), RangeError);
            });
        }

        it(`round with a non-number decimals → TypeError`, (t: it.TestContext) => {
            const n = new Numeric('1.5');
            t.assert.throws(() => n.round('2' as unknown as number), TypeError);
        });

        it(`split by zero → RangeError`, (t: it.TestContext) => {
            const n = new Numeric('1.5');
            t.assert.throws(() => n.split(new Numeric('0'), 2), RangeError);
        });
    });
});
