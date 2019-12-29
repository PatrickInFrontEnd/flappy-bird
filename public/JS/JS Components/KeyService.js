class KeyService {
    constructor() {
        this.mappedKeys = new Map();
        this.keyState = new Map();

        this.clickMap = new Map();
        this.clickState = new Map();
    }

    addKeyListener = elem => {
        ["keydown", "keyup"].forEach(ev => {
            elem.addEventListener(ev, this.handleEvent);
        });
    };

    removeKeyListener = elem => {
        ["keydown", "keyup"].forEach(ev => {
            elem.removeEventListener(ev, this.handleEvent);
        });
    };

    addKeyMapping = (key, callback) => {
        this.mappedKeys.set(key, callback);
    };

    handleEvent = ev => {
        const { code } = ev;
        if (!this.mappedKeys.has(code)) {
            return;
        }
        ev.preventDefault();

        const keyState = ev.type === "keydown" ? 1 : 0;

        if (this.keyState.get(code) === keyState) {
            return;
        }
        this.keyState.set(code, keyState);
        this.mappedKeys.get(code)(keyState);
    };

    addClickListener = (elem, callback) => {
        this.clickMap.set("mousedown", callback);

        ["mousedown", "mouseup"].forEach(evName => {
            elem.addEventListener(evName, this.handleClickEvent);
        });
    };

    removeClickListener = elem => {
        ["mousedown", "mouseup"].forEach(evName => {
            elem.removeEventListener(evName, this.handleClickEvent);
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
}

export default KeyService;
