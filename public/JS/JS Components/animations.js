function createAnimation(spriteFrames, framesLength, counter) {
    const maxNumFrames = spriteFrames.length;

    const frameIndex = Math.floor(counter / framesLength) % maxNumFrames;

    return spriteFrames[frameIndex];
}

export { createAnimation };
