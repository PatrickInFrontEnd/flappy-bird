import Vector from "./vector.js";

class MenuTile extends Vector {
    constructor(sprite, width, height) {
        super();
        this.image = sprite;
        this.width = width;
        this.height = height;
    }

    //FIXME: create function that will paint menu tiles from 0 opacity to 1 and from 1 to 0 all tiles together (paint tiles for 0.1 opacity, clearRect etc.)
    showTile = (ctx, i = 0) => {
        if (i < 10) ctx.globalAlpha = `0.0${i}`;
        else if (i < 100 && i > 10) ctx.globalAlpha = `0.${i}`;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

        i++;
        if (i >= 100) {
            ctx.globalAlpha = 1;
            this.hideTile(ctx, i);
            console.log(i);
            return;
        }

        requestAnimationFrame(() => {
            this.showTile(ctx, i);
        });
    };

    //FIXME: logs 0 infinetely and 100 9 times at showTile
    hideTile = (ctx, i = 100) => {
        if (i >= 10) {
            ctx.globalAlpha = `0.${i}`;
        } else if (i < 10) {
            ctx.globalAlpha = `0.0${i}`;
        }
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
        i--;
        if (i <= 0) {
            console.log(i);
            ctx.globalAlpha = 1;
            return;
        }
        if (i > 0) {
            requestAnimationFrame(() => {
                this.hideTile(ctx, i);
            });
        }
    };

    setupCoordinates = (x, y) => {
        super.setupCoordinates(x, y);
    };
}
export { MenuTile };
