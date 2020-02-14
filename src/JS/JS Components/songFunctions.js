const URL = "./assets/gameSounds";
const URLSong = "./assets/music";

/* async function createSound(name, volume, type, ext) {
    const url = type === "music" ? URLSong : URL;
    const sound = new Audio(`${url}/${name}${ext ? ext : ".mp3"}`);

    return new Promise(res => {
        sound.addEventListener("canplaythrough", () => {
            res(sound);
        });
        if (volume) sound.volume = volume;
    });
} */

async function createSound(src, volume) {

    const sound = new Audio(src);

    return new Promise(res => {
        sound.addEventListener("canplaythrough", () => {
            res(sound);
        });
        if (volume) sound.volume = volume;
    });
}

export { createSound };
