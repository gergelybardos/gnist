# Gnist

![node](https://img.shields.io/badge/node-%3E=20.0.0-green)
![license](https://img.shields.io/badge/license-MIT-green)

> **⚠️ Important:** This project is currently in early development. APIs are not stable yet, and breaking changes should be expected.

## 📚 Table of Contents

- [About Gnist](#about-gnist)
- [Requirements](#requirements)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Core Features](#core-features)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## ℹ️ About Gnist <a name="about-gnist"></a>

Gnist is a lightweight particle simulation engine.

Designed for real-time visual effects rather than physically accurate simulations, it uses a simplified kinematic model optimized for performance over strict Newtonian mechanics. Particles bypass mass and momentum calculations; instead, forces directly influence acceleration.

Key Characteristics:

- **Renderer-agnostic:** The engine is decoupled from timing and rendering loops, making it reusable across different runtimes and rendering systems.
- **Zero-dependency:** Gnist is written in vanilla JavaScript with no external runtime dependencies. **Full TypeScript support** is provided via declaration files.

## 📋 Requirements <a name="requirements"></a>

To install and integrate the NPM package into your own project, your environment should support:

- [Node.js](https://nodejs.org/): >=20.0.0
- [npm](https://www.npmjs.com/): >=9.6.4

## 📦 Installation <a name="installation"></a>

Coming soon.

> **💡 Note:** Gnist is distributed as native ECMAScript Modules (ESM) with no build step, preserving a fully readable source in `node_modules` and enabling consumer bundlers to optimize tree-shaking and minification.

## ⚡ Basic Usage <a name="basic-usage"></a>

Coming soon.

## ⚙️ Core Features <a name="core-features"></a>

- **Emitters:** Define and control particle spawning behavior with emission rate, lifespan, size, and more.
- **Forces:** Apply forces such as gravity (`DirectionalForce`) or friction (`LinearDrag`) globally to the whole system or scoped to specific emitters.
- **Modifiers:** Transform particle visuals over time with support for linear color gradients (`ColorRamp`) and opacity transitions (`OpacityFade`).

## 📖 Documentation <a name="documentation"></a>

Gnist provides comprehensive resources to help you get started and master the engine:

- [How-To Guides](https://gergelybardos.github.io/gnist/guides/index.html) — Step-by-step tutorials on how to 
- [API Reference](https://gergelybardos.github.io/gnist/api/index.html) — Technical specification of the public-facing API, including core classes, components, and configuration interfaces.

## 🤝 Contributing <a name="contributing"></a>

See [Contributing Guide](./CONTRIBUTING.md) for details.

## 📜 License <a name="license"></a>

Gnist is open-source software licensed under the [MIT license](./LICENSE).
