import Pipe from "./Pipe.js";

export default class Pipe_Generator {
    constructor(ctx, speed) {
        this.ctx = ctx;
        this.ch = this.ctx.canvas.height;
        this.cw = this.ctx.canvas.width;
        this.__SPEED = speed;
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

    drawPipes({ upperPipeSprite, bottomPipeSprite }) {
        const { upperPipeColumn, upperPipeSlot } = upperPipeSprite;
        const { bottomPipeColumn, bottomPipeSlot } = bottomPipeSprite;

        const __VERTICAL_SCALE_OF_SLOTS = 1.5;

        let upperSlotPosX = this.upperPipe.x - 2,
            upperSlotPosY =
                this.upperPipe.h -
                upperPipeSlot.height * __VERTICAL_SCALE_OF_SLOTS,
            upperSlotWidth = this.upperPipe.w + 4,
            upperSlotHeight = upperPipeSlot.height * __VERTICAL_SCALE_OF_SLOTS;

        let bottomSlotPosX = this.bottomPipe.x - 2,
            bottomSlotPosY = this.bottomPipe.y,
            bottomSlotWidth = this.bottomPipe.w + 4,
            bottomSlotHeight =
                bottomPipeSlot.height * __VERTICAL_SCALE_OF_SLOTS;

        this.ctx.drawImage(
            upperPipeColumn,
            this.upperPipe.x,
            this.upperPipe.y,
            this.upperPipe.w,
            this.upperPipe.h
        );
        this.ctx.drawImage(
            upperPipeSlot,
            upperSlotPosX,
            upperSlotPosY,
            upperSlotWidth,
            upperSlotHeight
        );

        this.ctx.drawImage(
            bottomPipeColumn,
            this.bottomPipe.x,
            this.bottomPipe.y,
            this.bottomPipe.w,
            this.bottomPipe.h
        );
        this.ctx.drawImage(
            bottomPipeSlot,
            bottomSlotPosX,
            bottomSlotPosY,
            bottomSlotWidth,
            bottomSlotHeight
        );
    }

    animatePipes = () => {
        this.upperPipe.x -= this.__SPEED;
        this.bottomPipe.x -= this.__SPEED;
    };

    increaseSpeed = () => {
        this.__SPEED++;
    };

    updatePipes = ({ upperPipeSprite, bottomPipeSprite }, speed) => {
        if (speed && this.__SPEED !== speed) this.__SPEED = speed;
        this.animatePipes();
        this.drawPipes({ upperPipeSprite, bottomPipeSprite });
    };
}
