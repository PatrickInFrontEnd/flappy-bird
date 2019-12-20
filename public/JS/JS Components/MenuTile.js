import Vector from "./vector.js";

class MenuTile extends Vector {
    constructor(sprite, width, height) {
        super();
        this.image = sprite;
        this.width = width;
        this.height = height;
    }

    showTile = (ctx, i = 0) => {
        if (i < 10) ctx.globalAlpha = `0.0${i}`;
        else if (i < 100) ctx.globalAlpha = `0.${i}`;
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

        if (i > 100) {
            ctx.globalAlpha = 1;
            return;
        }
        i += 1;
        requestAnimationFrame(() => {
            this.showTile(ctx, i);
        });
    };

    setupCoordinates = (x, y) => {
        super.setupCoordinates(x, y);
    };
}
export { MenuTile };
