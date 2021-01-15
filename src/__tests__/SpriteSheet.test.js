import SpriteSheet_Generator from "./../JS/JS Components/SpriteSheet";

console.error = jest.fn();

describe("#SpriteSheet Generator", () => {
    const mockedSpritesData = {
        bgSpriteImg: null,
        entitySpriteImg: null,
        spritesJSON: null,
    };

    describe("#should create its instance properly", () => {
        const spriteSheetGenerator = new SpriteSheet_Generator(
            mockedSpritesData
        );
        test("should match specific properties", () => {
            expect(spriteSheetGenerator).toMatchObject({
                addSprite: expect.any(Function),
                addSprites: expect.any(Function),
                getSprite: expect.any(Function),
                getAllSprites: expect.any(Function),
                spritesSheet: expect.any(Map),
                images: { entity: null, background: null },
                spriteJSON: null,
            });
        });
    });

    describe("#its methods work properly", () => {
        const spriteSheetGenerator = new SpriteSheet_Generator(
            mockedSpritesData
        );

        describe("#addSprite", () => {
            spriteSheetGenerator.addSprite = jest.fn((name, type) => {
                if (spriteSheetGenerator.spritesSheet.has(name)) return;
                const value = type === "entity" ? "entity" : "background";
                spriteSheetGenerator.spritesSheet.set(name, value);
            });

            test("should be invoked properly with arguments and add values to the map", () => {
                const data = [
                    { name: "brick", type: "background" },
                    { name: "tile1", type: "background" },
                    { name: "hero", type: "entity" },
                    { name: "bird", type: "entity" },
                ];
                data.forEach(({ name, type }) => {
                    spriteSheetGenerator.addSprite(name, type);
                    expect(spriteSheetGenerator.addSprite).toBeCalledWith(
                        name,
                        type
                    );
                    expect(spriteSheetGenerator.spritesSheet.get(name)).toBe(
                        type
                    );
                });
            });

            test("should return when name already exist", () => {
                const data = [
                    { name: "brick" },
                    { name: "tile1" },
                    { name: "hero" },
                    { name: "bird" },
                ];

                data.forEach(({ name }) => {
                    spriteSheetGenerator.addSprite(name);
                    expect(spriteSheetGenerator.addSprite).toReturn();
                });
            });
        });

        describe("#getSprite", () => {
            test("should return value if property exist in the Map and return error when there is no such property", () => {
                expect(spriteSheetGenerator.getSprite("brick")).toBe(
                    "background"
                );

                expect(() => {
                    spriteSheetGenerator.getSprite("floor");
                }).toThrow("Incorrect name typed: floor");
            });
        });

        describe("#getAllSprites", () => {
            test("should return an array of values based on Map", () => {
                const input = ["brick", "tile1", "hero", "bird"];
                const output = ["background", "background", "entity", "entity"];

                const value = spriteSheetGenerator.getAllSprites(...input);
                expect(value).toEqual(output);
            });
            test("should throw an error when value is not in the Map object", () => {
                const input = ["baba", "sedtr", "awe", "jeez"];
                const value = () => {
                    spriteSheetGenerator.getAllSprites(input);
                };
                expect(value).toThrow();
            });
        });
    });
});
