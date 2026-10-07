import { describe, it } from 'node:test';

import { equals } from './equals.js';

// Every operand is normalized, as `equals` requires.
describe('equals(BaseObject, BaseObject) comparator', () => {
    it('5 === 5', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 5n, scale: 0 };
        t.assert.strictEqual(equals(a, b), true);
    });

    it('5 !== 6', (t: it.TestContext) => {
        const a = { value: 5n, scale: 0 };
        const b = { value: 6n, scale: 0 };
        t.assert.strictEqual(equals(a, b), false);
    });

    it('1.5 === 1.5', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 15n, scale: 1 };
        t.assert.strictEqual(equals(a, b), true);
    });

    it('1.5 !== 1.51', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 151n, scale: 2 };
        t.assert.strictEqual(equals(a, b), false);
    });

    it('1.5 !== 15 (same value, different scale)', (t: it.TestContext) => {
        const a = { value: 15n, scale: 1 };
        const b = { value: 15n, scale: 0 };
        t.assert.strictEqual(equals(a, b), false);
    });

    it('0 === 0', (t: it.TestContext) => {
        const a = { value: 0n, scale: 0 };
        const b = { value: 0n, scale: 0 };
        t.assert.strictEqual(equals(a, b), true);
    });

    it('-1.5 === -1.5', (t: it.TestContext) => {
        const a = { value: -15n, scale: 1 };
        const b = { value: -15n, scale: 1 };
        t.assert.strictEqual(equals(a, b), true);
    });

    it('-1.5 !== 1.5', (t: it.TestContext) => {
        const a = { value: -15n, scale: 1 };
        const b = { value: 15n, scale: 1 };
        t.assert.strictEqual(equals(a, b), false);
    });

    it('9007199254740993.1 !== 9007199254740993.10001', (t: it.TestContext) => {
        const a = { value: 90071992547409931n, scale: 1 };
        const b = { value: 900719925474099310001n, scale: 5 };
        t.assert.strictEqual(equals(a, b), false);
    });
});
