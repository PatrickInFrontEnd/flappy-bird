describe("Fixed-timestep loop accumulator", () => {
    const FIXED_TIMESTEP = 1000 / 60;
    const MAX_FRAME_TIME = 250;

    const makeHarness = () => {
        const state = {
            lastTime: undefined,
            accumulator: 0,
            __FIXED_TIMESTEP: FIXED_TIMESTEP,
            __MAX_FRAME_TIME: MAX_FRAME_TIME,
            allowPlaying: true,
            updateCalls: 0,
            renderCalls: 0,
        };
        state.update = () => {
            state.updateCalls++;
        };
        state.render = () => {
            state.renderCalls++;
        };
        state.loop = (timestamp) => {
            if (state.lastTime === undefined) state.lastTime = timestamp;
            let frameTime = timestamp - state.lastTime;
            if (frameTime > state.__MAX_FRAME_TIME)
                frameTime = state.__MAX_FRAME_TIME;
            state.lastTime = timestamp;
            state.accumulator += frameTime;
            while (state.accumulator >= state.__FIXED_TIMESTEP) {
                state.update();
                state.accumulator -= state.__FIXED_TIMESTEP;
                if (state.allowPlaying === false) break;
            }
            state.render();
        };
        return state;
    };

    test("runs ~60 updates per real second regardless of RAF frame rate (60Hz)", () => {
        const s = makeHarness();
        const frameDelta = 1000 / 60;
        for (let i = 0; i <= 600; i++) s.loop(i * frameDelta);
        expect(s.updateCalls).toBeGreaterThanOrEqual(599);
        expect(s.updateCalls).toBeLessThanOrEqual(600);
    });

    test("runs ~60 updates per real second regardless of RAF frame rate (144Hz)", () => {
        const s = makeHarness();
        const frameDelta = 1000 / 144;
        const frames = 1440;
        for (let i = 0; i <= frames; i++) s.loop(i * frameDelta);
        expect(s.updateCalls).toBeGreaterThanOrEqual(599);
        expect(s.updateCalls).toBeLessThanOrEqual(600);
    });

    test("runs 0 updates under one timestep and 1 update just above", () => {
        const s1 = makeHarness();
        s1.loop(0);
        s1.loop(16);
        expect(s1.updateCalls).toBe(0);

        const s2 = makeHarness();
        s2.loop(0);
        s2.loop(17);
        expect(s2.updateCalls).toBe(1);
    });

    test("carries residual accumulator across frames", () => {
        const s = makeHarness();
        s.loop(0);
        s.loop(10);
        s.loop(20);
        expect(s.updateCalls).toBe(1);
    });

    test("clamps huge frame gap to MAX_FRAME_TIME (spiral-of-death guard)", () => {
        const s = makeHarness();
        s.loop(0);
        s.loop(5000);
        expect(s.updateCalls).toBeLessThanOrEqual(
            Math.ceil(MAX_FRAME_TIME / FIXED_TIMESTEP)
        );
        expect(s.updateCalls).toBeLessThan(60);
    });

    test("render is called exactly once per loop invocation", () => {
        const s = makeHarness();
        s.loop(0);
        s.loop(500);
        s.loop(510);
        s.loop(520);
        expect(s.renderCalls).toBe(4);
    });

    test("breaks out of tick loop when allowPlaying flips to false", () => {
        const s = makeHarness();
        s.update = () => {
            s.updateCalls++;
            if (s.updateCalls === 3) s.allowPlaying = false;
        };
        s.loop(0);
        s.loop(1000);
        expect(s.updateCalls).toBe(3);
    });
});
