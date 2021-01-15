import PipesGenerator from "./../JS/JS Components/pipes_generator";

describe("Pipes generator works properly", () => {
    const ctx = {
        canvas: {
            height: 400,
            width: 600,
        },
        drawImage: jest.fn(),
    };
    const speed = 30;
    describe("#its instance is created properly", () => {
        test("should create correct properties", () => {
            const pipesGenerator = new PipesGenerator(ctx, speed);
            const matchedObj = {
                ctx,
                ch: ctx.canvas.height,
                cw: ctx.canvas.width,
                __SPEED: speed,
                pipePassed: false,
                __WIDTH_OF_PIPE: 80,
                __HEIGHT: expect.any(Number),
                upperPipe: expect.anything(),
                bottomPipe: expect.anything(),
                generateConstants: expect.any(Function),
                generateParamsOfPipes: expect.any(Function),
                drawPipes: expect.any(Function),
                animatePipes: expect.any(Function),
                increaseSpeed: expect.any(Function),
                updatePipes: expect.any(Function),
            };

            expect(pipesGenerator).toMatchObject(matchedObj);
        });
    });
});
