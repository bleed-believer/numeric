import { describe, it } from 'node:test';

import { equals } from './equals.js';
import { Base } from '../base/index.js';

describe('equals(Base, Base) operator', () => {
    it('5 === 5', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(5n), new Base(5n)), true);
    });

    it('5 !== 6', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(5n), new Base(6n)), false);
    });

    it('1.5 === 1.50 (different scales)', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(15n, 1), new Base(150n, 2)), true);
    });

    it('1.50 === 1.5 (order does not matter)', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(150n, 2), new Base(15n, 1)), true);
    });

    it('2 === 2.000', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(2n), new Base(2000n, 3)), true);
    });

    it('1.5 !== 1.51', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(15n, 1), new Base(151n, 2)), false);
    });

    it('1.5 !== 15 (same value, different scale)', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(15n, 1), new Base(15n)), false);
    });

    it('0 === 0.000', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(0n), new Base(0n, 3)), true);
    });

    it('-1.5 === -1.50', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(-15n, 1), new Base(-150n, 2)), true);
    });

    it('-1.5 !== 1.5', (t: it.TestContext) => {
        t.assert.strictEqual(equals(new Base(-15n, 1), new Base(15n, 1)), false);
    });

    it('9007199254740993.1 !== 9007199254740993.10001', (t: it.TestContext) => {
        const a = new Base(90071992547409931n, 1);
        const b = new Base(900719925474099310001n, 5);
        t.assert.strictEqual(equals(a, b), false);
    });

    it('does not mutate its operands', (t: it.TestContext) => {
        const a = new Base(15n, 1);
        const b = new Base(150n, 2);
        equals(a, b);
        t.assert.strictEqual(a.scale, 1);
        t.assert.strictEqual(a.value, 15n);
        t.assert.strictEqual(b.scale, 2);
        t.assert.strictEqual(b.value, 150n);
    });
});
