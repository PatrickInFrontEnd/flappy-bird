import Vector from "./vector.js";

class Pipe extends Vector {
    constructor(x, y, width, height) {
        super(x, y);
        this.w = width;
        this.h = height;
    }
}

export default Pipe;
