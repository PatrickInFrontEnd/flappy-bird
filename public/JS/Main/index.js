import Game_Engine from "../JS Components/CanvasService.js";

const d = document;
const canvas = d.querySelector("#app");

const app = new Game_Engine(canvas);

window.app = app;
app.startDrawing();
