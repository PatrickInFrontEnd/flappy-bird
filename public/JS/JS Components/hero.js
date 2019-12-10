import Vector from "./vector.js";
import KeyService from "./KeyService.js";

export default class Flappy_Bird extends Vector {
    constructor(ctx) {
        super(100, ctx.canvas.height / 2);
        this.ctx = ctx;
        this.r = 10;
        this.__GRAVITY = 0.6;
        this.velocity = 0;
        this.upForce = -8;

        this.keyService = new KeyService();

        this.listenToJump();
    }

    draw = () => {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#fff";
        this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    };

    update = () => {
        this.velocity += this.__GRAVITY;
        this.y += this.velocity;
        this.checkPosition();
        this.draw();
    };

    checkPosition = () => {
        if (this.y + this.r >= this.ctx.canvas.height) {
            this.velocity = 0;
            this.y = this.ctx.canvas.height - this.r;
        }

        if (this.y - this.r <= 0) {
            this.y = this.r;
        }
    };
    //TODO:
    listenToJump = () => {
        this.keyService.addListener(this.ctx.canvas);

        this.keyService.addMap("Space", keyState => {
            if (keyState) {
                this.velocity = 0;
                this.velocity += this.upForce;
            }
        });
    };

    collided = pipeGenerator => {
        if (
            this.x + this.r < pipeGenerator.upperPipe.x ||
            this.x - this.r >
                pipeGenerator.upperPipe.x + pipeGenerator.upperPipe.w
        ) {
            return false;
        } else {
            if (this.y + this.r >= pipeGenerator.bottomPipe.y) return true;
            if (
                this.y - this.r <=
                pipeGenerator.upperPipe.y + pipeGenerator.upperPipe.h
            )
                return true;

            return false;
        }
    };
}
