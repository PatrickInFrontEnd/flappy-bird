const spriteURL = "./img/sprites.png";

async function createSprite(name) {
    try {
        const image = await createImage(spriteURL);

        if (!image) throw Error("Image couldn't be loaded.");

        const spritesData = await getSpritesData();
        const bufferData = spritesData[name];

        if (!bufferData) throw Error("Wrong name of sprite: " + name);

        const buffer = document.createElement("canvas");
        const bufferCtx = buffer.getContext("2d");

        if (!bufferData.frames) {
            const { sx, sy, width: imgW, height: imgH } = bufferData;

            buffer.width = imgW;
            buffer.height = imgH;

            bufferCtx.drawImage(image, sx, sy, imgW, imgH, 0, 0, imgW, imgH); //NOTE:(img , sx,sy,sw,sh , dx,dy,dw,dh )
        } else {
            let buffers = [];
            const { frames } = bufferData;

            buffers = frames.map(({ sx, sy, width: imgW, height: imgH }) => {
                const buffer = document.createElement("canvas");
                const bufferCtx = buffer.getContext("2d");

                buffer.width = imgW;
                buffer.height = imgH;

                bufferCtx.drawImage(
                    image,
                    sx,
                    sy,
                    imgW,
                    imgH,
                    0,
                    0,
                    imgW,
                    imgH
                );
                return buffer;
            });
            return buffers;
        }

        return buffer;
    } catch (error) {
        console.error("Something went wrong ", error);
    }
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

async function createImage(filename) {
    const image = new Image();

    return new Promise(res => {
        image.addEventListener("load", () => {
            res(image);
        });
        image.src = filename;
    });
}

export { createSprite };
