import { Data } from "ncode";

import { Snowfall } from "./Snowfall";

export class Snowflake<T extends Data> {

    readonly #snowfall: Snowfall<T>;

    readonly date: Date;
    readonly increment: number;
    readonly data: T;

    constructor(snowfall: Snowfall<T>, date: Date, increment: number, data: T) {
        this.#snowfall = snowfall;
        this.date = date;
        this.increment = increment;
        this.data = data;
    }

    to_number(): bigint {
        return this.#snowfall.to_number(this);
    }

}