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
var _snowfall;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Snowflake = void 0;
class Snowflake {
    constructor(snowfall, date, increment, data) {
        _snowfall.set(this, void 0);
        __classPrivateFieldSet(this, _snowfall, snowfall);
        this.date = date;
        this.increment = increment;
        this.data = data;
    }
    to_number() {
        return __classPrivateFieldGet(this, _snowfall).to_number(this);
    }
}
exports.Snowflake = Snowflake;
_snowfall = new WeakMap();
