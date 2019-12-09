export default class Drawer {
    constructor(deltaT = 1 / 60) {
        let accTime = 0;
        let lastT = 0;

        this.updateProxy = t => {
            accTime += (t - lastT) / 1000;

            if (accTime > 1) accTime = 1;

            while (accTime > deltaT) {
                this.update(deltaT);
                accTime -= deltaT;
            }
            lastT = t;
            this.enqueue();
        };
    }
    enqueue() {
        requestAnimationFrame(this.updateProxy);
    }
    start() {
        this.enqueue();
    }
}
