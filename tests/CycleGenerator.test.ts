import { CycleGenerator } from "../src/CycleGenerator";
import { Unique } from "../src/UniqueGenerator";

test("Cycles increment", async () => {
    const cycle_generator: CycleGenerator = new CycleGenerator(new Date(), Number.MAX_SAFE_INTEGER, 6);
    const promises: Promise<Unique>[] = [];
    
    for (let i = 0; i < 100; i++) {
        promises.push(cycle_generator.generate());
    }

    const uniques: Unique[] = await Promise.all(promises);

    for (let i = 0; i < uniques.length; i++) {
        const unique: Unique = uniques[i];

        expect(unique.increment).toBe(i % 64);
    }
});

test("Are unique", async () => {
    const cycle_generator: CycleGenerator = new CycleGenerator(new Date(), Number.MAX_SAFE_INTEGER, 6);
    const promises: Promise<Unique>[] = [];

    for (let i = 0; i < 100; i++) {
        promises.push(cycle_generator.generate());
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