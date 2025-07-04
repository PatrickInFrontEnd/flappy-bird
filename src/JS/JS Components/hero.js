import { createAnimation } from "./animations.js";
import Vector from "./vector.js";

export default class Flappy_Bird extends Vector {
    constructor(ctx, allowPlay) {
        super(100, ctx.canvas.height / 2);
        this.width = 50;
        this.height = 32;
        this.radius = new Vector(0, 0);
        this.ctx = ctx;
        this.__GRAVITY = 0.6;
        this.velocity = 0;
        this.upForce = -8;

        this.allowPlaying = allowPlay;
        this.hasJumped = false;

        this.jumpSound = undefined;
    }

    initDrawFrame = (entitySprite, ctx) => {
        ctx.drawImage(entitySprite, this.x, this.y, this.width, this.height);
    };

    draw = (entitySprites, frameCounter) => {
        const image = createAnimation(entitySprites, 4, frameCounter);
        this.ctx.drawImage(image, this.x, this.y, this.width, this.height);
    };

    update = (entitySprites, frameCounter, sound) => {
        if (!this.jumpSound) this.jumpSound = sound;
        this.velocity += this.__GRAVITY;
        this.y += this.velocity;
        this.updateRadiusCoordinates(this.x, this.y);
        this.checkPosition();
        this.draw(entitySprites, frameCounter);
    };

    playSound = (sound) => {
        sound.currentTime = 0;
        sound.play();
    };

    updateRadiusCoordinates = (x, y) => {
        if (typeof x !== "number" || typeof y !== "number") {
            throw Error("Coordinates have to be type of number!");
        }
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

    jump = (keyState) => {
        if (keyState === 1 && this.allowPlaying === true && !this.hasJumped) {
            this.hasJumped = true;
            this.velocity = 0;
            this.velocity += this.upForce;
            this.playSound(this.jumpSound);
        }

        if (keyState === 0) {
            this.hasJumped = false;
        }
    };

    startPlaying = () => {
        this.allowPlaying = true;
        this.hasJumped = false;
    };

    stopPlaying = () => {
        this.allowPlaying = false;
        this.hasJumped = false;
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
