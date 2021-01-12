import { NCodeBig } from "ncode";

import { Snowfall } from "../src/Snowfall";
import { Snowflake } from "../src/Snowflake";

const snowfall = new Snowfall(42, Snowfall.TIME, 5, "worker", 5, "process", 12, Snowfall.INCREMENT);
const ncode = new NCodeBig(42, "time", 5, "worker", 5, "process", 12, "increment");

describe(".from_number", () => {
    test("Adds epoch to snowflake", () => {
        const n: bigint = ncode.encode({
            time: 1000,
            worker: 0,
            process: 0,
            increment: 0
        });

        expect(snowfall.from_number(n).date.getTime()).toBe(snowfall.epoch.getTime() + 1000);
    });

    test("Data from snowflake", () => {
        const n: bigint = ncode.encode({
            time: 0,
            worker: 11,
            process: 22,
            increment: 33
        });

        const snowflake = new Snowflake(snowfall, snowfall.epoch, 33, {
            worker: 11,
            process: 22
        });

        expect(snowfall.from_number(n)).toStrictEqual(snowflake);
    });
});

describe(".generate", () => {
    test("Data from constructor", async () => {
        const snowfall = new Snowfall(42, Snowfall.TIME, 5, "worker", 5, "process", 12, Snowfall.INCREMENT, {
            data: {
                worker: 1,
                process: 2
            }
        });
        const snowflake = await snowfall.generate();

        expect(snowflake.data.worker).toBe(1);
        expect(snowflake.data.process).toBe(2);
    });

    test("Data from method", async () => {
        const snowflake = await snowfall.generate({
            worker: 3,
            process: 4
        });

        expect(snowflake.data.worker).toBe(3);
        expect(snowflake.data.process).toBe(4);
    });
});

test(".to_number", () => {
    const snowflake = new Snowflake(
        snowfall,
        new Date(snowfall.epoch.getTime() + 1000),
        33,
        {
            worker: 11,
            process: 22
        }
    );

    const n: bigint = ncode.encode({
        time: 1000,
        worker: 11,
        process: 22,
        increment: 33
    });

    expect(n).toBe(snowfall.to_number(snowflake));
});

test("Throws if TIME size is not defined", () => {
    expect(() => {
        new Snowfall(5, "worker", 5, "process", 12, Snowfall.INCREMENT);
    }).toThrow();
});

test("Throws if INCREMENT size is not defined", () => {
    expect(() => {
        new Snowfall(42, Snowfall.TIME, 5, "worker", 5, "process");
    }).toThrow();
});