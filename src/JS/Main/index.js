import createGame from "./utils/loadAssets";
import headerAnimation from "./utils/animations";
import "../../main.css";

window.addEventListener("load", async () => {
    headerAnimation();
    await createGame();
});
