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
        const negative = this.#value < 0n;
        const flat = this.#value
            .toString()
            .replace(/^-/, '')
            .padStart(this.#scale + 1, '0');

        const cut = flat.length - this.#scale;
        const int = flat.slice(0, cut);
        const dec = flat.slice(cut);

        return [
            negative ? '-' : '',
            int,
            dec.length > 0 ? `.${dec}` : ''
        ].join('');
    }
}