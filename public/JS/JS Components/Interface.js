import SpriteSheet_Generator from "./SpriteSheet.js";
import { MenuTile } from "./MenuTile.js";
import { alphaAnimation } from "./animations.js";

class Game_Menu {
    constructor(
        ctx,
        { bgSpriteImg, entitySpriteImg, spritesJSON },
        interfaceData
    ) {
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;

        this.interfaceData = interfaceData;

        this.spritesGenerator = new SpriteSheet_Generator({
            bgSpriteImg,
            entitySpriteImg,
            spritesJSON
        });

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

    addMenuTiles = () => {
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
        ] = this.spritesGenerator.getAllSprites(this.names);

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
            const { width, height } = this.interfaceData[spriteName];
            this.addTile(sprites[spriteName], spriteName, width, height);
            this.menuTiles.get(spriteName).setupCoordinates(0, 0);
        });

        this.setPositionsOfMenuTiles(this.interfaceData);
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

        pauseIcon.setupCoordinates(spritesData["scoreBoard"].width + 10, 0);
        playIcon.setupCoordinates(pauseIcon.x, pauseIcon.y);
        playButton.setupCoordinates(
            halfW - playButton.width / 2,
            halfH - playButton.height / 2
        );
        menuIcon.setupCoordinates(
            halfW - menuIcon.width / 2,
            halfH + playButton.height + 50
        );
        getReadyTitle.setupCoordinates(halfW - getReadyTitle.width / 2, 100);
        gameOverTitle.setupCoordinates(halfW - gameOverTitle.width / 2, 175);
        flappyBirdTitle.setupCoordinates(
            halfW - flappyBirdTitle.width / 2,
            100
        );
        tapBoardIcon.setupCoordinates(
            halfW - tapBoardIcon.width / 2,
            halfH - tapBoardIcon.width / 2
        );
        scoreBoard.setupCoordinates(0, 0);
        this.showMenu(this.ctx);
        //TODO CREATE INTERFACE ANIMATIONS, CREATE LOGIC FOR BEHAVIOUR OF MENU TILES
    };

    addTile = (sprite, name, w, h) => {
        this.menuTiles.set(name, new MenuTile(sprite, w, h));
    };

    drawGameMenu = ctx => {
        const tiles = ["menuIcon", "playButton", "flappyBirdTitle"].map(
            name => {
                const tile = this.menuTiles.get(name);
                return tile;
            }
        );
        tiles.forEach(tile => tile.drawTile(ctx));
    };

    showMenu = ctx => {
        alphaAnimation("in", ctx, this.drawGameMenu);
    };

    hideMenu = ctx => {
        alphaAnimation("out", ctx, this.drawGameMenu);
    };

    addCallbackOnTile = (name, callback) => {
        const tile = this.menuTiles.get(name);
        tile.addCallback(callback);
    };
}

export default Game_Menu;
