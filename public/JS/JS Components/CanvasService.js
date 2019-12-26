import Pipe_Generator from "./pipes_generator.js";
import Flappy_Bird from "./hero.js";
import SpriteSheet_Generator from "./SpriteSheet.js";
import { createBuffer } from "./spritesFunctions.js";
import { SoundMaker } from "./soundMaker.js";
import Game_Menu from "./Interface.js";
import { alphaAnimation } from "./animations.js";

class Game_Engine {
    constructor(
        canvas,
        { bgSpriteImg, entitySpriteImg, spritesJSON },
        sounds,
        interfaceData
    ) {
        this.canvas = canvas;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");

        this.__SPEED_OF_PIPES = 3;

        this.spritesData = {
            bgSpriteImg,
            entitySpriteImg,
            spritesJSON
        };

        //TODO: figure out how to simplify this API
        this.bgSpriteNames = Array.from(
            Object.keys(this.spritesData.spritesJSON)
        ).filter(
            name => this.spritesData.spritesJSON[name].type === "background"
        );

        console.log(this.bgSpriteNames);

        this.lastFrame = undefined;

        this.gameProps = undefined;

        this.sounds = sounds.map(([name, sound]) => ({ name, sound }));

        this.allowPlaying = false;

        this.pipesArray = [];

        this.bird = new Flappy_Bird(this.ctx, this.allowPlaying);
        this.skinBird = "bird-red";

        //It's a determinant of when we should create and add new pipe to the game, also helps with animation
        this.countFrame = 0;

        this.spritesGenerator = new SpriteSheet_Generator(this.spritesData);

        this.soundMaker = new SoundMaker();

        this.addGameSounds();
        this.setCursorIcon();
        this.createGameProps();

        this.menuInterface = new Game_Menu(
            this.ctx,
            this.spritesData,
            interfaceData,
            { bgMethod: this.createBgLayer, sprite: this.gameProps.bgLayer },
            this.listener
        );
        this.allowedToClickAtMenu = true;

        this.setCallbacksAtTilesOfMenu();
    }

    draw = ({
        //NOTE: Ready sprites && sounds
        bgLayer,
        upperPipeColumn,
        upperPipeSlot,
        bottomPipeColumn,
        bottomPipeSlot,
        entity,
        sounds: { jumpSound, collidedSound, bgSong }
    }) => {
        this.countFrame++;
        if (this.countFrame > 3600) this.countFrame = 1;

        this.ctx.clearRect(0, 0, this.cw, this.ch);

        //NOTE: pushing pipes in appropriate distances and delete them when behind the canvas
        this.handlePipes();
        this.createBgLayer(bgLayer);

        this.bird.update(entity, this.countFrame, jumpSound);

        this.drawPipes({
            upperPipeSprite: { upperPipeColumn, upperPipeSlot },
            bottomPipeSprite: { bottomPipeColumn, bottomPipeSlot }
        });

        if (this.birdCollided(this.pipesArray) || this.bird.checkPosition()) {
            this.banPainting(bgSong);
            this.bird.stopPlaying();
            this.soundMaker.playSound(collidedSound);
        }

        if (this.allowPlaying === true)
            requestAnimationFrame(() => {
                this.draw({
                    bgLayer,
                    upperPipeColumn,
                    upperPipeSlot,
                    bottomPipeColumn,
                    bottomPipeSlot,
                    entity,
                    sounds: { jumpSound, collidedSound, bgSong }
                });
            });
    };

    startDrawing = () => {
        this.allowPainting();
        this.draw(this.gameProps);
    };

    handlePipes = () => {
        if (this.countFrame % 100 === 0) {
            this.pipesArray.push(
                new Pipe_Generator(this.ctx, this.__SPEED_OF_PIPES)
            );
        }

        if (this.isPipeOut()) {
            this.pipesArray.shift();
        }
    };

    createBgLayer = bgSprite => {
        const buffer = bgSprite;

        const times = parseInt(this.cw / buffer.width);

        for (let i = 0; i < times; i++) {
            this.ctx.drawImage(
                buffer,
                0,
                0,
                buffer.width,
                buffer.height,
                buffer.width * 2 * i,
                0,
                buffer.width * 2,
                this.ch
            );
        }
    };

