import { Snowfall } from "./Snowfall";
export interface Data {
    [key: string]: number | bigint;
}
export declare class Snowflake<T extends Data> {
    #private;
    readonly date: Date;
    readonly increment: number;
    readonly data: T;
    constructor(snowfall: Snowfall<T>, date: Date, increment: number, data: T);
    to_number(): bigint;
}
