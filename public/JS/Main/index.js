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
        playSound,
        menuClickSound
    ] = await Promise.all([
        createImage(bgSpritesURL),
        createImage(entitySpritesURL),
        getSpritesData(),
        getInterfaceData(),
        createSound("song", 0.2, "music"),
        createSound("collided", 0.4, "sounds", ".flac"),
        createSound("gameover", 0.6, "sounds"),
        createSound("jump", 1.0, "sounds"),
        createSound("pause", 1, "sounds"),
        createSound("play", 1, "sounds"),
        createSound("menuClick", 0.8, "sounds")
    ]);

    const spritesData = { bgSpriteImg, entitySpriteImg, spritesJSON };
    const sounds = [
        ["song", songMusic],
        ["collided", collidedSound],
        ["gameover", gameOverSound],
        ["jump", jumpSound],
        ["pause", pauseSound],
        ["play", playSound],
        ["menuClick", menuClickSound]
    ];

    app = new Game_Engine(canvas, spritesData, sounds, interfaceJSON);
    window.app = app;
}
