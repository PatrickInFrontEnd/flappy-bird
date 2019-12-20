import SpriteSheet_Generator from "./SpriteSheet.js";
import { getInterfaceData } from "./spritesFunctions.js";
import { MenuTile } from "./MenuTile.js";

class Game_Menu {
    constructor(ctx) {
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;

        this.spritesGenerator = new SpriteSheet_Generator();

        this.names = [
            "menuIcon",
            "pauseIcon",
            "playIcon",
            "playButton",
            "getReadyTitle",
            "gameOverTitle",
            "flappyBirdTitle",
            "tapBoardIcon",
            "scoreBoard"
        ];

        this.menuTiles = new Map();

        this.addMenuTiles();
    }

    addMenuTiles = async () => {
        const menuSpritesData = await getInterfaceData();

        this.spritesGenerator.addSprites("menuSprites", ...this.names);

        const [
            menuIcon,
            pauseIcon,
            playIcon,
            playButton,
            getReadyTitle,
            gameOverTitle,
            flappyBirdTitle,
            tapBoardIcon,
            scoreBoard
        ] = await Promise.all(this.spritesGenerator.getAllSprites());

        const sprites = {
            menuIcon,
            pauseIcon,
            playIcon,
            playButton,
            getReadyTitle,
            gameOverTitle,
            flappyBirdTitle,
            tapBoardIcon,
            scoreBoard
        };

        this.names.forEach(spriteName => {
            const { width, height } = menuSpritesData[spriteName];
            this.addTile(sprites[spriteName], spriteName, width, height);
            this.menuTiles.get(spriteName).setupCoordinates(0, 0);
        });
        this.setPositionsOfMenuTiles(menuSpritesData);
    };

    setPositionsOfMenuTiles = spritesData => {
        const [
            menuIcon,
            pauseIcon,
            playIcon,
            playButton,
            getReadyTitle,
            gameOverTitle,
            flappyBirdTitle,
            tapBoardIcon,
            scoreBoard
        ] = this.names.map(name => this.menuTiles.get(name));

        //NOTE: Setting up x and y coordinates to draw it at ctx
        const halfW = this.cw / 2;
        const halfH = this.ch / 2;
        menuIcon.setupCoordinates(
            halfW - menuIcon.width / 2,
            halfH - menuIcon.height / 2
        );
        pauseIcon.setupCoordinates(spritesData["scoreBoard"].width + 10, 0);
        playIcon.setupCoordinates(pauseIcon.x, pauseIcon.y);
        playButton.setupCoordinates(
            halfW - playButton.width / 2,
            halfH + menuIcon.height + 10
        );
        getReadyTitle.setupCoordinates(halfW - getReadyTitle.width / 2, 100);
        gameOverTitle.setupCoordinates(halfW - gameOverTitle.width / 2, 175);
        flappyBirdTitle.setupCoordinates(
            halfW - flappyBirdTitle.width / 2,
            150
        );
        tapBoardIcon.setupCoordinates(
            halfW - tapBoardIcon.width / 2,
            halfH - tapBoardIcon.width / 2
        );
        scoreBoard.setupCoordinates(0, 0);

        this.names.forEach(name => this.menuTiles.get(name).showTile(this.ctx));
        //TODO CREATE INTERFACE ANIMATIONS, CREATE LOGIC FOR BEHAVIOUR OF MENU TILES
    };

    addTile = (sprite, name, w, h) => {
        this.menuTiles.set(name, new MenuTile(sprite, w, h));
    };

    drawMenu = () => {};
}

export default Game_Menu;
