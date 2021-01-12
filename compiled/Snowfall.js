"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _ncode, _unique_generator;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowfall = exports.IncrementMode = void 0;
const ncode_1 = require("ncode");
const Snowflake_1 = require("./Snowflake");
const ResetGenerator_1 = require("./ResetGenerator");
const CycleGenerator_1 = require("./CycleGenerator");
var IncrementMode;
(function (IncrementMode) {
    /**
     * Reset increment every millisecond. Will await when increment reaches maximum
     */
    IncrementMode["RESET"] = "reset";
    /**
     * Cycle thru increment values. Will await when increment has cycled in the same millisecond
     */
    IncrementMode["CYCLE"] = "cycle";
})(IncrementMode = exports.IncrementMode || (exports.IncrementMode = {}));
function is_options(obj) {
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
class Snowfall {
    constructor(...parameters) {
        _ncode.set(this, void 0);
        _unique_generator.set(this, void 0);
        let time_size = null;
        let increment_size = null;
        /*
            Loop thru two parameters at a time to check if TIME size and INCREMENT size are defined
            If there is an uneven amount of parameters, the last parameter is used for options
        */
        let i = 0;
        for (; i < parameters.length - (parameters.length % 2); i += 2) {
            const size_p = parameters[i];
            const symbol_p = parameters[i + 1];
            if (symbol_p == Snowfall.TIME) {
                // Type guard
                if (typeof size_p != "number") {
                    throw new Error("TIME size must be a nonnegative integer number");
                }
                time_size = size_p;
            }
            else if (symbol_p == Snowfall.INCREMENT) {
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
        __classPrivateFieldSet(this, _ncode, new ncode_1.NCodeBig(...parameters.slice(0, i)));
        let epoch = new Date();
        let increment_mode = IncrementMode.RESET;
        let data = {};
        /*
            If there is an uneven amount of parameters, the last parameter is used for options
        */
        if (parameters.length % 2 != 0) {
            const last_p = parameters[parameters.length - 1];
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
                __classPrivateFieldSet(this, _unique_generator, new ResetGenerator_1.ResetGenerator(epoch, time_size, increment_size));
                break;
            case IncrementMode.CYCLE:
                __classPrivateFieldSet(this, _unique_generator, new CycleGenerator_1.CycleGenerator(epoch, time_size, increment_size));
                break;
        }
    }
    async generate(data) {
        const unique = await __classPrivateFieldGet(this, _unique_generator).generate();
        return new Snowflake_1.Snowflake(this, unique.date, unique.increment, {
            ...this.data,
            ...data
        });
    }
    to_number(snowflake) {
        return __classPrivateFieldGet(this, _ncode).encode({
            ...snowflake.data,
            [Snowfall.TIME]: snowflake.date.getTime() - this.epoch.getTime(),
            [Snowfall.INCREMENT]: snowflake.increment
        });
    }
    from_number(n) {
        const data = __classPrivateFieldGet(this, _ncode).decode(n);
        const date = new Date(data[Snowfall.TIME] + this.epoch.getTime());
        delete data[Snowfall.TIME];
        const increment = data[Snowfall.INCREMENT];
        delete data[Snowfall.INCREMENT];
        return new Snowflake_1.Snowflake(this, date, increment, data);
    }
}
exports.Snowfall = Snowfall;
_ncode = new WeakMap(), _unique_generator = new WeakMap();
Snowfall.TIME = Symbol();
Snowfall.INCREMENT = Symbol();
