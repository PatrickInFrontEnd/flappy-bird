import Vector from "./vector.js";
import KeyService from "./KeyService.js";

export default class Flappy_Bird extends Vector {
    constructor(ctx) {
        super(100, ctx.canvas.height / 2);
        this.ctx = ctx;
        this.__GRAVITY = 0.6;
        this.velocity = 0;
        this.upForce = -8;

        this.keyService = new KeyService();

        this.listenToJump();
    }

    draw = (entitySprites, frameCounter) => {
        const numberOfFrames = entitySprites.length;

        //TODO create animation function that takes bird as an argument, think over about it somehow...
    };

    update = entitySprites => {
        this.velocity += this.__GRAVITY;
        this.y += this.velocity;
        this.checkPosition();
        this.draw(entitySprites);
    };

    checkPosition = () => {
        //TODO Bird now is gonna be a square , refactor this code!
        if (this.y + this.r >= this.ctx.canvas.height) {
            this.velocity = 0;
            this.y = this.ctx.canvas.height - this.r;
            return true;
        }

        if (this.y - this.r <= 0) {
            this.y = this.r;
            return true;
        }

        return false;
    };
    listenToJump = () => {
        this.keyService.addListener(this.ctx.canvas);

        this.keyService.addMap("Space", keyState => {
            if (keyState) {
                this.velocity = 0;
                this.velocity += this.upForce;
            }
        });
    };

    collided = ({ upperPipe, bottomPipe }) => {
        //TODO Bird now is gonna be a square , refactor this code!
        if (
            this.x + this.r < upperPipe.x ||
            this.x - this.r > upperPipe.x + upperPipe.w
        ) {
            return false;
        } else {
            if (this.y + this.r >= bottomPipe.y) return true;
            if (this.y - this.r <= upperPipe.y + upperPipe.h) return true;

            return false;
        }
    };
}
