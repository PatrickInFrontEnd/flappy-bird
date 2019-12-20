function createAnimation(spriteFrames, framesLength, counter) {
    const maxNumFrames = spriteFrames.length;

    const frameIndex = Math.floor(counter / framesLength) % maxNumFrames;

    const frame = spriteFrames[frameIndex];

    return frame;
}

function linearAnimation() {
    //TODO
    //Higher order function frame-index, frameX > destination point ? x-- : x++; etc.
}

export { createAnimation };
