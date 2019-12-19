import Vector from "./vector.js";
import KeyService from "./KeyService.js";
import { createAnimation } from "./animations.js";

export default class Flappy_Bird extends Vector {
    constructor(ctx) {
        super(100, ctx.canvas.height / 2);
        this.width = 50;
        this.height = 32;
        this.radius = new Vector(0, 0);
        this.ctx = ctx;
        this.__GRAVITY = 0.6;
        this.velocity = 0;
        this.upForce = -8;

        this.keyService = new KeyService();

        this.listenToJump();
    }

    draw = (entitySprites, frameCounter) => {
        const image = createAnimation(entitySprites, 4, frameCounter);
        this.ctx.drawImage(image, this.x, this.y, this.width, this.height);
    };

    update = (entitySprites, frameCounter) => {
        this.velocity += this.__GRAVITY;
        this.y += this.velocity;
        this.updateRadiusCoordinates(this.x, this.y);
        this.checkPosition();
        this.draw(entitySprites, frameCounter);
    };

    updateRadiusCoordinates = (x, y) => {
        this.radius.x = x + this.width / 2;
        this.radius.y = y + this.height / 2;
    };

    checkPosition = () => {
        if (this.y + this.height >= this.ctx.canvas.height) {
            this.velocity = 0;
            this.y = this.ctx.canvas.height - this.height;
            return true;
        }

        if (this.y <= 0) {
            this.velocity = 0;
            this.y = 0;
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
        if (
            this.x + this.width - 10 < upperPipe.x ||
            this.x > upperPipe.x + upperPipe.w
        ) {
            return false;
        } else {
            if (this.radius.y + this.height / 2 - 5 >= bottomPipe.y)
                return true;
            if (
                this.radius.y - this.height / 2 + this.height / 4 <=
                upperPipe.y + upperPipe.h
            )
                return true;

            return false;
        }
    };
}
