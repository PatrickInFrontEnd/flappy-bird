class Vector {
    constructor(x, y) {
        this.setupCoordinates(x, y);
    }

    setupCoordinates(x, y) {
        this.x = Number(x);
        this.y = Number(y);
    }
}

export default Vector;
