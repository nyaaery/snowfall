import { UniqueGenerator, QueuedCall, Unique } from "./UniqueGenerator";

export class CycleGenerator extends UniqueGenerator {

    #start: number = 0;
    #increment: number = 0;
    #past: Date | null = null;

    protected async generation_loop() {
        this.generating = true;

        while (this.queue.length > 0) {
            const { res, rej } = this.queue.shift() as QueuedCall;

            let now: Date;

            // Increment overflow guard
            increment_guard:
            while (true) {
                now = new Date();

                if (now.getTime() != this.#past?.getTime()) {
                    this.#start = (this.#increment + this.#start) % 2 ** this.increment_size;
                    this.#increment = 0;
                    break increment_guard;
                }

                if (this.#increment < 2 ** this.increment_size) {
                    break increment_guard;
                }

                await Promise.resolve();
            }

            // Time overflow guard
            if (now.getTime() - this.epoch.getTime() >= 2 ** this.time_size) {
                rej(new Error(`TIME exceeds TIME size ${this.time_size} bits`));
                continue;
            }

            const unique: Unique = {
                increment: (this.#increment + this.#start) % 2 ** this.increment_size,
                date: now
            };
            
            this.#past = now;
            this.#increment++;

            res(unique);
        }

        this.generating = false;
    }

}