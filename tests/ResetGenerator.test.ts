import { ResetGenerator } from "../src/ResetGenerator";
import { Unique } from "../src/UniqueGenerator";

const reset_generator: ResetGenerator = new ResetGenerator(new Date(), Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);

test("Increment resets", async () => {
    const uniques: Unique[] = [];

    for (let i = 0; i < 100; i++) {
        uniques.push(await reset_generator.generate());
        await new Promise(res => setTimeout(res, 10));
    }

    for (const unique of uniques) {
        expect(unique.increment).toBe(0);
    }
});

test("Are unique", async () => {
    const promises: Promise<Unique>[] = [];

    for (let i = 0; i < 100; i++) {
        promises.push(reset_generator.generate());
    }

    const uniques: Unique[] = await Promise.all(promises);

    for (let i = 0; i < uniques.length; i++) {
        const a: Unique = uniques[i];

        for (let j = 0; j < uniques.length; j++) {
            if (j == i) {
                continue;
            }

            const b: Unique = uniques[j];

            expect(b).not.toStrictEqual(a);
        }
    }
});