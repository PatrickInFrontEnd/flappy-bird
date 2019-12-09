import Pipe_Generator from "./pipes_generator.js";

class CanvasService {
    constructor(canvas) {
        this.canvas = canvas;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");

        this.pipeArray = [];

        this.countFrame = 0;
    }

    draw = () => {
        this.countFrame++;
        if (this.countFrame > 3600) this.countFrame = 1;

        if (this.countFrame % 80 === 0) {
            this.pipeArray.push(new Pipe_Generator(this.ctx));
        }

        if (this.isPipeOut()) {
            this.pipeArray.shift();
        }
        this.drawPipes();

        requestAnimationFrame(this.draw);
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
}

export default CanvasService;
