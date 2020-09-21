import Flappy_Bird from "./../JS/JS Components/hero";

describe("#Entity class works properly", () => {
    const mockedCtx = {
        canvas: {
            width: 200,
            height: 400,
        },
        drawImage: jest.fn(),
    };
    const mockedAllowPlaying = false;

    describe("#its instance is being created properly", () => {
        test("should match certain properties", () => {
            const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);
            console.log(hero);
        });
    });
});
