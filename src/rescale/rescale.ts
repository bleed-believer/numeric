import type { BaseObject } from './interfaces/index.js';

import { RoundMode } from './round-mode.js';

export function rescale(target: BaseObject, scale: number, mode?: RoundMode): BaseObject {
    mode ??= RoundMode.HalfUp;

    if (scale > target.scale) {
        const delta = 10n ** BigInt(scale - target.scale);
        const value = target.value * delta;
        return { value, scale };

    } else if (scale < target.scale) {
        // Works with the absolute value, so "rounding up" always means "away from zero",
        // and the sign is applied back at the end.
        const negative = target.value < 0n;
        const abs = negative ? -target.value : target.value;
        const divisor = 10n ** BigInt(target.scale - scale);

        let value = abs / divisor;
        const remainder = abs % divisor;
        if (remainder > 0n) {
            // Compares the discarded part against the half: -1 below, 0 tie, 1 above.
            const half = remainder * 2n;
            const cmp = half < divisor ? -1 : half > divisor ? 1 : 0;

            let roundUp: boolean;
            switch (mode) {
                case RoundMode.Up:        roundUp = true;                                     break;
                case RoundMode.Down:      roundUp = false;                                    break;
                case RoundMode.Ceiling:   roundUp = !negative;                                break;
                case RoundMode.Floor:     roundUp = negative;                                 break;
                case RoundMode.HalfUp:    roundUp = cmp >= 0;                                 break;
                case RoundMode.HalfDown:  roundUp = cmp > 0;                                  break;
                case RoundMode.HalfEven:  roundUp = cmp > 0 || (cmp === 0 && value % 2n === 1n); break;
                default:
                    throw new TypeError(`The round mode ${mode} is not supported`);
            }

            if (roundUp) {
                value += 1n;
            }
        }

        return { value: negative ? -value : value, scale };

    } else {
        return {
            value: target.value,
            scale
        };

    }
}
