class KeyService {
    constructor() {
        this.mappedKeys = new Map();
        this.keyState = new Map();

        this.clickMap = new Map();
        this.clickState = new Map();
    }

    addMap(keycode, callback) {
        this.mappedKeys.set(keycode, callback);
    }

    addKeyListener = elem => {
        ["keydown", "keyup"].forEach(eventName => {
            elem.addEventListener(eventName, this.handleKeyEvent);
        });
    };

    addClickListener = (elem, callback) => {
        this.clickMap.set("mousedown", callback);

        ["mousedown", "mouseup"].forEach(evName => {
            elem.addEventListener(evName, this.handleClickEvent);
        });
    };

    handleClickEvent = e => {
        if (!this.clickMap.has("mousedown")) return;

        e.preventDefault();

        const clickState = e.type === "mousedown" ? 1 : 0;

        if (this.clickState.get("mousedown") !== clickState) {
            this.clickState.set("mousedown", clickState);
        }
        const callback = this.clickMap.get("mousedown");

        return callback(this.clickState.get("mousedown"));
    };

    handleKeyEvent = ev => {
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
