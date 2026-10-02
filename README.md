# Gnist

![npm version](https://img.shields.io/npm/v/%40gergelybardos%2Fgnist)
![node](https://img.shields.io/badge/node-%3E=20.0.0-green)
![license](https://img.shields.io/npm/l/%40gergelybardos%2Fgnist)

> **⚠️ Important:** This project is currently in early development. APIs are not stable yet, and breaking changes should be expected.

## Table of Contents

- [About Gnist](#about-gnist)
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

Gnist is a lightweight particle simulation engine.

Designed for real-time visual effects rather than physically accurate simulations, it uses a simplified kinematic model that prioritizes performance over strict Newtonian mechanics. Particles bypass mass and momentum calculations; instead, forces directly influence their velocity.

Gnist performs particle simulation calculations on the CPU, relying on single-thread performance.

Key characteristics:

- **Zero-dependency:** Gnist is written in vanilla JavaScript with no external runtime dependencies. **Full TypeScript support** is provided via declaration files.
- **Renderer-agnostic:** The engine is decoupled from timing and rendering loops, making it reusable across different runtimes and rendering systems.
- **Developer-friendly API:** Gnist provides an intuitive, object-oriented, configuration-driven API rather than a data-oriented architecture. Particle data can still be exported as GPU-friendly flat typed arrays for high-performance rendering pipelines.

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

Gnist is renderer-agnostic; the client is responsible for implementing the main update loop and rendering using their chosen rendering system. The example below shows the minimal code required to run Gnist with Canvas 2D rendering.

> **⚠️ Important:** This example assumes an existing project with module resolution provided by a build tool. If you are starting from scratch, check out the [How-To Guides](https://gergelybardos.github.io/gnist/guides/index.html) first.

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

The complete version looks like this:

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

The repository includes a sandbox for experimenting with Gnist and testing rendering integrations. It is intended as a development and demo tool and is not included in the npm package.

To run the sandbox locally:

```bash
npm install
npm run dev
```

By default, the sandbox uses Canvas 2D rendering. Use `npm run dev:webgl` for the WebGL version.

For additional development scripts, see [Contributing Guide](CONTRIBUTING.md).

## Core Features

- **Flexible emitters:** Create particle sources from common shapes including points, lines, rectangles, and ellipses, with configurable emission behavior.
- **Composable forces:** Combine environmental forces such as directional force, drag, radial attraction/repulsion, and vortex motion globally or per emitter.
- **Visual modifiers:** Animate particle appearance over its lifetime with color gradients, opacity transitions, and size interpolation.

## Benchmarks

The benchmarks below measure Gnist's CPU-side particle simulation performance only. Since Gnist is renderer-agnostic, rendering performance is not included in the measured times.

A minimal WebGL2 renderer was used during testing because offloading rendering work to the GPU leaves more CPU resources available for Gnist's simulation, allowing for significantly higher particle counts.

Each measurement represents the average simulation update time over 100 frames. Reported values are the median of multiple measurements, with developer tools closed.

**Test environment:**

- **CPU:** Intel Core i7-6700 (4 cores, 8 threads @ 3.4 GHz)
- **GPU:** NVIDIA GeForce RTX 4060 Ti
- **RAM:** 16 GB
- **Browser:** Chrome 154
- **Renderer:** WebGL2
- **Gnist version:** 0.3.0

> For reference, a 60 FPS target allows 16.67 ms per frame, while a 144 FPS target allows 6.94 ms per frame. These budgets include rendering and other application work.

### Baseline Scaling

Particle update cost with no forces or modifiers applied.

- **Forces:** None
- **Modifiers:** None

| Particles | Update time (ms/frame) |
|-----------|------------------------|
| 1,000     | ~0.12 ms               |
| 10,000    | ~0.84 ms               |
| 50,000    | ~2.81 ms               |
| 100,000   | ~5.33 ms               |

### Feature Cost

Particle update cost with forces and visual modifiers applied.

- **Forces:** `DirectionalForce` + `LinearDrag`
- **Modifiers:** `ColorRamp` + `OpacityFade` + `ScaleTween`

| Particles | Update time (ms/frame) |
|-----------|------------------------|
| 1,000     | ~0.22 ms               |
| 10,000    | ~1.24 ms               |
| 50,000    | ~5.10 ms               |
| 100,000   | ~10.13 ms              |

### Stress Test

Performance under an extreme particle count without forces or modifiers.

- **Forces:** None
- **Modifiers:** None

| Particles | Update time (ms/frame) |
|-----------|------------------------|
| 500,000   | ~36.26 ms              |

## Documentation

Gnist provides comprehensive resources to help you get started and master the engine:

- [How-To Guides](https://gergelybardos.github.io/gnist/guides/index.html) — Step-by-step tutorials on how to use Gnist in real projects.
- [API Reference](https://gergelybardos.github.io/gnist/api/index.html) — Technical specification of the public-facing API, including core classes, components, and configuration interfaces.

## Changelog

See [Changelog](./CHANGELOG.md) for details.

## Contributing

See [Contributing Guide](./CONTRIBUTING.md) for details.

## License

Gnist is open-source software licensed under the [MIT license](./LICENSE).
