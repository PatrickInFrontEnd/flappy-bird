import Pipe_Generator from "./pipes_generator.js";
import Flappy_Bird from "./hero.js";
import SpriteSheet_Generator from "./SpriteSheet.js";
import { SoundMaker } from "./soundMaker.js";
import Game_Menu from "./Interface.js";

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

        this.sounds = sounds.map(([name, sound]) => ({ name, sound }));

        this.allowPlaying = false;

        this.pipesArray = [];

        this.bird = new Flappy_Bird(this.ctx, this.allowPlaying);

        //It's a determinant of when we should create and add new pipe to the game, also helps with animation
        this.countFrame = 0;

        this.spritesGenerator = new SpriteSheet_Generator(this.spritesData);
        this.soundMaker = new SoundMaker();
        this.menuInterface = new Game_Menu(
            this.ctx,
            this.spritesData,
            interfaceData
        );
        //this.setCallbacksAtTilesOfMenu();

        this.addGameSounds();
        this.setCursorIcon();
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

        //NOTE: pushing pipes in appropriate distances
        this.handlePipes();
        this.createBgLayer(bgLayer);

        this.drawPipes({
            upperPipeSprite: { upperPipeColumn, upperPipeSlot },
            bottomPipeSprite: { bottomPipeColumn, bottomPipeSlot }
        });

        //TODO this.drawGameMenu();

        this.bird.update(entity, this.countFrame, jumpSound);

        if (this.birdCollided(this.pipesArray) || this.bird.checkPosition()) {
            this.stopPainting(bgSong);
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

    startDrawing = async () => {
        this.spritesGenerator.addSprites(
            "background",
            "darkBgLayer",
            "upperPipeColumn",
            "upperPipeSlot",
            "bottomPipeColumn",
            "bottomPipeSlot"
        );

        this.spritesGenerator.addSprite("bird-red", "entity");

        const jumpSound = await this.soundMaker.getSound("jump");
        const collidedSound = await this.soundMaker.getSound("collided");
        const bgSong = await this.soundMaker.getSound("song");
        bgSong.loop = "true";

        const [
            bgLayer,
            upperPipeColumn,
            upperPipeSlot,
            bottomPipeColumn,
            bottomPipeSlot,
            entity
        ] = await Promise.all(this.spritesGenerator.getAllSprites());

        const props = {
            bgLayer,
            upperPipeColumn,
            upperPipeSlot,
            bottomPipeColumn,
            bottomPipeSlot,
            entity,
            sounds: { jumpSound, collidedSound, bgSong }
        };
        this.soundMaker.playSound(bgSong);
        this.startPainting();
        this.draw(props);
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
                buffer.width * 2 * i - i * times,
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

    isPipeOut = () => {
        return this.pipesArray.some(
            pipeGenerator =>
                pipeGenerator.upperPipe.x + pipeGenerator.upperPipe.w + 10 <= 0
        );
    };

    stopPainting = bgSong => {
        this.allowPlaying = false;
        setTimeout(() => {
            this.ctx.clearRect(0, 0, this.cw, this.ch);
            this.resetStructures(bgSong);
        }, 2000);
    };

    startPainting = () => {
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
        [
            ["play"],
            ["pause"],
            ["collided", "0.5", "sound", ".flac"],
            ["song", "0.1", "music"],
            ["jump", "0.5"]
        ].forEach(([soundName, volume, type, ext]) => {
            this.soundMaker.addSound(soundName, volume, type, ext);
        });
    };

    setCallbacksAtTilesOfMenu = () => {
        let isLoaded;
        while (isLoaded === false) {
            isLoaded = this.menuInterface.menuTiles.size > 0;
        }
        this.menuInterface.addCallbackOnTile("menuIcon", () => {
            const tile = this.menuInterface.menuTiles.get("menuIcon");
            this.ctx.fillStyle = "#f00";
            this.ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
        });
    };

    setCursorIcon = () => {
        this.canvas.style.cursor = "url(img/cursor.png),auto";
    };
}

export default Game_Engine;
