"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _increment, _past;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetGenerator = void 0;
const UniqueGenerator_1 = require("./UniqueGenerator");
class ResetGenerator extends UniqueGenerator_1.UniqueGenerator {
    constructor() {
        super(...arguments);
        _increment.set(this, 0);
        _past.set(this, null);
    }
    async generation_loop() {
        this.generating = true;
        while (this.queue.length > 0) {
            const { res, rej } = this.queue.shift();
            let now;
            // Increment overflow guard
            increment_guard: while (true) {
                now = new Date();
                if (now.getTime() != __classPrivateFieldGet(this, _past)?.getTime()) {
                    __classPrivateFieldSet(this, _increment, 0);
                    break increment_guard;
                }
                if (__classPrivateFieldGet(this, _increment) + 1 < 2 ** this.increment_size) {
                    __classPrivateFieldSet(this, _increment, +__classPrivateFieldGet(this, _increment) + 1);
                    break increment_guard;
                }
                await Promise.resolve();
            }
            // Time overflow guard
            if (now.getTime() - this.epoch.getTime() >= 2 ** this.time_size) {
                rej(new Error(`TIME exceeds TIME size ${this.time_size} bits`));
                continue;
            }
            __classPrivateFieldSet(this, _past, now);
            res({
                increment: __classPrivateFieldGet(this, _increment),
                date: now
            });
        }
        this.generating = false;
    }
}
exports.ResetGenerator = ResetGenerator;
_increment = new WeakMap(), _past = new WeakMap();
