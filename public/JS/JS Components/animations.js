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

function alphaAnimation(type, ctx, drawCallback, iterator) {
    let i = iterator;
    if (type === "in") {
        if (iterator === undefined) i = 0;

        if (i <= 100) {
            const ctxAlpha = formatToAlpha(i);
            ctx.globalAlpha = ctxAlpha;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            drawCallback(ctx);
            i++;
            requestAnimationFrame(() => {
                alphaAnimation("in", ctx, drawCallback, i);
            });
        } else {
            ctx.globalAlpha = 1;
            return;
        }
    } else if (type === "out") {
        if (iterator === undefined) i = 100;
        if (i >= 0) {
            const ctxAlpha = formatToAlpha(i);
            ctx.globalAlpha = ctxAlpha;
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            drawCallback(ctx);
            i--;
            requestAnimationFrame(() => {
                alphaAnimation("out", ctx, drawCallback, i);
            });
        } else {
            ctx.globalAlpha = 1;
            return;
        }
    } else {
        console.warn(
            "There are two types of animation - 'in' and 'out'. Neither of them given."
        );
    }
}

function formatToAlpha(val) {
    let value;
    if (val < 10) value = `0.0${val}`;
    else if (val >= 10 && val < 100) value = `0.${val}`;
    else value = `1`;

    return value;
}

export { createAnimation, alphaAnimation };
