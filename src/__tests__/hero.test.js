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

            expect(hero).toMatchObject({
                x: 100,
                y: 200,
                initDrawFrame: expect.any(Function),
                draw: expect.any(Function),
                update: expect.any(Function),
                playSound: expect.any(Function),
                updateRadiusCoordinates: expect.any(Function),
                checkPosition: expect.any(Function),
                jump: expect.any(Function),
                stopPlaying: expect.any(Function),
                startPlaying: expect.any(Function),
                collided: expect.any(Function),
                width: 50,
                height: 32,
                radius: { x: 0, y: 0 },
                ctx: {
                    canvas: { width: 200, height: 400 },
                    drawImage: expect.any(Function),
                },
                __GRAVITY: 0.6,
                velocity: 0,
                upForce: -8,
                allowPlaying: false,
                jumpSound: undefined,
            });
        });
    });

    describe("#its methods works properly", () => {
        describe("#initDrawFrame", () => {
            test("should be called with given arguments", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);

                hero.initDrawFrame = jest.fn((entitySprites, ctx) =>
                    ctx.drawImage()
                );

                hero.initDrawFrame(null, mockedCtx);
                expect(hero.initDrawFrame).toBeCalledWith(null, mockedCtx);
                expect(mockedCtx.drawImage).toBeCalled();
            });
        });

        describe("#update", () => {
            test("should update properties with right values", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);

                hero.update("sprite", 100, "sound");

                expect(hero).toMatchObject({
                    jumpSound: "sound",
                    velocity: 0.6,
                    y: mockedCtx.canvas.height / 2 + 0.6,
                    radius: {
                        x: hero.x + hero.width / 2,
                        y: hero.y + hero.height / 2,
                    },
                });
            });
        });

        describe("#playSound", () => {
            test("should play the sound", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);
                const sound = { currentTime: 20.42, play: jest.fn() };

                hero.playSound(sound);
                expect(sound.currentTime).toBe(0);
                expect(sound.play).toBeCalled();
            });
        });

        describe("#updateRadiusCoordinates", () => {
            test("should update coordinates with number values", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);
                const data = [
                    { x: 50, y: 100 },
                    { x: 123, y: 23 },
                    { x: 150, y: 53 },
                    { x: 80, y: 94 },
                    { x: 12, y: 12 },
                ];
                data.forEach(({ x, y }) => {
                    hero.updateRadiusCoordinates(x, y);
                    expect(hero.radius).toMatchObject({
                        x: x + hero.width / 2,
                        y: y + hero.height / 2,
                    });
                });
            });

            test("should throw an error when one of coordinates in not type of number", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);
                const data = [
                    { x: "im broken", y: "im also broken" },
                    { x: "123", y: 23 },
                    { x: 150, y: "welcome" },
                    { x: "lol", y: 94 },
                    { x: 12, y: "hello" },
                ];
                data.forEach(({ x, y }) => {
                    const output = () => {
                        hero.updateRadiusCoordinates(x, y);
                    };
                    expect(output).toThrow();
                });
            });
        });
        describe("#checkPosition", () => {
            test("should return right boolean value basing on entity's position", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);

                const coordinates = [
                    { y: 100 },
                    { y: 500 },
                    { y: 800 },
                    { y: 350 },
                    { y: -20 },
                    { y: 0 },
                    { y: 50 },
                    { y: -100 },
                ];
                coordinates.forEach(({ y }) => {
                    hero.y = y;
                    let output;
                    const isOut = hero.checkPosition();
                    if (
                        hero.y + hero.height >= hero.ctx.canvas.height ||
                        hero.y <= 0
                    )
                        output = true;
                    else {
                        output = false;
                    }
                    expect(isOut).toBe(output);
                });
            });
            test("should stop entity's position if it hits top or bottom of canvas", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);
                hero.y = 500;
                hero.checkPosition();

                expect(hero).toMatchObject({
                    y: hero.ctx.canvas.height - hero.height,
                    velocity: 0,
                });
                hero.y = -50;
                hero.checkPosition();
                expect(hero).toMatchObject({ y: 0, velocity: 0 });
            });
        });

        describe("#jump", () => {
            test("should return from function if allowPlaying is not allowed", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);

                expect(hero.jump(1)).toBeUndefined();
                expect(hero).toMatchObject({ velocity: 0, y: 200 });
            });

            test("should update properties of entity", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);
                hero.jumpSound = { currentTime: 0, play: jest.fn() };

                hero.allowPlaying = true;
                hero.jump(1);
                expect(hero).toMatchObject({ velocity: -8 });
                expect(hero.jumpSound.currentTime).toBe(0);
                expect(hero.jumpSound.play).toBeCalled();
            });
        });

        describe("#stopPlaying", () => {
            test("changes 'allowPlaying' property to false", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);
                expect(hero.allowPlaying).toBe(false);

                hero.allowPlaying = true;
                expect(hero.allowPlaying).toBe(true);

                hero.stopPlaying();
                expect(hero.allowPlaying).toBe(false);
            });
        });

        describe("#startPlaying", () => {
            test("changes 'allowPlaying' property to true", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);
                hero.startPlaying();
                expect(hero.allowPlaying).toBe(true);
            });
        });

        describe("#collided", () => {
            test("should return right boolean value depending on hero position and pipe generator", () => {
                const hero = new Flappy_Bird(mockedCtx, mockedAllowPlaying);
                hero.updateRadiusCoordinates(hero.x, hero.y);
                console.log(hero);
                const input = [
                    {
                        upperPipe: {
                            x: 200,
                            y: 0,
                            w: 100,
                            h: 150,
                        },
                        bottomPipe: {
                            x: 200,
                            y: 300,
                            w: 100,
                            h: 100,
                        },
                        output: false,
                    },
                    {
                        upperPipe: {
                            x: 100,
                            y: 0,
                            w: 100,
                            h: 150,
                        },
                        bottomPipe: {
                            x: 100,
                            y: 300,
                            w: 100,
                            h: 100,
                        },
                        output: false,
                    },
                    {
                        upperPipe: {
                            x: 100,
                            y: 0,
                            w: 100,
                            h: 50,
                        },
                        bottomPipe: {
                            x: 100,
                            y: 200,
                            w: 100,
                            h: 200,
                        },
                        output: true,
                    },
                    {
                        upperPipe: {
                            x: 100,
                            y: 0,
                            w: 100,
                            h: 250,
                        },
                        bottomPipe: {
                            x: 100,
                            y: 400,
                            w: 100,
                            h: 0,
                        },
                        output: true,
                    },
                ];

                input.forEach((pipeGenerator) => {
                    const isCollidedWithPipe = hero.collided(pipeGenerator);
                    expect(isCollidedWithPipe).toBe(pipeGenerator.output);
                });
            });
        });
    });
});
