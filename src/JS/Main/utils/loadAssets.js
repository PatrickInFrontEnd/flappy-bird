import Game_Engine from "../../JS Components/CanvasService.js";
import entitiesImage from "../../../img/entity_sprites.png";
import spritesImg from "../../../img/sprites.png";
import songMP3 from "../../../assets/music/song.mp3";
import collidedFLAC from "../../../assets/gameSounds/collided.flac";
import gameoverMP3 from "../../../assets/gameSounds/gameover.mp3";
import jumpMP3 from "../../../assets/gameSounds/jump.mp3";
import pauseMP3 from "../../../assets/gameSounds/pause.mp3";
import playMP3 from "../../../assets/gameSounds/play.mp3";
import menuClickMP3 from "../../../assets/gameSounds/menuClick.mp3";
import spritesJSON from "../../../JSON/sprites.json";
import interfaceJSON from "../../../JSON/menuCords.json";
import { createImage } from "../../JS Components/spritesFunctions.js";
import { createSound } from "../../JS Components/songFunctions.js";

const canvas = document.querySelector("#app");

async function createGame() {
    const [
        bgSpriteImg,
        entitySpriteImg,
        songMusic,
        collidedSound,
        gameOverSound,
        jumpSound,
        pauseSound,
        playSound,
        menuClickSound,
    ] = await Promise.all([
        createImage(spritesImg),
        createImage(entitiesImage),
        createSound(songMP3, 0.2),
        createSound(collidedFLAC, 0.4),
        createSound(gameoverMP3, 0.6),
        createSound(jumpMP3, 1.0),
        createSound(pauseMP3, 1.0),
        createSound(playMP3, 1.0),
        createSound(menuClickMP3, 0.8),
    ]);

    const spritesData = { bgSpriteImg, entitySpriteImg, spritesJSON };
    const sounds = [
        ["song", songMusic],
        ["collided", collidedSound],
        ["gameover", gameOverSound],
        ["jump", jumpSound],
        ["pause", pauseSound],
        ["play", playSound],
        ["menuClick", menuClickSound],
    ];

    return new Game_Engine(canvas, spritesData, sounds, interfaceJSON);
}

export default createGame;
