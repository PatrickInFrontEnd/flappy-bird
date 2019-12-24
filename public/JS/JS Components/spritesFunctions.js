async function createSprite(nameOfSprite, spritesImage,spritesJSON) {
    try {

        const image = spritesImage;

        if (!image) throw Error("Image couldn't be loaded.");

        const spriteData = spritesJSON;
        const bufferData = spriteData[nameOfSprite];

        if (!bufferData) throw Error("Wrong name of sprite: " + nameOfSprite);

        if (!bufferData.frames) {
            const buffer = createBuffer(image, bufferData); //NOTE:(img , sx,sy,sw,sh , dx,dy,dw,dh )

            return buffer;
        } else {
            const frames = bufferData.frames.map(coordinates =>
                createBuffer(image, coordinates)
            );
            return frames;
        }
    } catch (error) {
        console.error("Something went wrong ", error);
    }
}

function createBuffer(image, { sx, sy, width: imgW, height: imgH }) {
    const buffer = document.createElement("canvas");
    const bufferCtx = buffer.getContext("2d");

    buffer.width = imgW;
    buffer.height = imgH;

    bufferCtx.drawImage(image, sx, sy, imgW, imgH, 0, 0, imgW, imgH);

    return buffer;
}

async function getSpritesData() {
    const URL = "./img/sprites.json";

    return fetch(URL)
        .then(res => {
            if (!res.ok)
                throw Error(`Response from ${URL} failed, ${res.statusText}`);
            return res.json();
        })
        .catch(err => {
            console.error(`Something went wrong. `, err);
        });
}

async function getMenuCoordinates() {
    const URL = "./img/menuCords.json";

    return fetch(URL)
        .then(res => {
            if (!res.ok)
                throw Error(`Response from ${URL} failed, ${res.statusText}`);
            return res.json();
        })
        .catch(err => {
            console.error(`Something went wrong. `, err);
        });
}

async function createImage(filename) {
    const image = new Image();

    return new Promise(res => {
        image.addEventListener("load", () => {
            res(image);
        });
        image.src = filename;
    });
}

export { createSprite, getMenuCoordinates as getInterfaceData };