    listener = (element = this.canvas) => {
        try {
            element.addEventListener("mousedown", e => {
                const { layerX: x, layerY: y, buttons } = e;

                const names = [
                    "menuIcon",
                    "okayIcon",
                    "pauseIcon",
                    "playIcon",
                    "playButton",
                    "getReadyTitle",
                    "gameOverTitle",
                    "flappyBirdTitle",
                    "tapBoardIcon",
                    "scoreBoard"
                ];

                const tiles = names.map(name =>
                    this.menuInterface.menuTiles.get(name)
                );

                tiles.forEach(tile => {
                    if (
                        x >= tile.x &&
                        x <= tile.x + tile.width &&
                        y >= tile.y &&
                        y <= tile.y + tile.height
                    ) {
                        if (buttons === 1) {
                            if (tile.isHidden !== true) {
                                if (
                                    tile.callback &&
                                    this.allowedToClickAtMenu === true
                                ) {
                                    tile.callback();
                                }
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error("Something went wrong...", error);
        }
    };

    drawPipes = ({ upperPipeSprite, bottomPipeSprite }) => {
        this.pipesArray.forEach(pipeGenerator => {
            pipeGenerator.updatePipes(
                { upperPipeSprite, bottomPipeSprite },
                this.__SPEED_OF_PIPES
            );
        });
    };

    startGame = ctx => {
        alphaAnimation(
            "in",
            ctx,
            ctx => {
                this.menuInterface.showReadyTitle(ctx);
            },
            ctx => {
                alphaAnimation("out", ctx, this.menuInterface.hideReadyTitle);
                alphaAnimation(
                    "in",
                    ctx,
                    ctx => {
                        this.createBgLayer(this.gameProps.bgLayer);
                        this.bird.initDrawFrame(this.gameProps.entity[0], ctx);
                        this.menuInterface.showTile("tapBoardIcon", ctx);
                    },
                    () => {
                        this.soundMaker.playSound(this.gameProps.sounds.bgSong);
                        this.canvas.addEventListener("mousedown", this.play);
                    }
                );
            }
        );
    };

    play = () => {
        this.startDrawing(this.ctx);
        this.bird.jump(1);
        this.canvas.removeEventListener("mousedown", this.play);
    };

    createGameProps = () => {
        const names = [
            "darkBgLayer",
            "upperPipeColumn",
            "upperPipeSlot",
            "bottomPipeColumn",
            "bottomPipeSlot"
        ];

        this.spritesGenerator.addSprites("background", ...names);

        this.spritesGenerator.addSprite(this.skinBird, "entity");
        const entity = this.spritesGenerator.getSprite(this.skinBird);

        const jumpSound = this.soundMaker.getSound("jump");
        const collidedSound = this.soundMaker.getSound("collided");
        const bgSong = this.soundMaker.getSound("song");
        bgSong.loop = "true";

        const [
            bgLayer,
            upperPipeColumn,
            upperPipeSlot,
            bottomPipeColumn,
            bottomPipeSlot
        ] = this.spritesGenerator.getAllSprites(...names);

        if (!this.gameProps) {
            const props = {
                bgLayer,
                upperPipeColumn,
                upperPipeSlot,
                bottomPipeColumn,
                bottomPipeSlot,
                entity,
                sounds: { jumpSound, collidedSound, bgSong }
            };

            this.gameProps = props;
        }
    };

    isPipeOut = () => {
        return this.pipesArray.some(
            pipeGenerator =>
                pipeGenerator.upperPipe.x + pipeGenerator.upperPipe.w + 10 <= 0
        );
    };

    banPainting = bgSong => {
        this.allowPlaying = false;
        this.lastFrame = createBuffer(this.canvas, {
            sx: 0,
            sy: 0,
            width: this.cw,
            height: this.ch
        });
        setTimeout(() => {
            this.showSubMenu(this.lastFrame, this.ctx, bgSong);
        }, 1000);
    };

    allowPainting = () => {
        this.allowPlaying = true;
        this.bird.startPlaying();
    };

    resetStructures = bgSong => {
        this.soundMaker.stopSound(bgSong);
        this.bird.y = this.ch / 2;
        this.pipesArray = [];
        this.countFrame = 1;
    };

    birdCollided = ([...pipesGenerators]) => {
        const arrayOfTheTruth = pipesGenerators.map(generator => {
            return this.bird.collided(generator);
        });

        const collided = arrayOfTheTruth.some(el => el === true);

        return collided || false;
    };

    increaseSpeedOfPipes = () => {
        this.__SPEED_OF_PIPES++;
    };

    addGameSounds = () => {
        this.sounds.forEach(({ name, sound }) => {
            this.soundMaker.addSound(name, sound);
        });
    };

    //TODO:
    setCallbacksAtTilesOfMenu = () => {
        const clickSound = this.soundMaker.getSound("menuClick");

        this.menuInterface.addCallbackOnTile("menuIcon", () => {
            //TODO: Create callback for this tile
            this.allowedToClickAtMenu = false;
            this.soundMaker.playSound(clickSound);
            this.allowedToClickAtMenu = true;
        });

        this.menuInterface.addCallbackOnTile("okayIcon", () => {
            //TODO: Create callback for this tile
            this.allowedToClickAtMenu = false;
            this.soundMaker.playSound(clickSound);
            this.allowedToClickAtMenu = true;
        });

        this.menuInterface.addCallbackOnTile("playButton", () => {
            this.soundMaker.playSound(clickSound);
            this.menuInterface.hideMenu(this.ctx);
            this.startGame(this.ctx);
            this.allowedToClickAtMenu = false;
        });
    };

    showSubMenu = (lastFrame, ctx, bgSong) => {
        const gameOverSound = this.soundMaker.getSound("gameover");
        this.soundMaker.playSound(gameOverSound);
        this.resetStructures(bgSong);
        this.drawSubMenu(lastFrame, ctx);
    };

    drawSubMenu = (lastFrame, ctx) => {
        alphaAnimation(
            "out",
            ctx,
            ctx => {
                ctx.drawImage(
                    lastFrame,
                    0,
                    0,
                    lastFrame.width,
                    lastFrame.height
                );
            },
            ctx => {
                const tiles = [
                    "gameOverTitle",
                    "playButton",
                    "okayIcon",
                    "scoreBoard"
                ].map(name => {
                    const tile = this.menuInterface.menuTiles.get(name);
                    return tile;
                });

                alphaAnimation(
                    "in",
                    ctx,
                    ctx => {
                        ctx.drawImage(
                            lastFrame,
                            0,
                            0,
                            lastFrame.width,
                            lastFrame.height
                        );
                        tiles.forEach(tile => tile.showTile(ctx));
                    },
                    () => {
                        this.allowedToClickAtMenu = true;
                    }
                );
            }
        );
    };

    setCursorIcon = () => {
        this.canvas.style.cursor = "url(img/cursor.png),auto";
    };
}

export default Game_Engine;
