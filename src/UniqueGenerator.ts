export interface Unique {
    date: Date,
    increment: number
}

export interface QueuedCall {
    res(value: Unique): void,
    rej(reason?: any): void
}

export abstract class UniqueGenerator {

    protected readonly epoch: Date;
    protected readonly time_size: number;
    protected readonly increment_size: number;

    protected queue: QueuedCall[] = [];
    protected generating: boolean = false;

    constructor(epoch: Date, time_size: number, increment_size: number) {
        this.epoch = epoch;
        this.time_size = time_size;
        this.increment_size = increment_size;
    }

    async generate(): Promise<Unique> {
        return new Promise((res, rej) => {
            this.queue.push({
                res,
                rej
            });

            if (!this.generating) {
                this.generation_loop();
            }
        });
    }

    protected abstract generation_loop(): Promise<void>;

}