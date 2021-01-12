"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueGenerator = void 0;
class UniqueGenerator {
    constructor(epoch, time_size, increment_size) {
        this.queue = [];
        this.generating = false;
        this.epoch = epoch;
        this.time_size = time_size;
        this.increment_size = increment_size;
    }
    async generate() {
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
}
exports.UniqueGenerator = UniqueGenerator;
