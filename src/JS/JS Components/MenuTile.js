import Vector from "./vector.js";

class MenuTile extends Vector {
    constructor(sprite, width, height) {
        super();
        this.image = sprite;
        this.width = width;
        this.height = height;
        this.isHidden = true;
        this.isClicked = false;
        this.callback = undefined;
    }

    drawTile = (ctx) => {
        if (!this.isHidden) {
            ctx.drawImage(
                this.image,
                0,
                0,
                this.image.width,
                this.image.height,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    };

    animateHiddenTile = (ctx) => {
        ctx.drawImage(
            this.image,
            0,
            0,
            this.image.width,
            this.image.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    };

    hideTile = (ctx) => {
        this.banClick();
        this.animateHiddenTile(ctx);
    };
    showTile = (ctx) => {
        this.allowClick();
        this.drawTile(ctx);
    };

    allowClick = () => {
        this.isHidden = false;
    };
    banClick = () => {
        this.isHidden = true;
    };

    setupCoordinates = (x, y) => {
        super.setupCoordinates(x, y);
    };

    addCallback = (callback) => {
        this.callback = callback;
    };
}
export { MenuTile };
