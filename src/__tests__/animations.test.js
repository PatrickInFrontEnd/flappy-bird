import { formatToAlpha } from "./../JS/JS Components/animations";

describe("#formatToAlpha works with given number arguments less than or greater than or equal 100", () => {
    test("should format to appropriate string value when given a number", () => {
        const data = [
            { input: 20, output: "0.20" },
            { input: 50, output: "0.50" },
            { input: 5, output: "0.05" },
            { input: 9, output: "0.09" },
            { input: 10, output: "0.10" },
            { input: 100, output: "1" },
            { input: 0, output: "0" },
            { input: 4.5, output: "0.04" },
            { input: 20.5, output: "0.20" },
            { input: 45.5, output: "0.45" },
            { input: 41.5, output: "0.41" },
            { input: 24.5, output: "0.24" },
        ];

        data.forEach(({ input, output }) => {
            const value = formatToAlpha(input);
            expect(value).toBe(output);
        });
    });

    test("should format to 1 when value is greater than 100", () => {
        const data = [
            { input: 200, output: "1" },
            { input: 129, output: "1" },
            { input: 149895, output: "1" },
            { input: 2184, output: "1" },
            { input: 124968, output: "1" },
            { input: 124, output: "1" },
            { input: 101, output: "1" },
            { input: 200475, output: "1" },
        ];

        data.forEach(({ input, output }) => {
            const value = formatToAlpha(input);
            expect(value).toBe(output);
        });
    });

    test("should return null when value is not a number", () => {
        const data = [
            { input: "124igbasd", output: null },
            { input: null, output: null },
            { input: "24", output: null },
            { input: "omg what happend", output: null },
            { input: undefined, output: null },
            { input: true, output: null },
            { input: false, output: null },
        ];

        data.forEach(({ input, output }) => {
            const value = formatToAlpha(input);
            expect(value).toBe(output);
        });
    });

    test("should return null when value is less than 0", () => {
        const data = [
            { input: -2, output: null },
            { input: -40, output: null },
            { input: -500, output: null },
            { input: -0.01, output: null },
            { input: -0.4, output: null },
            { input: -42, output: null },
            { input: -4.5, output: null },
        ];

        data.forEach(({ input, output }) => {
            const value = formatToAlpha(input);
            expect(value).toBe(output);
        });
    });
});
