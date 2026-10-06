import { describe, it } from 'node:test';

import { POW10_CACHE_LIMIT, pow10 } from './pow10.js';

describe('pow10(number) helper', () => {
    it('10^0 → 1', (t: it.TestContext) => {
        t.assert.strictEqual(pow10(0), 1n);
    });

    it('10^1 → 10', (t: it.TestContext) => {
        t.assert.strictEqual(pow10(1), 10n);
    });

    it('10^20 → 100000000000000000000', (t: it.TestContext) => {
        t.assert.strictEqual(pow10(20), 100000000000000000000n);
    });

    it('a big exponent first, then the smaller ones (fills the cache in order)', (t: it.TestContext) => {
        t.assert.strictEqual(pow10(300), 10n ** 300n);
        t.assert.strictEqual(pow10(150), 10n ** 150n);
        t.assert.strictEqual(pow10(299), 10n ** 299n);
    });

    it('every exponent around the cache limit', (t: it.TestContext) => {
        for (let n = POW10_CACHE_LIMIT - 3; n <= POW10_CACHE_LIMIT + 3; n++) {
            t.assert.strictEqual(pow10(n), 10n ** BigInt(n));
        }
    });

    it('every cached exponent', (t: it.TestContext) => {
        let expected = 1n;
        for (let n = 0; n < POW10_CACHE_LIMIT; n++) {
            t.assert.strictEqual(pow10(n), expected);
            expected *= 10n;
        }
    });

    it('10^16383 (beyond the cache) → 1 followed by 16383 zeros', (t: it.TestContext) => {
        t.assert.strictEqual(pow10(16383), 10n ** 16383n);
    });
});
