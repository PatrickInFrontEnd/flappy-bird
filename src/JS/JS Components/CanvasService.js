import Pipe_Generator from "./pipes_generator.js";
import Flappy_Bird from "./hero.js";
import SpriteSheet_Generator from "./SpriteSheet.js";
import { createBuffer } from "./spritesFunctions.js";
import { SoundMaker } from "./soundMaker.js";
import Game_Menu from "./Interface.js";
import { alphaAnimation } from "./animations.js";
import KeyService from "./KeyService.js";
import Score_Resolver from "./scoreResolver.js";
import cursorPNG from "./../../img/cursor.png";

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

        this.keyService = new KeyService();
        this.sounds = sounds.map(([name, sound]) => ({ name, sound }));
        //TODO: figure out how to simplify this API

        this.generateGameEngineParams();
        this.addGameSounds();
        this.setCursorIcon();
        this.createGameProps();

        this.allowedToClickAtMenu = true;

        this.menuInterface = new Game_Menu(
            this.ctx,
            this.spritesData,
            interfaceData,
            { bgMethod: this.createBgLayer, sprite: this.gameProps.bgLayer },
            this.listener
        );

        this.scoreResolver = new Score_Resolver(
            this.spritesData,
            this.menuInterface.getTile("scoreBoard")
        );

        this.setCallbacksAtTilesOfMenu();
    }

    generateGameEngineParams = () => {
        this.bgSpriteNames = Array.from(
            Object.keys(this.spritesData.spritesJSON)
        ).filter(
            name => this.spritesData.spritesJSON[name].type === "background"
        );

        this.menuSpriteNames = Array.from(
            Object.keys(this.spritesData.spritesJSON)
        )
            .filter(name => this.spritesData.spritesJSON[name].type === "menu")
            .concat(
                Array.from(Object.keys(this.spritesData.spritesJSON)).filter(
                    name =>
                        this.spritesData.spritesJSON[name].type === "birdSkin"
                )
            );
        this.lastFrame = undefined;

        this.gameProps = undefined;

        this.typeOfBg = "light";

        this.allowPlaying = false;

        this.pipesArray = [];

        this.bird = new Flappy_Bird(this.ctx, this.allowPlaying);
        this.skin = "yellow";
        this.skinOfBird = "bird-" + this.skin;
        this.birdSkins = ["bird-red", "bird-blue", "bird-yellow", "bird-gray"];

        //It's a determinant of when we should create and add new pipe to the game, also helps with animation
        this.countFrame = 0;

        this.spritesGenerator = new SpriteSheet_Generator(this.spritesData);

        this.soundMaker = new SoundMaker();
    };

    createGameProps = () => {
        this.isGamePaused = false;

        this.spritesGenerator.addSprites("background", ...this.bgSpriteNames);

        this.spritesGenerator.addSprites("entity", ...this.birdSkins);

        const entity = this.spritesGenerator.getSprite(this.skinOfBird);
        this.entitySprite = entity;

        const jumpSound = this.soundMaker.getSound("jump");
        const collidedSound = this.soundMaker.getSound("collided");
        const bgSong = this.soundMaker.getSound("song");
        bgSong.loop = "true";

        const [
            lightBgLayer,
            bgLayer,
            upperPipeColumn,
            upperPipeSlot,
            bottomPipeColumn,
            bottomPipeSlot
        ] = this.spritesGenerator.getAllSprites(...this.bgSpriteNames);

        if (!this.gameProps) {
            const props = {
                lightBgLayer,
                bgLayer,
                upperPipeColumn,
                upperPipeSlot,
                bottomPipeColumn,
                bottomPipeSlot,
                entity: this.entitySprite,
                sounds: { jumpSound, collidedSound, bgSong }
            };

            this.gameProps = props;
        }
    };

    draw = ({
        //NOTE: Ready sprites && sounds
        lightBgLayer,
        bgLayer,
        upperPipeColumn,
        upperPipeSlot,
        bottomPipeColumn,
        bottomPipeSlot,
        entity,
        sounds: { jumpSound, collidedSound, bgSong }
    }) => {
        const [pauseIcon, playIcon] = ["pauseIcon", "playIcon"].map(name =>
            this.menuInterface.getTile(name)
        );
        this.countFrame++;
        if (this.countFrame > 3600) this.countFrame = 1;

        this.ctx.clearRect(0, 0, this.cw, this.ch);

        //NOTE: pushing pipes in appropriate distances and deleting them when behind the canvas
        this.handlePipes();
        const sprite = this.typeOfBg === "light" ? lightBgLayer : bgLayer;

        this.createBgLayer(sprite);
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

        if (this.birdPassedThePipe()) {
            this.scoreResolver.addPoints();
            if (
                this.scoreResolver.score === 2000 ||
                this.scoreResolver.score === 5000
            ) {
                this.increaseSpeedOfPipes();
            }
            this.scoreResolver.convertIntoSprite(this.scoreResolver.score);
            this.scoreResolver.setBestScore();
        }

        if (this.allowPlaying === true) {
            this.allowedToClickAtMenu = true;
            if (this.isGamePaused === true) {
                pauseIcon.hideTile(this.ctx);
                playIcon.showTile(this.ctx);
            } else {
                playIcon.hideTile(this.ctx);
                pauseIcon.showTile(this.ctx);
                requestAnimationFrame(() => {
                    this.draw({
                        lightBgLayer,
                        bgLayer,
                        upperPipeColumn,
                        upperPipeSlot,
                        bottomPipeColumn,
                        bottomPipeSlot,
                        entity,
                        sounds: { jumpSound, collidedSound, bgSong }
                    });
                });
            }
        } else {
            pauseIcon.isHidden = true;
            playIcon.isHidden = true;
            this.allowedToClickAtMenu = false;
        }
    };

    pauseGame = () => {
        this.soundMaker.playSound(this.soundMaker.getSound("pause"));
        requestAnimationFrame(() => {
            this.menuInterface.showTile("scoreBoard");
            this.scoreResolver.drawScore(this.ctx);
        });
        this.keyService.removeClickListener(this.canvas);
        this.isGamePaused = true;
    };

    resumeGame = () => {
        this.soundMaker.playSound(this.soundMaker.getSound("play"));
        this.isGamePaused = false;
        this.keyService.addClickListener(this.canvas, this.bird.jump);
        requestAnimationFrame(() => {
            this.draw(this.gameProps);
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

    birdPassedThePipe = () => {
        const arrayOfTheTruth = this.pipesArray.map(generator => {
            return this.scoreResolver.passedPipe(this.bird, generator);
        });

        const collided = arrayOfTheTruth.some(el => el === true);

        return collided || false;
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

    drawPipes = ({ upperPipeSprite, bottomPipeSprite }) => {
        this.pipesArray.forEach(pipeGenerator => {
            pipeGenerator.updatePipes(
                { upperPipeSprite, bottomPipeSprite },
                this.__SPEED_OF_PIPES
            );
        });
    };

    play = () => {
        this.scoreResolver.resetScore();
        this.__SPEED_OF_PIPES = 3;
        this.startDrawing();
        this.keyService.addKeyListener(this.canvas);
        this.keyService.addKeyMapping("Escape", keystate => {
            if (this.isGamePaused === true && keystate) {
                this.resumeGame();
            } else if (this.isGamePaused === false && keystate) {
                this.pauseGame();
            }
        });
        this.listenToJump();
        this.bird.jump(1);
        this.canvas.removeEventListener("mousedown", this.play);
    };

    isPipeOut = () => {
        return this.pipesArray.some(
            pipeGenerator =>
                pipeGenerator.upperPipe.x + pipeGenerator.upperPipe.w + 10 <= 0
        );
    };

    banPainting = bgSong => {
        this.allowPlaying = false;
        this.keyService.removeKeyListener(this.canvas);
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

    setUpSkin = name => {
        if (name) this.skin = name;
        this.skinOfBird = "bird-" + this.skin;
        this.entitySprite = this.spritesGenerator.getSprite(this.skinOfBird);
        this.gameProps.entity = this.entitySprite;
    };

    increaseSpeedOfPipes = () => {
        this.__SPEED_OF_PIPES++;
    };

    addGameSounds = () => {
        this.sounds.forEach(({ name, sound }) => {
            this.soundMaker.addSound(name, sound);
        });
    };

    listenToJump = () => {
        this.keyService.addClickListener(this.ctx.canvas, this.bird.jump);
    };

    listener = (element = this.canvas) => {
        try {
            element.addEventListener("mousedown", e => {
                const { clientX: xPos, clientY: yPos, buttons } = e;
                const { top, left } = e.target.getBoundingClientRect();

                const x = xPos - left;
                const y = yPos - top;

                const tiles = this.menuSpriteNames.map(name =>
                    this.menuInterface.getTile(name)
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
                                    this.allowedToClickAtMenu = false;
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

    startGame = ctx => {
        alphaAnimation(
            "in",
            ctx,
            ctx => {
                this.menuInterface.showReadyTitle(ctx);
            },
            ctx => {
                alphaAnimation(
                    "out",
                    ctx,
                    this.menuInterface.hideReadyTitle,
                    ctx => {
                        alphaAnimation(
                            "in",
                            ctx,
                            ctx => {
                                const sprite =
                                    this.typeOfBg === "light"
                                        ? this.gameProps.lightBgLayer
                                        : this.gameProps.bgLayer;
                                this.createBgLayer(sprite);

                                this.bird.initDrawFrame(
                                    this.gameProps.entity[0],
                                    ctx
                                );
                                this.menuInterface.showTile(
                                    "tapBoardIcon",
                                    ctx
                                );
                            },
                            () => {
                                this.soundMaker.playSound(
                                    this.gameProps.sounds.bgSong
                                );
                                this.canvas.addEventListener(
                                    "mousedown",
                                    this.play
                                );
                            }
                        );
                    }
                );
            }
        );
    };

    //TODO:
    setCallbacksAtTilesOfMenu = () => {
        const clickSound = this.soundMaker.getSound("menuClick");

        this.menuInterface.addCallbackOnTile("menuIcon", () => {
            //TODO: Create callback for this tile
            this.soundMaker.playSound(clickSound);

            alphaAnimation(
                "out",
                this.ctx,
                ctx => {
                    this.createBgLayer(this.gameProps.bgLayer);
                    this.menuInterface.hideMenu(ctx);
                },
                ctx => {
                    alphaAnimation(
                        "in",
                        ctx,
                        ctx => {
                            this.createBgLayer(this.gameProps.bgLayer);
                            this.menuInterface.showBirdSkins(ctx);
                            this.menuInterface.showTile("menuOkayIcon");
                        },
                        () => {
                            this.showChosenSkin();
                            this.allowedToClickAtMenu = true;
                        }
                    );
                }
            );
        });

        this.menuInterface.addCallbackOnTile("okayIcon", () => {
            this.soundMaker.playSound(clickSound);
            this.hideSubMenu(this.lastFrame, this.ctx);
        });

        this.menuInterface.addCallbackOnTile("menuOkayIcon", () => {
            this.soundMaker.playSound(clickSound);
            alphaAnimation(
                "out",
                this.ctx,
                ctx => {
                    this.createBgLayer(this.gameProps.bgLayer);
                    this.menuInterface.hideBirdSkins(ctx);
                },
                ctx => {
                    alphaAnimation(
                        "in",
                        ctx,
                        ctx => {
                            this.createBgLayer(this.gameProps.bgLayer);
                            this.menuInterface.showMenu(ctx);
                        },
                        () => {
                            this.allowedToClickAtMenu = true;
                        }
                    );
                }
            );
        });

        this.menuInterface.addCallbackOnTile("playButton", () => {
            this.soundMaker.playSound(clickSound);
            this.menuInterface.hideMenu(this.ctx);
            this.startGame(this.ctx);
        });

        this.menuInterface.addCallbackOnTile("pauseIcon", this.pauseGame);

        this.menuInterface.addCallbackOnTile("playIcon", this.resumeGame);

        ["yellow", "blue", "gray", "red"].forEach(color => {
            this.menuInterface.addCallbackOnTile(
                `bird_${color}Skin`,

                () => {
                    this.soundMaker.playSound(clickSound);
                    this.setUpSkin(color);

                    this.ctx.clearRect(0, 0, this.cw, this.ch);
                    this.showChosenSkin();

                    this.allowedToClickAtMenu = true;
                }
            );
        });
    };

    showChosenSkin = () => {
        const birdTile = this.menuInterface.getTile(`bird_${this.skin}Skin`);
        const x = birdTile.x - 10;
        const y = birdTile.y - 10;
        const w = birdTile.width + 20;
        const h = birdTile.height + 20;

        requestAnimationFrame(() => {
            this.createBgLayer(this.gameProps.bgLayer);
            this.menuInterface.showBirdSkins(this.ctx);
            this.menuInterface.showTile("menuOkayIcon");

            this.ctx.strokeStyle = "#f5f5f5";
            this.ctx.lineWidth = 5;
            this.ctx.lineJoin = "bevel";
            this.ctx.strokeRect(x, y, w, h);
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
                        this.menuInterface.showSubMenu(ctx);
                        this.scoreResolver.setBestScore();
                        this.scoreResolver.drawScore(ctx);
                    },
                    () => {
                        this.allowedToClickAtMenu = true;
                    }
                );
            }
        );
    };

    hideSubMenu = (lastFrame, ctx) => {
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
                this.menuInterface.hideSubMenu(ctx);
                this.scoreResolver.drawScore(ctx);
            },
            ctx => {
                alphaAnimation(
                    "in",
                    ctx,
                    ctx => {
                        this.createBgLayer(this.gameProps.bgLayer);
                        this.menuInterface.showMenu(ctx);
                    },
                    () => {
                        this.allowedToClickAtMenu = true;
                    }
                );
            }
        );
    };

    setCursorIcon = () => {
        this.canvas.style.cursor = `url(${cursorPNG}),auto`;
    };
}

export default Game_Engine;
