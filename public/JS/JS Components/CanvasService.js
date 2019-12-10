import Pipe_Generator from "./pipes_generator.js";
import Flappy_Bird from "./hero.js";
import SpriteSheet_Generator from "./SpriteSheet.js";

class CanvasService {
    constructor(canvas) {
        this.canvas = canvas;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");

        this.allowPainting = true;

        this.pipeArray = [];

        this.bird = new Flappy_Bird(this.ctx);

        this.countFrame = 0;

        this.spritesGenerator = new SpriteSheet_Generator();
        this.spritesGenerator.addSprite("lightBgLayer");
    }

    draw = async () => {
        //IMPORTANT: refactor this code
        this.handlePipes();

        this.ctx.clearRect(0, 0, this.cw, this.ch);
        await this.createBgLayer();

        this.drawPipes();
        this.bird.update();

        if (this.birdCollided(this.pipeArray)) {
            this.stopPainting();
        }

        if (this.allowPainting === true) requestAnimationFrame(this.draw);
    };

    handlePipes = () => {
        this.countFrame++;
        if (this.countFrame > 3600) this.countFrame = 1;

        if (this.countFrame % 80 === 0) {
            this.pipeArray.push(new Pipe_Generator(this.ctx));
        }

        if (this.isPipeOut()) {
            this.pipeArray.shift();
        }
    };

    createBgLayer = async () => {
        const buffer = await this.spritesGenerator.getSprite("lightBgLayer");

        const times = parseInt(this.ch / buffer.width);

        for (let i = 0; i < times; i++) {
            this.ctx.drawImage(
                buffer,
                0,
                0,
                buffer.width,
                buffer.height,
                buffer.width * 2 * i - i * i - i * 2,
                0,
                buffer.width * 2,
                this.ch
            );
        }
    };

    drawPipes = () => {
        this.pipeArray.forEach(pipeGenerator => {
            pipeGenerator.updatePipes();
        });
    };

    isPipeOut = () => {
        return this.pipeArray.some(
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
        this.pipeArray = [];
    };

    birdCollided = ([...pipesGenerator]) => {
        const arrayOfTheTruth = pipesGenerator.map(generator => {
            return this.bird.collided(generator);
        });

        const collided = arrayOfTheTruth.some(el => el === true);

        return collided || false;
    };
}

export default CanvasService;
