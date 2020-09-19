import Pipe from "./../JS/JS Components/Pipe";

describe("#Pipe class works as intended", () => {
    test("should create instance of an object properly with given arguments", () => {
        const data = [
            { x: 0, y: 0, width: 200, height: 100 },
            { x: 12, y: 45, width: 140, height: 900 },
            { x: 213, y: 451, width: 342, height: 12100 },
            { x: 2456, y: 0, width: 123, height: 123 },
            { x: 764, y: 0, width: 240, height: 2 },
            { x: 24, y: 10, width: 333, height: 111 },
        ];

        data.forEach(({ x, y, width, height }) => {
            const pipe = new Pipe(x, y, width, height);
            expect(pipe).toEqual({ x, y, w: width, h: height });
        });
    });
    test("should parse for absolute value if it comes to pipe's width and height", () => {
        const data = [
            { x: 0, y: 0, width: -200, height: -100 },
            { x: 12, y: 45, width: -140, height: -900 },
            { x: 213, y: 451, width: -342, height: 12100 },
            { x: 2456, y: 0, width: -123, height: 123 },
            { x: 764, y: 0, width: 240, height: -2 },
            { x: 24, y: 10, width: -333, height: 111 },
        ];

        data.forEach(({ x, y, width, height }) => {
            const pipe = new Pipe(x, y, width, height);
            expect(pipe).toEqual({
                x,
                y,
                w: Math.abs(width),
                h: Math.abs(height),
            });
        });
    });
});
