export interface Unique {
    date: Date;
    increment: number;
}
export interface QueuedCall {
    res(value: Unique): void;
    rej(reason?: any): void;
}
export declare abstract class UniqueGenerator {
    protected readonly epoch: Date;
    protected readonly time_size: number;
    protected readonly increment_size: number;
    protected queue: QueuedCall[];
    protected generating: boolean;
    constructor(epoch: Date, time_size: number, increment_size: number);
    generate(): Promise<Unique>;
    protected abstract generation_loop(): Promise<void>;
}
