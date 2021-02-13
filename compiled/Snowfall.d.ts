import { Data } from "ncode";
import { Snowflake } from "./Snowflake";
export declare enum IncrementMode {
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
    epoch?: Date;
    increment_mode?: IncrementMode;
    data?: any;
}
export declare class Snowfall<T extends Data> {
    #private;
    static readonly TIME: symbol;
    static readonly INCREMENT: symbol;
    readonly epoch: Date;
    readonly increment_mode: IncrementMode;
    readonly data: Partial<T>;
    constructor(...parameters: any[]);
    generate(data?: Partial<T>): Promise<Snowflake<T>>;
    to_number(snowflake: Snowflake<T>): bigint;
    from_number(n: bigint): Snowflake<T>;
}
