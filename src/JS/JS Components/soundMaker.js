class SoundMaker {
    constructor() {
        this.sounds = new Map();
    }

    addSound = (nameOfSong, sound, volume) => {
        try {
            if (!sound)
                throw Error(
                    "U have to put a sound in arguments list no one given."
                );
            if (volume) sound.volume = volume;
            this.sounds.set(nameOfSong, sound);
        } catch (error) {
            console.error("Something went wrong with your Sound Maker:", error);
        }
    };

    getSound = name => {
        try {
            if (!this.sounds.has(name))
                throw Error(`Name '${name}' is incorrect.`);
            return this.sounds.get(name);
        } catch (error) {
            console.error("Something went wrong with your Sound Maker:", error);
        }
    };

    playSound = sound => {
        sound.currentTime = 0;
        sound.play();
    };

    stopSound = sound => {
        sound.currentTime = 0;
        sound.pause();
    };
}
export { SoundMaker };
