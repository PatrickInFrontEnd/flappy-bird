import SpriteSheet_Generator from "./SpriteSheet.js";
import Vector from "./vector.js";

class Score_Resolver extends Vector {
    constructor(spritesData, scoreboardTile) {
        super();
        this.score = 0;
        this.bestScore = 0;
        this.scoreValue = 100;
        this.spritesGenerator = new SpriteSheet_Generator(spritesData);
        this.scoreboardTile = scoreboardTile;
        this.spriteScore = undefined;
        this.spriteBestScore = undefined;

        this.scoreSpriteCoordinates = {
            x:
                this.scoreboardTile.x +
                this.scoreboardTile.width -
                this.scoreboardTile.width / 5,
            y: this.scoreboardTile.y + this.scoreboardTile.height / 3,
            width: 12,
            height: 14
        };

        this.digits = [];

        for (let i = 0; i < 10; i++) {
            this.digits.push(`${i}`);
        }

        this.addNumberSprites();
    }

    addNumberSprites = () => {
        this.spritesGenerator.addSprites("number", ...this.digits);
    };

    passedPipe = (entity, pipeGenerator) => {
        if (
            entity.x >=
                pipeGenerator.bottomPipe.x + pipeGenerator.bottomPipe.w / 2 &&
            pipeGenerator.pipePassed === false
        ) {
            pipeGenerator.pipePassed = true;
            return true;
        }

        return false;
    };

    addPoints = (value = this.scoreValue) => {
        this.score += value;
    };

    setBestScore = () => {
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.spriteBestScore = this.spriteScore;
        } else {
            this.bestScore = this.bestScore;
        }
    };

    drawScore = ctx => {
        this.convertIntoSprite();
        ctx.drawImage(
            this.spriteScore,
            this.scoreSpriteCoordinates.x - this.spriteScore.width / 2,
            this.scoreSpriteCoordinates.y,
            this.spriteScore.width,
            this.spriteScore.height
        );

        if (this.bestScore && this.spriteBestScore) {
            ctx.drawImage(
                this.spriteBestScore,
                this.scoreSpriteCoordinates.x - this.spriteBestScore.width / 2,
                this.scoreSpriteCoordinates.y + this.scoreboardTile.height / 3,
                this.spriteBestScore.width,
                this.spriteBestScore.height
            );
        } else {
            ctx.drawImage(
                this.spriteScore,
                this.scoreSpriteCoordinates.x - this.spriteScore.width / 2,
                this.scoreSpriteCoordinates.y + this.scoreboardTile.height / 3,
                this.spriteScore.width,
                this.spriteScore.height
            );
        }
    };

    resetScore = () => {
        this.score = 0;
    };

    convertIntoSprite = (score = `${this.score}`) => {
        if (typeof score === "number") score = `${score}`;
        const spritesArr = score
            .split("")
            .map(digit => this.spritesGenerator.getSprite(digit));
        const sprite = this.joinSprites(spritesArr);

        this.spriteScore = sprite;

        return sprite;
    };

    joinSprites = sprites => {
        try {
            const numberOfSprites = sprites.length;
            if (!numberOfSprites) {
                throw Error("Sprites array doesn't exist.", sprites);
            }

            if (numberOfSprites >= 7)
                this.scoreSpriteCoordinates.x =
                    this.scoreboardTile.x +
                    this.scoreboardTile.width -
                    this.scoreboardTile.width / 5 -
                    this.scoreboardTile.width / 6;
            else {
                this.scoreSpriteCoordinates.x =
                    this.scoreboardTile.x +
                    this.scoreboardTile.width -
                    this.scoreboardTile.width / 5;
            }

            //NOTE: Creating a buffer for digit sprites
            const buffer = document.createElement("canvas");

            buffer.width = this.scoreSpriteCoordinates.width * numberOfSprites;

            buffer.height = this.scoreSpriteCoordinates.height;

            const ctx = buffer.getContext("2d");

            sprites.forEach((sprite, i) => {
                ctx.drawImage(
                    sprite,
                    0,
                    0,
                    sprite.width,
                    sprite.height,
                    i * this.scoreSpriteCoordinates.width,
                    0,
                    this.scoreSpriteCoordinates.width,
                    this.scoreSpriteCoordinates.height
                );
            });

            return buffer;
        } catch (error) {
            console.error(
                "Something went wrong with converting score into sprites. :",
                error
            );
        }
    };
}

export default Score_Resolver;
