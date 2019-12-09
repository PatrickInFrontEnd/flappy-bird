import Pipe from "./Pipe.js";

export default class Pipe_Generator {
    constructor(ctx) {
        this.ctx = ctx;
        this.ch = this.ctx.canvas.height;
        this.cw = this.ctx.canvas.width;
        this.generateConstants();
        this.generateParamsOfPipes();
    }

    generateConstants = () => {
        this.__WIDTH_OF_PIPE = 80;
        this.__HEIGHT = parseInt(
            (Math.random() * this.ctx.canvas.height + 100) %
                (this.ctx.canvas.height - 150)
        );
        if (this.__HEIGHT < 50) this.__HEIGHT = 50;
        this.__SPEED = 3;
    };

    generateParamsOfPipes = () => {
        this.upperPipe = new Pipe(
            this.cw,
            0,
            this.__WIDTH_OF_PIPE,
            this.__HEIGHT
        );
        const posYBottomPipe = this.__HEIGHT + 150;
        const heightOfBottomPipe = this.ch - posYBottomPipe;

        this.bottomPipe = new Pipe(
            this.cw,
            posYBottomPipe,
            this.__WIDTH_OF_PIPE,
            heightOfBottomPipe
        );
    };

    drawPipes() {
        this.ctx.fillStyle = "#0f0";
        this.ctx.fillRect(
            this.upperPipe.x,
            this.upperPipe.y,
            this.upperPipe.w,
            this.upperPipe.h
        );
        this.ctx.fillRect(
            this.bottomPipe.x,
            this.bottomPipe.y,
            this.bottomPipe.w,
            this.bottomPipe.h
        );
    }

    clearPipes = () => {
        this.ctx.clearRect(
            this.upperPipe.x,
            this.upperPipe.y,
            this.upperPipe.w + this.__SPEED,
            this.upperPipe.h + 2
        );

        this.ctx.clearRect(
            this.bottomPipe.x,
            this.bottomPipe.y,
            this.bottomPipe.w + this.__SPEED,
            this.bottomPipe.h
        );
    };

    animatePipes = () => {
        this.upperPipe.x -= this.__SPEED;
        this.bottomPipe.x -= this.__SPEED;
    };

    updatePipes = () => {
        this.clearPipes();
        this.drawPipes();
        this.animatePipes();
    };
}
