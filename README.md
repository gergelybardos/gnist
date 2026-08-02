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

## About Gnist <a name="about-gnist"></a>

Gnist is a lightweight particle simulation engine.

Designed for real-time visual effects rather than physically accurate simulations, it uses a simplified kinematic model that prioritizes performance over strict Newtonian mechanics. Particles bypass mass and momentum calculations; instead, forces directly influence their velocity.

Gnist performs particle simulation calculations on the CPU, relying on single-thread performance.

Key characteristics:

- **Zero-dependency:** Gnist is written in vanilla JavaScript with no external runtime dependencies. **Full TypeScript support** is provided via declaration files.
- **Renderer-agnostic:** The engine is decoupled from timing and rendering loops, making it reusable across different runtimes and rendering systems.
- **Developer-friendly API:** Gnist provides an intuitive, object-oriented, configuration-driven API rather than a data-oriented architecture. Particle data can still be exported as GPU-friendly flat typed arrays for high-performance rendering pipelines.

## Requirements <a name="requirements"></a>

To install and integrate the NPM package into your own project, your environment should support:

- [Node.js](https://nodejs.org/): >=20.0.0
- [npm](https://www.npmjs.com/): >=9.6.4

## Installation <a name="installation"></a>

```bash
npm i @gergelybardos/gnist
```

> **💡 Note:** Gnist is distributed as native ECMAScript Modules (ESM) with no build step, preserving a fully readable source in `node_modules` and enabling consumer bundlers to optimize tree-shaking and minification.

## Basic Example <a name="basic-example"></a>

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

## Sandbox <a name="sandbox"></a>

The repository includes a sandbox for experimenting with Gnist and testing rendering integrations. It is intended as a development and demo tool and is not included in the npm package.

To run the sandbox locally:

```bash
npm install
npm run dev
```

By default, the sandbox uses Canvas 2D rendering. Use `npm run dev:webgl` for the WebGL version.

For additional development scripts, see [Contributing Guide](CONTRIBUTING.md).

## Core Features <a name="core-features"></a>

- **Flexible emitters:** Create particle sources from common shapes including points, lines, rectangles, and ellipses, with configurable emission behavior.
- **Composable forces:** Combine environmental forces such as directional force, drag, radial attraction/repulsion, and vortex motion globally or per emitter.
- **Visual modifiers:** Animate particle appearance over its lifetime with color gradients, opacity transitions, and size interpolation.

## Benchmarks <a name="benchmarks"></a>

The benchmarks below measure CPU-side particle simulation performance only. Rendering overhead is excluded, as rendering performance depends on the chosen renderer.

All values represent the average simulation update time measured over 100 frames, with browser developer tools closed.

### Test Environment

- **CPU:** Intel Core i7-6700K (4 cores, 8 threads @ 3.4 GHz)
- **RAM:** 16 GB
- **Browser:** Chrome 150
- **OS:** Windows 10
- **Gnist version:** 0.2.0

### Scaling

Particle update cost with no forces or modifiers applied.

| Particles | Forces | Modifiers | Avg. update (ms/frame) |
|-----------|--------|-----------|------------------------|
| 1,000     | None   | None      | ~0.08 ms               |
| 10,000    | None   | None      | ~0.7 ms                |
| 50,000    | None   | None      | ~2.6 ms                |
| 100,000   | None   | None      | ~5.0 ms                |

### Feature Cost

Realistic workload with forces and visual modifiers applied. ColorRamp uses a four-stop gradient.

| Particles | Forces                        | Modifiers                            | Avg. update (ms/frame) |
|-----------|-------------------------------|--------------------------------------|------------------------|
| 1,000     | DirectionalForce + LinearDrag | ColorRamp + OpacityFade + ScaleTween | ~0.2 ms                |
| 10,000    | DirectionalForce + LinearDrag | ColorRamp + OpacityFade + ScaleTween | ~1.5 ms                |
| 50,000    | DirectionalForce + LinearDrag | ColorRamp + OpacityFade + ScaleTween | ~7.0 ms                |
| 100,000   | DirectionalForce + LinearDrag | ColorRamp + OpacityFade + ScaleTween | ~14.0 ms               |

### Stress Test

Performance under an extreme particle count without forces or modifiers.

| Particles | Forces | Modifiers | Avg. update (ms/frame) |
|-----------|--------|-----------|------------------------|
| 500,000   | None   | None      | ~31 ms                 |

## Documentation <a name="documentation"></a>

Gnist provides comprehensive resources to help you get started and master the engine:

- [How-To Guides](https://gergelybardos.github.io/gnist/guides/index.html) — Step-by-step tutorials on how to use Gnist in real projects.
- [API Reference](https://gergelybardos.github.io/gnist/api/index.html) — Technical specification of the public-facing API, including core classes, components, and configuration interfaces.

## Changelog <a name="changelog"></a>

See [Changelog](./CHANGELOG.md) for details.

## Contributing <a name="contributing"></a>

See [Contributing Guide](./CONTRIBUTING.md) for details.

## License <a name="license"></a>

Gnist is open-source software licensed under the [MIT license](./LICENSE).
