import { createSprite } from "./spritesFunctions.js";

class SpriteSheet_Generator {
    constructor() {
        this.spritesSheet = new Map();
    }

    addSprite = (name, typeOfSprite) => {
        this.spritesSheet.set(name, createSprite(name, typeOfSprite));
    };

    addSprites = (typeOfSprite, ...names) => {
        names.forEach(name => this.addSprite(name, typeOfSprite));
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
        const names = this.spritesSheet.keys();
        const sprites = [];

        for (let name of names) {
            sprites.push(this.getSprite(name));
        }

        return sprites;
    };
}
export default SpriteSheet_Generator;
