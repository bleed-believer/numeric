import { describe, it } from 'node:test';

import { sign } from './sign.js';

describe('sign(BaseObject) comparator', () => {
    it('5 → 1', (t: it.TestContext) => {
        t.assert.strictEqual(sign({ value: 5n, scale: 0 }), 1);
    });

    it('0.001 → 1', (t: it.TestContext) => {
        t.assert.strictEqual(sign({ value: 1n, scale: 3 }), 1);
    });

    it('-0.001 → -1', (t: it.TestContext) => {
        t.assert.strictEqual(sign({ value: -1n, scale: 3 }), -1);
    });

    it('0 → 0', (t: it.TestContext) => {
        t.assert.strictEqual(sign({ value: 0n, scale: 0 }), 0);
    });

    it('0.000 → 0', (t: it.TestContext) => {
        t.assert.strictEqual(sign({ value: 0n, scale: 3 }), 0);
    });

    it('a long negative value → -1', (t: it.TestContext) => {
        const value = -(10n ** 100n);
        t.assert.strictEqual(sign({ value, scale: 50 }), -1);
    });
});
