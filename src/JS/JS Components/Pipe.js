import Vector from "./vector.js";

class Pipe extends Vector {
    constructor(x, y, width, height) {
        super(x, y);
        this.w = Math.abs(Number(width));
        this.h = Math.abs(Number(height));
    }
}

export default Pipe;
