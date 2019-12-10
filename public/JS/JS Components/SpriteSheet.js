import { createSprite } from "./spritesFunctions.js";

class SpriteSheet_Generator {
    constructor() {
        this.spritesSheet = new Map();
    }

    addSprite = name => {
        this.spritesSheet.set(name, createSprite(name));
    };

    getSprite = async name => {
        try {
            if (!this.spritesSheet.has(name))
                throw Error("Incorrect name typed: " + name);

            return this.spritesSheet.get(name);
        } catch (err) {
            console.error("Something went wrong. ", err);
        }
    };
}
export default SpriteSheet_Generator;
