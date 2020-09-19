import ScoreResolver from "./../JS/JS Components/scoreResolver";

console.error = jest.fn();

const mockedData = {
    spritesData: {
        bgSpriteImg: null,
        entitySpriteImg: null,
        spritesJSON: null,
    },
    scoreBoardTile: { x: 0, y: 0, width: 100, height: 300 },
};

describe("#ScoreResolver", () => {
    test("should create instance with right properties", () => {
        const scoreResolver = new ScoreResolver(
            mockedData.spritesData,
            mockedData.scoreBoardTile
        );
        expect(scoreResolver).toMatchObject({
            x: NaN,
            y: NaN,
            addNumberSprites: expect.any(Function),
            passedPipe: expect.any(Function),
            addPoints: expect.any(Function),
            setBestScore: expect.any(Function),
            drawScore: expect.any(Function),
            resetScore: expect.any(Function),
            convertIntoSprite: expect.any(Function),
            joinSprites: expect.any(Function),
            score: 0,
            bestScore: 0,
            scoreValue: 100,
            spritesGenerator: expect.anything(),
            scoreboardTile: { x: 0, y: 0, width: 100, height: 300 },
            spriteScore: undefined,
            spriteBestScore: undefined,
            scoreSpriteCoordinates: expect.any(Object),
            digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        });
    });
});

describe("#its methods work properly", () => {
    const scoreResolver = new ScoreResolver(
        mockedData.spritesData,
        mockedData.scoreBoardTile
    );

    describe("#addNumberSprites", () => {
        test("is being invoked properly", () => {
            scoreResolver.addNumberSprites = jest.fn();
            scoreResolver.addNumberSprites();
            expect(scoreResolver.addNumberSprites).toBeCalled();
            scoreResolver.addNumberSprites();
            expect(scoreResolver.addNumberSprites).toBeCalledTimes(2);
        });
    });

    describe("#passedPipe", () => {
        test("is returning right value, depending on arguments and affecting pipe generators (informs specific pipe generator that entity passed through)", () => {
            const mockedEntity1 = { x: 560, y: 300 };
            const mockedEntity2 = { x: 720, y: 300 };
            const mockedPipeGenerator = {
                pipePassed: false,
                bottomPipe: { x: 600, w: 100 },
            };

            let isPassed = scoreResolver.passedPipe(
                mockedEntity1,
                mockedPipeGenerator
            );
            expect(isPassed).toBe(false);
            expect(mockedPipeGenerator.pipePassed).toBe(false);
            isPassed = scoreResolver.passedPipe(
                mockedEntity2,
                mockedPipeGenerator
            );
            expect(isPassed).toBe(true);
            expect(mockedPipeGenerator.pipePassed).toBe(true);
        });
        test("should return false when called without both arguments", () => {
            const mockedEntity = { x: 500, y: 200 };
            const mockedPipeGenerator = {
                pipePassed: false,
                bottomPipe: { x: 600, w: 100 },
            };

            let isPassed = scoreResolver.passedPipe();
            expect(isPassed).toBe(false);
            isPassed = scoreResolver.passedPipe(mockedEntity);
            expect(isPassed).toBe(false);
            isPassed = scoreResolver.passedPipe(undefined, mockedPipeGenerator);
            expect(isPassed).toBe(false);
            expect(mockedPipeGenerator.pipePassed).toBe(false);
        });

        test("should be called properly with given arguments", () => {
            const mockedEntity = { x: 500, y: 200 };
            const mockedPipeGenerator = {
                pipePassed: false,
                bottomPipe: { x: 600, w: 100 },
            };
            scoreResolver.passedPipe = jest.fn();
            scoreResolver.passedPipe(mockedEntity, mockedPipeGenerator);
            expect(scoreResolver.passedPipe).toBeCalledWith(
                mockedEntity,
                mockedPipeGenerator
            );
        });
    });

    describe("#addPoints", () => {
        test("should add points to scoreResolver's score with given valid arguments", () => {
            //Initial number score
            expect(scoreResolver.score).toBe(0);

            const data = [
                { input: 200, output: 200 },
                { input: 400, output: 600 },
                { input: 1, output: 601 },
                { input: 20, output: 621 },
                { input: 400, output: 1021 },
            ];

            data.forEach(({ input, output }) => {
                scoreResolver.addPoints(input);
                expect(scoreResolver.score).toBe(output);
            });
            scoreResolver.resetScore();
        });

        test("should return from function if argument is not a number", () => {
            const data = [
                { input: 200, output: 200 },
                { input: null, output: 200 },
                { input: "hello", output: 200 },
                { input: 20, output: 220 },
                { input: null, output: 220 },
            ];
            data.forEach(({ input, output }) => {
                scoreResolver.addPoints(input);
                expect(scoreResolver.score).toBe(output);
            });
            scoreResolver.resetScore();
        });

        test("should add default value if arguments are undefined", () => {
            let score = 0;
            for (let i = 0; i < 10; i++) {
                scoreResolver.addPoints();
                score += scoreResolver.scoreValue;
                expect(scoreResolver.score).toBe(score);
            }
            scoreResolver.resetScore();
            score = 0;

            const previousDefaultValue = scoreResolver.scoreValue;
            const defaultValue = 250;
            scoreResolver.scoreValue = defaultValue;

            for (let i = 0; i < 10; i++) {
                scoreResolver.addPoints();
                score += scoreResolver.scoreValue;
                expect(scoreResolver.score).toBe(score);
            }
            scoreResolver.scoreValue = previousDefaultValue;
            scoreResolver.resetScore();
        });
    });

    describe("#setBestScore", () => {
        test("should set up best score appropriately, depending on score property", () => {
            scoreResolver.setBestScore();
            expect(scoreResolver.bestScore).toBe(0);

            //Setting score as best score as long as it's score value is greater than best score
            for (let i = 0; i < 10; i++) {
                scoreResolver.addPoints();
                scoreResolver.setBestScore();
                expect(scoreResolver.bestScore).toBe(scoreResolver.score);
            }

            scoreResolver.resetScore();
            expect(scoreResolver.bestScore).toBeGreaterThan(
                scoreResolver.score
            );

            scoreResolver.addPoints(2500);
            scoreResolver.setBestScore();
            expect(scoreResolver.bestScore).toBe(scoreResolver.score);
        });
    });

    describe("#resetScore", () => {
        test("should be called properly", () => {
            const scoreResolver = new ScoreResolver(
                mockedData.spritesData,
                mockedData.scoreBoardTile
            );
            scoreResolver.resetScore = jest.fn();
            scoreResolver.resetScore();
            expect(scoreResolver.resetScore).toBeCalled();

            const times = 50;
            for (let i = 0; i < times; i++) {
                scoreResolver.resetScore();
            }
            expect(scoreResolver.resetScore).toBeCalledTimes(times + 1);
        });

        test("should reset score property to the zero", () => {
            const scoreResolver = new ScoreResolver(
                mockedData.spritesData,
                mockedData.scoreBoardTile
            );

            scoreResolver.addPoints(100);
            scoreResolver.resetScore();
            expect(scoreResolver.score).toBe(0);
        });
    });
});
