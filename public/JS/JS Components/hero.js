import Vector from "./vector.js";
import KeyService from "./KeyService.js";
import { createAnimation } from "./animations.js";

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

        this.jumpSound = undefined;

        this.keyService = new KeyService();

        this.listenToJump();
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

    playSound = sound => {
        sound.currentTime = 0;
        sound.play();
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
        this.keyService.addKeyListener(this.ctx.canvas);
        this.keyService.addMap("Space", this.jump);
        this.keyService.addClickListener(this.ctx.canvas, this.jump);
    };

    jump = keyState => {
        if (keyState && this.allowPlaying === true) {
            this.velocity = 0;
            this.velocity += this.upForce;
            this.playSound(this.jumpSound);
        }
    };

    stopPlaying = () => {
        this.allowPlaying = false;
    };

    startPlaying = () => {
        this.allowPlaying = true;
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
