/**
 * The powers of ten up to this exponent (exclusive) are cached. Covers every scale used by
 * money, rates and divisions, while keeping the cache small (~60 KB when full): bigger
 * exponents are rare and are computed on each call.
 */
export const POW10_CACHE_LIMIT = 512;

// Filled lazily and in order, so the array stays dense: `cache[n] === 10n ** n`.
const cache: bigint[] = [ 1n ];

/**
 * Returns `10^exponent` as a `bigint`. `exponent` must be a non-negative integer: this
 * is an internal helper and the callers already guarantee it, so it isn't validated.
 */
export function pow10(exponent: number): bigint {
    if (exponent >= POW10_CACHE_LIMIT) {
        return 10n ** BigInt(exponent);
    }

    while (cache.length <= exponent) {
        cache.push(cache[cache.length - 1]! * 10n);
    }

    return cache[exponent]!;
}
