# Snowfall
## Installing
```
npm i git+https://github.com/nyaaery/snowfall.git
```
## Generating snowflake
```ts
// Describe shape of snowflake
const snowfall = new Snowfall(42, Snowfall.TIME, 5, "worker", 5, "process", 12, Snowfall.INCREMENT, {
    epoch: new Date("2020-01-01"),
    data: { worker: 11 }
});

// Generate
const snowflake = await snowfall.generate({ process: 22 });
/*
    Snowflake {
        date: 2021-01-01T00:00:00.000Z,
        increment: 0,
        data: {
            worker: 11,
            process: 22
        }
    }
*/

snowflake.to_number();
/*
    132633958811131904n
*/
```
## Decoding snowflake
```ts
// Describe shape of snowflake
const snowfall = new Snowfall(42, Snowfall.TIME, 5, "worker", 5, "process", 12, Snowfall.INCREMENT, {
    epoch: new Date("2020-01-01")
});

snowfall.from_number(132633958811131904n);
/*
    Snowflake {
        date: 2021-01-01T00:00:00.000Z,
        increment: 0,
        data: {
            worker: 11,
            process: 22
        }
    }
*/
```