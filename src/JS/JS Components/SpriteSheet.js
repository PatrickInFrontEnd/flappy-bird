import { createSprite } from "./spritesFunctions.js";

class SpriteSheet_Generator {
    constructor({ bgSpriteImg, entitySpriteImg, spritesJSON }) {
        this.spritesSheet = new Map();

        this.images = {
            entity: entitySpriteImg,
            background: bgSpriteImg,
        };
        this.spriteJSON = spritesJSON;
    }

    addSprite = (name, type) => {
        if (this.spritesSheet.has(name)) return;
        const img =
            type === "entity" ? this.images.entity : this.images.background;
        this.spritesSheet.set(name, createSprite(name, img, this.spriteJSON));
    };

    addSprites = (typeOfSprite, ...names) => {
        names.forEach((name) => this.addSprite(name, typeOfSprite));
    };

    getSprite = (name) => {
        try {
            if (!this.spritesSheet.has(name)) {
                throw new Error("Incorrect name typed: " + name);
            }

            return this.spritesSheet.get(name);
        } catch (err) {
            console.error("Something went wrong. ", err);
            throw err;
        }
    };

    getAllSprites = (...names) => {
        const sprites = names.map((name) => {
            return this.getSprite(name);
        });

        return sprites;
    };
}
export default SpriteSheet_Generator;
