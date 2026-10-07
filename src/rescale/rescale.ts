import type { BaseObject } from './interfaces/index.js';

import { halfPow10, pow10 } from '../pow10/index.js';
import { RoundMode } from './round-mode.js';

export function rescale(target: BaseObject, scale: number, mode?: RoundMode): BaseObject {
    mode ??= RoundMode.HalfUp;

    if (scale > target.scale) {
        const delta = pow10(scale - target.scale);
        const value = target.value * delta;
        return { value, scale };

    } else if (scale < target.scale) {
        // Works with the absolute value, so "rounding up" always means "away from zero",
        // and the sign is applied back at the end.
        const negative = target.value < 0n;
        const abs = negative ? -target.value : target.value;
        const exponent = target.scale - scale;
        const divisor = pow10(exponent);

        // Rounding up when the discarded part reaches some threshold is the same as adding
        // `divisor - threshold` before truncating, which needs a single division instead
        // of a quotient and a remainder (each one costly with values beyond 64 bits).
        // e.g. HalfUp: 1.25 → 125 + 5 = 130 → 130 / 10 = 13 → 1.3
        let value: bigint;
        switch (mode) {
            case RoundMode.Up:       value = (abs + divisor - 1n) / divisor;                  break;
            case RoundMode.Down:     value = abs / divisor;                                   break;
            case RoundMode.Ceiling:  value = (negative ? abs : abs + divisor - 1n) / divisor; break;
            case RoundMode.Floor:    value = (negative ? abs + divisor - 1n : abs) / divisor; break;
            case RoundMode.HalfUp:   value = (abs + halfPow10(exponent)) / divisor;           break;
            case RoundMode.HalfDown: value = (abs + halfPow10(exponent) - 1n) / divisor;      break;
            case RoundMode.HalfEven: {
                // A tie must be told apart from anything above the half, so this one needs
                // the remainder.
                value = abs / divisor;
                const half = (abs % divisor) * 2n;
                if (half > divisor || (half === divisor && value % 2n === 1n)) {
                    value += 1n;
                }
                break;
            }
            default:
                throw new TypeError(`The round mode ${mode} is not supported`);
        }

        return { value: negative ? -value : value, scale };

    } else {
        return {
            value: target.value,
            scale
        };

    }
}
