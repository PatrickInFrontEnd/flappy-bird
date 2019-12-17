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

        //TODO createAnimation generates width and height of bird
        this.ctx.drawImage(
            entitySprites[1], //TODO create animation to operate the bird
            this.x,
            this.y,
            this.width,
            this.height
        );
    };

    update = (entitySprites, frameCounter) => {
        this.width = entitySprites[0].width * 2.5; //TODO refactor this code
        this.height = entitySprites[0].height * 2.5; //TODO refactor this code

        this.velocity += this.__GRAVITY;
        this.y += this.velocity;
        this.checkPosition();
        this.draw(entitySprites, frameCounter);
    };

    checkPosition = () => {
        //TODO Bird now is gonna be a square , refactor this code!
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
        //TODO Bird now is gonna be a square , refactor this code!
        //TODO FIND BETTER SPRITE OF BIRD
        if (
            this.x + this.width < upperPipe.x ||
            this.x > upperPipe.x + upperPipe.w
        ) {
            return false;
        } else {
            if (this.y + this.height >= bottomPipe.y) return true;
            if (this.y <= upperPipe.y + upperPipe.h) return true;

            return false;
        }
    };
}
