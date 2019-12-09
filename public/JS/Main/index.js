import CanvasService from "../JS Components/CanvasService.js";

const d = document;
const canvas = d.querySelector("#app");

const app = new CanvasService(canvas);

window.app = app;
app.draw();
