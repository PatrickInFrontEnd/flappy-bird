class KeyService {
    constructor() {
        this.mappedKeys = new Map();
        this.keyState = new Map();

        this.clickMap = new Map();
        this.clickState = new Map();
    }

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
