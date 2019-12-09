export default class Pipe {
    constructor(ctx) {
        this.ctx = ctx;
        this.width = 100;
        this.height =
            (Math.random() * (this.ctx.canvas.height / 2) + 100) %
            (this.ctx.canvas.height / 2 - 50);
        if (this.height < 50) this.height = 50;
        this.x = this.ctx.canvas.width;
        this.y = 0;
    }

    drawUpperPipe() {
        this.ctx.fillStyle = "#0f0";
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    updatePipe = () => {
        this.ctx.clearRect(this.x, this.y, this.width + 1, this.height + 1);
        this.x -= 3;
        this.drawUpperPipe();
        requestAnimationFrame(this.updatePipe);
    };
}
