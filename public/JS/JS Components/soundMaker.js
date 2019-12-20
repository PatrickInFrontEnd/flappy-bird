import { createSound } from "./songFunctions.js";

class SoundMaker {
    constructor() {
        this.sounds = new Map();
    }

    addSound = (nameOfSong, volume, type, ext) => {
        try {
            this.sounds.set(
                nameOfSong,
                createSound(nameOfSong, volume, type, ext)
            );
        } catch (error) {
            console.error("Something went wron with your Sound Maker:", error);
        }
    };

    getSound = async name => {
        try {
            if (!this.sounds.has(name)) throw Error("Name is incorrect.");
            return await this.sounds.get(name);
        } catch (error) {
            console.error("Something went wron with your Sound Maker:", error);
        }
    };

    playSound = sound => {
        sound.currentTime = 0;
        sound.play();
    };

    stopSound = sound => {
        sound.currentTime = 0;
        sound.pause();
    }
}
export { SoundMaker };
