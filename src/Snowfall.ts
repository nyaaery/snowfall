import { NCodeBig } from "ncode";

import { Snowflake, Data } from "./Snowflake";
import { UniqueGenerator, Unique } from "./UniqueGenerator";
import { ResetGenerator } from "./ResetGenerator";
import { CycleGenerator } from "./CycleGenerator";

export enum IncrementMode {
    /**
     * Reset increment every millisecond. Will await when increment reaches maximum
     */
    RESET = "reset",
    /**
     * Cycle thru increment values. Will await when increment has cycled in the same millisecond
     */
    CYCLE = "cycle"
}

export interface Options {
    epoch?: Date,
    increment_mode?: IncrementMode,
    data?: any
}

function is_options(obj: any): obj is Options {
    if (typeof obj != "object") {
        return false;
    }

    if (obj.epoch && !(obj.epoch instanceof Date)) {
        return false;
    }

    if (obj.increment_mode && !(obj.increment_mode in IncrementMode)) {
        return false;
    }

    if (obj.data !== undefined && typeof obj.data != "object") {
        return false;
    }

    return true;
}

export class Snowfall<T extends Data> {

    static readonly TIME: symbol = Symbol();
    static readonly INCREMENT: symbol = Symbol();

    readonly epoch: Date;
    readonly increment_mode: IncrementMode;
    readonly data: Partial<T>;

    readonly #ncode: NCodeBig<any>;
    readonly #unique_generator: UniqueGenerator;

    constructor(...parameters: any[]) {
        let time_size: number | null = null;
        let increment_size: number | null = null;

        /*
            Loop thru two parameters at a time to check if TIME size and INCREMENT size are defined
            If there is an uneven amount of parameters, the last parameter is used for options
        */
        let i: number = 0;
        for (; i < parameters.length - (parameters.length % 2); i += 2) {
            const size_p: any = parameters[i];
            const symbol_p: any = parameters[i + 1];

            if (symbol_p == Snowfall.TIME) {
                // Type guard
                if (typeof size_p != "number") {
                    throw new Error("TIME size must be a nonnegative integer number");
                }

                time_size = size_p;
            } else if (symbol_p == Snowfall.INCREMENT) {
                // Type guard
                if (typeof size_p != "number") {
                    throw new Error("INCREMENT size must be a nonnegative integer number");
                }

                increment_size = size_p;
            }
        }

        // Ensure both TIME and INCREMENT are defined
        if (time_size === null) {
            throw new Error("TIME size must be a nonnegative integer number");
        }
        if (increment_size === null) {
            throw new Error("INCREMENT size must be a nonnegative integer number");
        }

        this.#ncode = new NCodeBig<any>(...parameters.slice(0, i));

        let epoch: Date = new Date();
        let increment_mode: IncrementMode = IncrementMode.RESET;
        let data: Partial<T> = {};

        /*
            If there is an uneven amount of parameters, the last parameter is used for options
        */
        if (parameters.length % 2 != 0) {
            const last_p: any = parameters[parameters.length - 1];

            // Type guard
            if (!is_options(last_p)) {
                throw new Error("Options must be Options");
            }
            
            epoch = last_p.epoch ?? epoch;
            increment_mode = last_p.increment_mode ?? increment_mode;
            data = last_p.data ?? data;
        }

        this.epoch = epoch;
        this.increment_mode = increment_mode;
        this.data = data;

        switch (increment_mode) {
            case IncrementMode.RESET:
                this.#unique_generator = new ResetGenerator(epoch, time_size, increment_size);
                break;
            case IncrementMode.CYCLE:
                this.#unique_generator = new CycleGenerator(epoch, time_size, increment_size);
                break;
        }
    }

    async generate(data?: Partial<T>): Promise<Snowflake<T>> {
        const unique: Unique = await this.#unique_generator.generate();

        return new Snowflake<T>(this, unique.date, unique.increment, {
            ...this.data,
            ...data
        } as T);
    }
    
    to_number(snowflake: Snowflake<T>): bigint {
        return this.#ncode.encode({
            ...snowflake.data,
            [Snowfall.TIME]: snowflake.date.getTime() - this.epoch.getTime(),
            [Snowfall.INCREMENT]: snowflake.increment
        });
    }

    from_number(n: bigint): Snowflake<T> {
        const data: any = this.#ncode.decode(n);

        const date: Date = new Date(data[Snowfall.TIME] + this.epoch.getTime());
        delete data[Snowfall.TIME];

        const increment: number = data[Snowfall.INCREMENT];
        delete data[Snowfall.INCREMENT];

        return new Snowflake<T>(this, date, increment, data);
    }

}