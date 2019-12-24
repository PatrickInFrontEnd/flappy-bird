import Game_Engine from "../JS Components/CanvasService.js";
import { entitySpritesURL, bgSpritesURL } from "../JS Components/constants.js";
import {
    getInterfaceData,
    getSpritesData,
    createImage
} from "../JS Components/spritesFunctions.js";

const d = document;
const canvas = d.querySelector("#app");

const assets = initGame();

const app = new Game_Engine(canvas);

window.app = app;



/* canvas.addEventListener("click", () => {
    if (app.allowPlaying === false) {
        app.startDrawing();
    }
}); */

function initGame() {
    window.addEventListener("load", () => {
        const assets =
            Promise.all([
                createImage(bgSpritesURL),
                createImage(entitySpritesURL),
                getSpritesData(),
                getInterfaceData(),
            ]);
    })
}