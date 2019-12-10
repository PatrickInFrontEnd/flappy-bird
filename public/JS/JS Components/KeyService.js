class KeyService {
    constructor() {
        this.mappedKeys = new Map();
        this.keyState = new Map();
    }

    addMap(keycode, callback) {
        this.mappedKeys.set(keycode, callback);
    }

    addListener = elem => {
        ["keydown", "keyup"].forEach(eventName => {
            elem.addEventListener(eventName, this.handleEvent);
        });
    };

    handleEvent = ev => {
        ev.preventDefault();

        const { code } = ev;
        if (!this.mappedKeys.has(code)) {
            return;
        }

        const keyState = ev.type === "keydown" ? 1 : 0;

        if (this.keyState.get(code) === keyState) {
            return;
        }
        this.keyState.set(code, keyState);
        const callback = this.mappedKeys.get(code);
        callback(keyState);
    };
}

export default KeyService;
