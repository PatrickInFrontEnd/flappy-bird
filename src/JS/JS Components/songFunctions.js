async function createSound(src, volume) {
    const sound = new Audio(src);

    return new Promise((res) => {
        sound.addEventListener("canplaythrough", () => {
            res(sound);
        });
        if (volume) sound.volume = volume;
    });
}

export { createSound };
