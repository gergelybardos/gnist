# Gnist

![npm version](https://img.shields.io/npm/v/%40gergelybardos%2Fgnist)
![node](https://img.shields.io/badge/node-%3E=20.0.0-green)
![license](https://img.shields.io/npm/l/%40gergelybardos%2Fgnist)

> **⚠️ Important:** This project is currently in early development. APIs are not stable yet, and breaking changes should be expected.

## Table of Contents

- [About Gnist](#about-gnist)
- [Live Showcase](#live-showcase)
- [Requirements](#requirements)
- [Installation](#installation)
- [Basic Example](#basic-example)
- [Sandbox](#sandbox)
- [Core Features](#core-features)
- [Benchmarks](#benchmarks) 
- [Documentation](#documentation)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

## About Gnist

Gnist is a lightweight 2D particle simulation engine. Built for real-time particle effects rather than physically accurate simulations, it uses a simplified kinematic model that prioritizes performance. Particles bypass mass and momentum calculations; instead, forces directly influence velocity.

Gnist performs particle simulations on a single CPU thread. Its performance naturally differs from that of GPU-based particle systems. See [Benchmarks](#benchmarks).

**Zero-dependency**

Gnist is written in vanilla JavaScript with no external runtime dependencies. TypeScript support is provided through declaration files.

**Renderer-agnostic**

The engine decouples simulation from timing and rendering loops, exposing raw state data that can be rendered with Canvas 2D, WebGL, or any custom rendering system. You can even use Gnist directly on web pages and render particles as HTML elements such as `<div>` or `<img>` tags.

Gnist handles particle behavior and lifecycle, while rendering advanced visual effects, such as glow and distortion, remains outside its scope and up to the renderer.

**Developer-friendly API**

Gnist provides an intuitive, object-oriented, configuration-driven API. Particle data can also be exported as GPU-friendly flat typed arrays for efficient rendering.

## Live Showcase

[Explore the demos](https://gergelybardos.github.io/gnist/showcase/index.html) to see Gnist in action.

## Requirements

To install and integrate the NPM package into your own project, your environment should support:

- [Node.js](https://nodejs.org/): >=20.0.0
- [npm](https://www.npmjs.com/): >=9.6.4

## Installation

```bash
npm i @gergelybardos/gnist
```

> **💡 Note:** Gnist is distributed as native ECMAScript Modules (ESM) with no build step, preserving a fully readable source in `node_modules` and enabling consumer bundlers to optimize tree-shaking and minification.

## Basic Example

Gnist is renderer-agnostic; the client is responsible for implementing the main update loop and rendering. The example below demonstrates the minimal setup required to run Gnist with Canvas 2D rendering.

> **⚠️ Important:** This example assumes an existing project with module resolution provided by a build tool. If you are starting from scratch, check out the [How-To Guides](https://gergelybardos.github.io/gnist/guides/index.html) first.

First, create an HTML page with a canvas and load the JavaScript entry point.

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <body>
    <canvas id="canvas" width="800" height="600"></canvas>
    <script type="module" src="main.js"></script>
  </body>
</html>
```

The next step is to create the main loop, which updates the elapsed time and schedules the next frame.

```javascript
// main.js
// TODO: Import Gnist classes

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// TODO: Initialize Gnist and an emitter

let lastTime = performance.now();

function loop(currentTime) {
    requestAnimationFrame(loop);

    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // TODO: Update Gnist and render particles
}
requestAnimationFrame(loop);
```

Finally, implement the simulation by importing Gnist, creating an emitter, updating the engine on each frame, and adding the rendering logic.

The complete implementation looks like this:

```javascript
// main.js
// 1. Import Gnist classes
import { Gnist, PointEmitter } from '@gergelybardos/gnist';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 2. Initialize Gnist and an emitter
const engine = new Gnist();
const emitter = new PointEmitter({
    x: canvas.width / 2,
    y: canvas.height / 2,
    particlesPerSecond: 100,
    particleBlueprint: {
        color: {r: 255, g: 0, b: 0},
        lifespan: [1, 3],
        speed: [15, 150],
        direction: [0, Math.PI * 2],
    }
});
engine.addEmitter(emitter);

let lastTime = performance.now();

function loop(currentTime) {
    requestAnimationFrame(loop);

    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // 3. Update Gnist
    engine.update(dt);

    // 4. Render particles

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const particles = engine.particles;
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const { r, g, b } = p.color;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }
}
requestAnimationFrame(loop);
```

This is a minimal example; real applications typically extend it with additional rendering and control logic.

## Sandbox

The repository includes a sandbox for experimenting with Gnist. It is intended as a development and demo tool and is not included in the npm package.

To run the sandbox locally:

```bash
npm install
npm run dev
```

By default, the sandbox uses WebGL2 rendering. Use `npm run dev:canvas` for the Canvas 2D version.

For additional development scripts, see [Contributing Guide](CONTRIBUTING.md).

## Core Features

- **Particle emission:** Emit particles from points, lines, rectangles, ellipses, or images, with configurable behavior.
- **Forces:** Combine directional forces, drag, radial forces, vortex motion, and orbital motion to influence particle movement globally or per-emitter.
- **Path modifiers:** Add movement patterns such as sine-wave motion, turbulence, and elastic anchoring, alongside forces.
- **Visual modifiers:** Animate particle appearance over time with color gradients, opacity transitions, scaling, and rotation.
- **Lifecycle hooks and sub-emissions:** Respond to particle events with custom callbacks and spawn additional particles from existing emitters.

## Benchmarks

These benchmarks measure Gnist's CPU-side particle simulation performance only. Rendering time is excluded because Gnist is renderer-agnostic.

A minimal WebGL2 renderer was used to keep rendering overhead low and focus measurements on simulation performance.

Each reported value is the median of multiple measurements, with each measurement averaging simulation update times over 100 frames. For reference, a 60 FPS target allows 16.67 ms per frame, while a 144 FPS target allows 6.94 ms per frame. These budgets include rendering and other application work.

**Test environment:**

- **CPU:** Intel Core i7-6700 (4 cores, 8 threads @ 3.4 GHz)
- **GPU:** NVIDIA GeForce RTX 4060 Ti
- **RAM:** 16 GB
- **Browser:** Chrome 155
- **Renderer:** WebGL2
- **Gnist version:** 0.3.0

### Baseline Scaling

Particle update cost with no forces or modifiers applied.

- **Forces:** None
- **Modifiers:** None

| Particles | Update time (ms/frame) |
|-----------|------------------------|
| 1,000     | ~0.13 ms               |
| 10,000    | ~0.79 ms               |
| 50,000    | ~2.69 ms               |
| 100,000   | ~5.20 ms               |

### Feature Cost

Particle update cost with forces and visual modifiers applied.

- **Forces:** `DirectionalForce` + `LinearDrag`
- **Modifiers:** `ColorRamp` + `OpacityFade` + `ScaleTween`

| Particles | Update time (ms/frame) |
|-----------|------------------------|
| 1,000     | ~0.23 ms               |
| 10,000    | ~1.75 ms               |
| 50,000    | ~7.19 ms               |
| 100,000   | ~14.94 ms              |

### Stress Test

Performance under an extreme particle count without forces or modifiers.

- **Forces:** None
- **Modifiers:** None

| Particles | Update time (ms/frame) |
|-----------|------------------------|
| 500,000   | ~35.53 ms              |

## Documentation

Gnist provides comprehensive resources to help you get started and learn how to use the engine:

- [How-To Guides](https://gergelybardos.github.io/gnist/guides/index.html) — Step-by-step tutorials for creating and controlling particle behavior with Gnist.
- [API Reference](https://gergelybardos.github.io/gnist/api/index.html) — Technical specification of the public-facing API.

## Changelog

See [Changelog](./CHANGELOG.md) for details.

## Contributing

See [Contributing Guide](./CONTRIBUTING.md) for details.

## License

Gnist is open-source software licensed under the [MIT license](./LICENSE).
