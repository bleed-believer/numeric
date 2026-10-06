/**
 * Defines how the discarded digits are handled when a value is rescaled to a smaller scale.
 *
 * In the `Half*` modes, a "tie" (an exact `.5`) only exists when the whole discarded part
 * is exactly half a unit of the target scale: `2.50` rescaled to scale 0 is a tie, but
 * `2.501` is not (it is above the half, so every `Half*` mode rounds it to `3`).
 */
export enum RoundMode {
    /**
     * Rounds away from zero whenever any digit is discarded.
     * - `2.1 → 3`, `2.9 → 3`
     * - `-2.1 → -3`, `-2.9 → -3`
     */
    Up = 'up',

    /**
     * Rounds towards zero (truncates) whenever any digit is discarded.
     * - `2.1 → 2`, `2.9 → 2`
     * - `-2.1 → -2`, `-2.9 → -2`
     */
    Down = 'down',

    /**
     * Rounds towards positive infinity whenever any digit is discarded.
     * - `2.1 → 3`, `2.9 → 3`
     * - `-2.1 → -2`, `-2.9 → -2`
     */
    Ceiling = 'ceiling',

    /**
     * Rounds towards negative infinity whenever any digit is discarded.
     * - `2.1 → 2`, `2.9 → 2`
     * - `-2.1 → -3`, `-2.9 → -3`
     */
    Floor = 'floor',

    /**
     * Rounds to the nearest neighbor; a `.5` goes away from zero. This is the default mode,
     * and matches SQL Server when casting a `decimal` to a smaller scale.
     * - `2.5 → 3`, `3.5 → 4`, `-2.5 → -3`
     * - `2.4 → 2`, `2.6 → 3`
     */
    HalfUp = 'half-up',

    /**
     * Rounds to the nearest neighbor; a `.5` goes towards zero.
     * - `2.5 → 2`, `3.5 → 3`, `-2.5 → -2`
     * - `2.4 → 2`, `2.6 → 3`
     */
    HalfDown = 'half-down',

    /**
     * Rounds to the nearest neighbor; a `.5` goes to the even neighbor (banker's rounding).
     * - `2.5 → 2`, `3.5 → 4`, `-2.5 → -2`, `-3.5 → -4`
     * - `2.4 → 2`, `2.6 → 3`
     */
    HalfEven = 'half-even',
};
