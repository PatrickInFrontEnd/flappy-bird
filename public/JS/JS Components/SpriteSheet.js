import { createSprite } from "./spritesFunctions.js";

class SpriteSheet_Generator {
    constructor() {
        this.spritesSheet = new Map();
    }

    addSprite = name => {
        this.spritesSheet.set(name, createSprite(name));
    };

    addSprites = (...names) => {
        names.forEach(name => this.addSprite(name));
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

    getAllSprites = () => {
        const spritesArr = this.spritesSheet.keys();
        const sprites = [];

        for (let key of spritesArr) {
            sprites.push(this.getSprite(key));
        }

        return sprites;
    };
}
export default SpriteSheet_Generator;
