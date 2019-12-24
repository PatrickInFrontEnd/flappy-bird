import Game_Engine from "../JS Components/CanvasService.js";
import { alphaAnimation } from "../JS Components/animations.js";

const d = document;
const canvas = d.querySelector("#app");

const app = new Game_Engine(canvas);

window.app = app;

canvas.addEventListener("click", () => {
    if (app.allowPlaying === false) {
        app.startDrawing();
    }
});
