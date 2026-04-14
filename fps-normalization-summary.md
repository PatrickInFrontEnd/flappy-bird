# FPS Normalization — What Was Wrong and How It Was Fixed

## The core problem

Your game loop was driven by `requestAnimationFrame` (RAF). Browsers fire RAF **once per monitor refresh** — so on a 60 Hz display the loop ran 60 times per second, on a 144 Hz display 144 times per second, and on a 30 Hz laptop 30 times per second.

Every physics/movement value in the codebase was written as **"change per frame"** with the hidden assumption "one frame = 1/60 s":

| Constant | File | Intent (at 60 Hz) | Actual on 144 Hz |
|---|---|---|---|
| `__GRAVITY = 0.6` | `hero.js:11` | 0.6 px velocity added per 1/60 s | 0.6 px added per 1/144 s → **2.4× stronger gravity** |
| `upForce = -8` | `hero.js:13` | Jump impulse | Same impulse, but reset more often |
| Pipe `__SPEED = 3…6` | `pipes_generator.js:8` | 3 px/frame | 3 px/frame × 144 = 432 px/s vs. the intended 180 px/s |
| Pipe spawn `% 100` | `CanvasService.js:98` | Every 100 frames ≈ 1.67 s | Every 100 frames ≈ 0.69 s |
| Sprite cycle `framesLength = 4` | `animations.js:4` | Wing flap every 4/60 s | Every 4/144 s |

Result: on a high-refresh monitor the bird fell like a stone and pipes flew past; on a low-refresh device it turned into slow motion. **The speed of the game was tied to your monitor's Hz.** That's the bug.

## Why a simple "multiply by delta-time" wasn't enough

The obvious fix is `velocity += GRAVITY * dt`. But that:

1. **Breaks the frame-counter spawn logic.** `countFrame % 100 === 0` only makes sense if countFrame ticks at a known, consistent rate.
2. **Changes gravity compounding.** Euler integration of `v += g; y += v` gives different numerical answers than `v += g·dt; y += v·dt` when `dt` varies — the bird's trajectory drifts.
3. **Risks tunneling.** On a slow frame (tab blur, GC, slow machine) `dt` spikes, the bird moves a huge distance in one step, and it can phase **through** a pipe without a collision being detected.
4. **Retunes every constant.** All your hand-tuned numbers would need new values in px/sec. Easy to get wrong; easy to make it feel different than today.

## What was actually done — fixed-timestep accumulator

The Glenn Fiedler "Fix Your Timestep!" pattern: **decouple simulation from rendering.**

- **Rendering** still runs once per RAF (at whatever rate the monitor prefers — 60, 120, 144, 165 Hz).
- **Simulation** is pinned to a fixed 60 Hz — exactly one tick every 16.667 ms of real wall-clock time, regardless of the display.

The loop keeps a small `accumulator` (milliseconds "owed" to the simulation) and, each RAF frame, drains it in exact 16.667 ms chunks:

```
onRAF(timestamp):
    frameTime = min(timestamp - lastTime, 250ms)   ← clamp for tab blur / GC pauses
    accumulator += frameTime
    while accumulator >= 16.667:
        update()                                   ← physics at exactly 60 Hz
        accumulator -= 16.667
    render()                                       ← draws once per RAF
```

Consequences:
- On **60 Hz**: one RAF → one `update()` → one `render()`. Identical to before.
- On **144 Hz**: five RAFs cover ~35 ms → two updates, five renders. Physics runs at 60 Hz; picture is as smooth as the monitor allows.
- On **30 Hz**: one RAF covers ~33 ms → two updates, one render. Simulation keeps pace.
- On a **tab-blur of 10 seconds**: frameTime is clamped to 250 ms so the loop catches up at most ~15 ticks instead of ~600. No lag spike, no bird teleport.

**All your hand-tuned constants stayed exactly as they were.** `__GRAVITY = 0.6`, `upForce = -8`, `__SPEED = 3`, `countFrame % 100`, `framesLength = 4` — none of the numbers changed. They now deliver the behavior they always meant to, on any display.

## Code changes required

Mostly mechanical:

1. **Separate "mutate state" from "draw pixels."** `bird.update()` used to do both — now `update()` only touches physics and `draw()` only paints. Same split in `Pipe_Generator`.
2. **Replace the old `draw()` recursion in `CanvasService` with three methods:**
   - `loop(timestamp)` — the RAF callback, owns the accumulator.
   - `update()` — physics, collision, scoring, pipe spawning; called 0–N times per loop.
   - `render()` — clear + draw; called exactly once per loop.
3. **Reset the accumulator on pause/resume/reset** so time spent paused isn't "caught up" on resume.
4. **Cancel the pending RAF on pause** so the loop doesn't keep scheduling itself.
5. **Defer the game-over canvas snapshot until after `render()` runs,** so it captures the crash frame rather than the previous one.
6. **Seed `bird.jumpSound` in `play()`** — `update()` used to set it on the first synchronous frame, but now the first `update()` runs asynchronously inside RAF, so the initial `bird.jump(1)` in `play()` needed the sound wired up first. (That was the `Cannot set properties of undefined` error you hit.)

Prerequisite unblock: `.babelrc` referenced `@babel/plugin-proposal-class-properties`, which isn't installed; swapped to `@babel/plugin-transform-class-properties` so Jest actually runs.

## How to verify

- `npm test` → 46/46 passing, including a new `gameLoop.test.js` that proves: ~60 updates per real second whether RAF fires at 60 Hz or 144 Hz; accumulator carries residuals correctly; a 5-second stall is clamped to ≤ 15 catch-up ticks; one render per RAF.
- Manually: set Windows display to 60 Hz, play 20 seconds, count pipes. Switch to 144 Hz, replay, count pipes — should match.

## One-line takeaway

Your constants were "per frame" but your frame rate wasn't fixed. The fix: leave the constants alone, and make the frame rate fixed yourself — tick the simulation at exactly 60 Hz using an accumulator, and let rendering run as fast as the monitor wants.
