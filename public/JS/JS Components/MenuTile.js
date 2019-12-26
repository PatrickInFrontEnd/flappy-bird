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
        this.callbackElement = undefined;
    }

    //FIXME: create function that will paint menu tiles from 0 opacity to 1 and from 1 to 0 all tiles together (paint tiles for 0.1 opacity, clearRect etc.)
    drawTile = ctx => {
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

    animateHiddenTile = ctx => {
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

    //FIXME: logs 0 infinetely and 100 9 times at showTile
    hideTile = ctx => {
        this.banClick();
        this.animateHiddenTile(ctx);
    };
    showTile = ctx => {
        this.allowClick();
        this.animateHiddenTile(ctx);
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

    addCallback = callback => {
        this.callback = callback;
    };
}
export { MenuTile };
