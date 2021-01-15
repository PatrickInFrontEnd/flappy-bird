import Vector from "./../JS/JS Components/vector";

describe("#Vector class create its instance properly", () => {
    test("should create object with x and y coordinates", () => {
        const data = [
            [4, 100],
            [25, 42],
            [234, 123],
            [1245, 123],
            [45, 33],
            [22, 4122],
            [123, 456],
        ];

        data.forEach(([x, y]) => {
            const vector = new Vector(x, y);
            expect(vector).toEqual({ x, y });
        });
    });

    test("should accept strings and parse them to integers", () => {
        const data = [
            { input: ["4", "100"], output: [4, 100] },
            { input: ["21", "45"], output: [21, 45] },
            { input: ["123", "4567"], output: [123, 4567] },
            { input: ["67", "12"], output: [67, 12] },
            { input: ["1", "245"], output: [1, 245] },
            { input: ["41", "2"], output: [41, 2] },
            { input: ["423", "34"], output: [423, 34] },
        ];

        data.forEach(({ input: [x, y], output: [oX, oY] }) => {
            const vector = new Vector(x, y);
            expect(vector).toEqual({ x: oX, y: oY });
        });
    });
});
