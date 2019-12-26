import SpriteSheet_Generator from "./SpriteSheet.js";
import { MenuTile } from "./MenuTile.js";
import { alphaAnimation } from "./animations.js";

class Game_Menu {
    constructor(
        ctx,
        { bgSpriteImg, entitySpriteImg, spritesJSON },
        interfaceData,
        { bgMethod, sprite },
        listener
    ) {
        this.ctx = ctx;
        this.canvas = this.ctx.canvas;
        this.cw = this.canvas.width;
        this.ch = this.canvas.height;

        this.interfaceData = interfaceData;
        this.listenersAreSetUp = false;

        this.spritesGenerator = new SpriteSheet_Generator({
            bgSpriteImg,
            entitySpriteImg,
            spritesJSON
        });

        this.bgLayer = { bgMethod, sprite };

        this.menuTileNames = Array.from(Object.keys(spritesJSON)).filter(
            name => spritesJSON[name].type === "menu"
        );

        this.menuTiles = new Map();

        this.addMenuTiles();
        this.initializeMenu(this.ctx, this.bgLayer, listener);
    }

    addMenuTiles = () => {
        this.spritesGenerator.addSprites("menuSprites", ...this.menuTileNames);

        const [
            scoreBoard,
            menuIcon,
            okayIcon,
            pauseIcon,
            playIcon,
            playButton,
            getReadyTitle,
            gameOverTitle,
            flappyBirdTitle,
            tapBoardIcon
        ] = this.spritesGenerator.getAllSprites(...this.menuTileNames);

        const sprites = {
            scoreBoard,
            menuIcon,
            okayIcon,
            pauseIcon,
            playIcon,
            playButton,
            getReadyTitle,
            gameOverTitle,
            flappyBirdTitle,
            tapBoardIcon
        };

        this.menuTileNames.forEach(spriteName => {
            const { width, height } = this.interfaceData[spriteName];

            this.addTile(sprites[spriteName], spriteName, width, height);
            this.menuTiles.get(spriteName).setupCoordinates(0, 0);
        });

        this.setPositionsOfMenuTiles(this.interfaceData);
    };

    setPositionsOfMenuTiles = spritesData => {
        const [
            scoreBoard,
            menuIcon,
            okayIcon,
            pauseIcon,
            playIcon,
            playButton,
            getReadyTitle,
            gameOverTitle,
            flappyBirdTitle,
            tapBoardIcon
        ] = this.menuTileNames.map(name => this.menuTiles.get(name));

        //NOTE: Setting up x and y coordinates to draw it at ctx
        const halfW = this.cw / 2;
        const halfH = this.ch / 2;

        const setup = [
            [pauseIcon, spritesData["scoreBoard"].width + 10, 0],
            [playIcon, spritesData["scoreBoard"].width + 10, 0],
            [
                playButton,
                halfW - playButton.width / 2,
                halfH - playButton.height / 2
            ],
            [
                menuIcon,
                halfW - menuIcon.width / 2,
                halfH + playButton.height + 50
            ],
            [
                okayIcon,
                halfW - okayIcon.width / 2,
                halfH + playButton.height + 50
            ],
            [getReadyTitle, halfW - getReadyTitle.width / 2, 100],
            [gameOverTitle, halfW - gameOverTitle.width / 2, 100],
            [flappyBirdTitle, halfW - flappyBirdTitle.width / 2, 100],
            [
                tapBoardIcon,
                halfW - tapBoardIcon.width / 2,
                halfH - tapBoardIcon.width / 2
            ],
            [scoreBoard, 0, 0]
        ];

        setup.forEach(([tile, x, y]) => tile.setupCoordinates(x, y));
    };

    addTile = (sprite, name, w, h) => {
        this.menuTiles.set(name, new MenuTile(sprite, w, h));
    };

    drawGameMenu = ctx => {
        //TODO: create callbacks and setup behaviour when clicked on canvas
        ["menuIcon", "playButton", "flappyBirdTitle"].forEach(name => {
            const tile = this.menuTiles.get(name);
            tile.showTile(ctx);
        });
    };

    initializeMenu = (
        ctx = this.ctx,
        { bgMethod, sprite } = this.bgLayer,
        listenToTiles
    ) => {
        alphaAnimation(
            "in",
            ctx,
            ctx => {
                bgMethod(sprite);
                this.drawGameMenu(ctx);
            },
            () => {
                if (this.listenersAreSetUp === false) {
                    listenToTiles();
                    this.listenersAreSetUp = true;
                }
            }
        );
    };

    showMenu = ctx => {
        alphaAnimation("in", ctx, this.drawGameMenu);
    };

    hideMenu = ctx => {
        ["menuIcon", "playButton", "flappyBirdTitle"].forEach(name => {
            const tile = this.menuTiles.get(name);
            tile.hideTile(ctx);
        });
    };

    addCallbackOnTile = (nameOfTile, callback) => {
        const tile = this.menuTiles.get(nameOfTile);
        tile.addCallback(callback);
    };

    showTile = (name, ctx = this.ctx) => {
        const tile = this.menuTiles.get(name);
        tile.showTile(ctx);
    };

    hideTile = (name, ctx = this.ctx) => {
        const tile = this.menuTiles.get(name);
        tile.hideTile(ctx);
    };

    getTile = name => this.menuTiles.get(name);
    // showSubMenu = (lastFrame, ctx) => {};

    showSubMenu = ctx => {
        ["gameOverTitle", "playButton", "okayIcon", "scoreBoard"].forEach(
            name => {
                const tile = this.menuTiles.get(name);
                tile.showTile(ctx);
            }
        );
    };

    hideSubMenu = ctx => {
        ["gameOverTitle", "playButton", "okayIcon", "scoreBoard"].forEach(
            name => {
                const tile = this.menuTiles.get(name);
                tile.hideTile(ctx);
            }
        );
    };

    showReadyTitle = ctx => {
        if (ctx) {
            this.showTile("getReadyTitle", ctx);
        }
        this.showTile("getReadyTitle");
    };

    hideReadyTitle = ctx => {
        if (ctx) {
            this.hideTile("getReadyTitle", ctx);
        }
        this.hideTile("getReadyTitle");
    };
}

export default Game_Menu;
