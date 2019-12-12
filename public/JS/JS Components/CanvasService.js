import Pipe_Generator from "./pipes_generator.js";
import Flappy_Bird from "./hero.js";
import SpriteSheet_Generator from "./SpriteSheet.js";

class CanvasService {
    constructor(canvas) {
        this.canvas = canvas;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");

        this.__SPEED_OF_PIPES = 3;

        this.allowPainting = true;

        this.pipesArray = [];

        this.bird = new Flappy_Bird(this.ctx);

        this.countFrame = 0;

        this.spritesGenerator = new SpriteSheet_Generator();
    }

    draw = ({
        bgLayer,
        upperPipeColumn,
        upperPipeSlot,
        bottomPipeColumn,
        bottomPipeSlot,
        entity
    }) => {
        this.handlePipes();

        this.ctx.clearRect(0, 0, this.cw, this.ch);
        this.createBgLayer(bgLayer);

        this.drawPipes({
            upperPipeSprite: { upperPipeColumn, upperPipeSlot },
            bottomPipeSprite: { bottomPipeColumn, bottomPipeSlot }
        });
        this.bird.update(entity, this.countFrame);

        if (this.birdCollided(this.pipesArray)) {
            this.stopPainting();
        }

        if (this.allowPainting === true)
            requestAnimationFrame(() => {
                this.draw({
                    bgLayer,
                    upperPipeColumn,
                    upperPipeSlot,
                    bottomPipeColumn,
                    bottomPipeSlot,
                    entity
                });
            });
    };

    startDrawing = async () => {
        this.spritesGenerator.addSprites(
            "lightBgLayer",
            "upperPipeColumn",
            "upperPipeSlot",
            "bottomPipeColumn",
            "bottomPipeSlot",
            "bird"
        );

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
            entity
        };

        this.draw(props);
    };

    handlePipes = () => {
        this.countFrame++;
        if (this.countFrame > 3600) this.countFrame = 1;

        if (this.countFrame % 80 === 0) {
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

    stopPainting = () => {
        this.allowPainting = false;
        setTimeout(() => {
            this.ctx.clearRect(0, 0, this.cw, this.ch);
            this.resetStructures();
        }, 2000);
    };

    startPainting = () => {
        this.allowPainting = true;
        this.draw();
    };

    resetStructures = () => {
        this.bird = new Flappy_Bird(this.ctx);
        this.pipesArray = [];
    };

    birdCollided = ([...pipesGenerator]) => {
        const arrayOfTheTruth = pipesGenerator.map(generator => {
            return this.bird.collided(generator);
        });

        const collided = arrayOfTheTruth.some(el => el === true);

        return collided || false;
    };

    increaseSpeedOfPipes = () => {
        this.__SPEED_OF_PIPES++;
    };
}

export default CanvasService;
