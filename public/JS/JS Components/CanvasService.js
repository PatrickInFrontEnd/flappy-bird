import Pipe from "./pipes_generator.js";

class CanvasService {
    constructor(canvas) {
        this.canvas = canvas;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;
        this.ctx = this.canvas.getContext("2d");

        this.pipeArray = [];

        this.pipe = new Pipe(this.ctx);
    }

    draw = () => {
        this.pipe.updatePipe();
        //requestAnimationFrame(this.draw);
    };
}

export default CanvasService;
