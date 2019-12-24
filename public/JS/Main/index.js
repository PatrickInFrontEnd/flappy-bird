import Game_Engine from "../JS Components/CanvasService.js";
import { entitySpritesURL, bgSpritesURL } from "../JS Components/constants.js";
import {
    getInterfaceData,
    getSpritesData,
    createImage
} from "../JS Components/spritesFunctions.js";
import { createSound } from "../JS Components/songFunctions.js";

const d = document;
const canvas = d.querySelector("#app");
let app;
/* canvas.addEventListener("click", () => {
    if (app.allowPlaying === false) {
        app.startDrawing();
    }
}); */

window.addEventListener("load", loadAssets);

async function loadAssets() {
    const [
        bgSpriteImg,
        entitySpriteImg,
        spritesJSON,
        interfaceJSON,
        songMusic,
        collidedSound,
        gameOverSound,
        jumpSound,
        pauseSound,
        playSound
    ] = await Promise.all([
        createImage(bgSpritesURL),
        createImage(entitySpritesURL),
        getSpritesData(),
        getInterfaceData(),
        createSound("song", 0.6, "music"),
        createSound("collided", 0.8, "sounds", ".flac"),
        createSound("gameover", 0.6, "sounds"),
        createSound("jump", 0.5, "sounds"),
        createSound("pause", 0.6, "sounds"),
        createSound("play", 0.6, "sounds")
    ]);

    /* canvas.addEventListener("click", () => {
        jumpSound.play();
    }); */

    const spritesData = { bgSpriteImg, entitySpriteImg, spritesJSON };
    const sounds = [
        ["song", songMusic],
        ["collided", collidedSound],
        ["gameover", gameOverSound],
        ["jump", jumpSound],
        ["pause", pauseSound],
        ["play", playSound]
    ];

    app = new Game_Engine(canvas, spritesData, sounds, interfaceJSON);
}
