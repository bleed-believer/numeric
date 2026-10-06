export class Base {
    /**
     * The maximum scale (digits after the decimal point) a `Base` can hold. Matches the
     * maximum scale of PostgreSQL's `numeric`, and keeps every operation fast.
     */
    static readonly MAX_SCALE = 16383;

    static validateScale(scale: number): number {
        if (typeof scale !== 'number') {
            throw new TypeError(`The scale value ${scale} must be a number`);
        }

        if (!Number.isInteger(scale) || scale < 0 || scale > Base.MAX_SCALE) {
            throw new RangeError(`The scale value ${scale} must be an integer between 0 and ${Base.MAX_SCALE}`);
        }

        return scale;
    }

    #scale: number;
    get scale(): number {
        return this.#scale;
    }

    #value: bigint;
    get value(): bigint {
        return this.#value;
    }

    constructor(value: bigint, scale?: number) {
        this.#scale = Base.validateScale(scale ?? 0);
        this.#value = value;
    }

    toString(): string {
        const scale = this.#scale;
        if (scale === 0) {
            return this.#value.toString();
        }

        // Works with the absolute value, so the sign never ends up between the digits.
        const negative = this.#value < 0n;
        let flat = (negative ? -this.#value : this.#value).toString();
        if (flat.length <= scale) {
            // At least one integer digit: `6n` at scale 3 → `"0006"` → `"0.006"`.
            flat = '0'.repeat(scale - flat.length + 1) + flat;
        }

        const cut = flat.length - scale;
        return (negative ? '-' : '') + flat.slice(0, cut) + '.' + flat.slice(cut);
    }
}