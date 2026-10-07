import { POW10_CACHE_LIMIT, pow10 } from './pow10.js';

// Filled lazily and in order, like the cache of `pow10`: `cache[n] === 10n ** n / 2n`.
// `10^0 / 2` isn't an integer, so the first slot is never read.
const cache: bigint[] = [ 0n ];

/**
 * Returns half of `10^exponent` (`5 × 10^(exponent - 1)`) as a `bigint`. `exponent` must
 * be a positive integer: this is an internal helper and the callers already guarantee it,
 * so it isn't validated. Shares the cache limit of `pow10`.
 */
export function halfPow10(exponent: number): bigint {
    if (exponent >= POW10_CACHE_LIMIT) {
        return pow10(exponent - 1) * 5n;
    }

    while (cache.length <= exponent) {
        cache.push(pow10(cache.length - 1) * 5n);
    }

    return cache[exponent]!;
}
