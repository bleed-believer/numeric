import { describe, it } from 'node:test';

import { POW10_CACHE_LIMIT } from './pow10.js';
import { halfPow10 } from './half-pow10.js';

describe('halfPow10(number) helper', () => {
    it('10^1 / 2 → 5', (t: it.TestContext) => {
        t.assert.strictEqual(halfPow10(1), 5n);
    });

    it('10^2 / 2 → 50', (t: it.TestContext) => {
        t.assert.strictEqual(halfPow10(2), 50n);
    });

    it('10^20 / 2 → 50000000000000000000', (t: it.TestContext) => {
        t.assert.strictEqual(halfPow10(20), 50000000000000000000n);
    });

    it('a big exponent first, then the smaller ones (fills the cache in order)', (t: it.TestContext) => {
        t.assert.strictEqual(halfPow10(300), 10n ** 300n / 2n);
        t.assert.strictEqual(halfPow10(150), 10n ** 150n / 2n);
        t.assert.strictEqual(halfPow10(299), 10n ** 299n / 2n);
    });

    it('every exponent around the cache limit', (t: it.TestContext) => {
        for (let n = POW10_CACHE_LIMIT - 3; n <= POW10_CACHE_LIMIT + 3; n++) {
            t.assert.strictEqual(halfPow10(n), 10n ** BigInt(n) / 2n);
        }
    });

    it('every cached exponent', (t: it.TestContext) => {
        let expected = 5n;
        for (let n = 1; n < POW10_CACHE_LIMIT; n++) {
            t.assert.strictEqual(halfPow10(n), expected);
            expected *= 10n;
        }
    });

    it('10^16383 / 2 (beyond the cache) → 5 followed by 16382 zeros', (t: it.TestContext) => {
        t.assert.strictEqual(halfPow10(16383), 10n ** 16383n / 2n);
    });
});
