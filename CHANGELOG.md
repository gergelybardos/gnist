# Changelog

## 0.3.0 (2026-10-27)

### Changes

- Reworked `Vortex` force behavior for more natural vortex-like motion and added the `damping` property.

### Features

- Added lifecycle hooks — `onInterval` and `onDeath` — to emitters and particles, introducing support for event-driven behavior.
- Added support for persistent particles.
- Added looping support for particle modifiers, with repeat, oscillate, and hold modes.
- Added `loopDuration` to control modifier duration independently of particle lifespan.
- Added the `ImageEmitter` emitter.
- Added the `OrbitalForce` force.
- Added the `ElasticAnchor` modifier.
- Added support for randomly picking property values from a list in `particleBlueprint` configurations, in addition to literal values and `[min, max]` ranges.
- Added the `toggle()` playback control method to emitters.
- Added the `kill()` method to `Particle`.

### Fixes

- Fixed the missing soft-aging area around the `RadialForce` culling radius.

### Documentation

- Updated the API documentation and the how-to guides to cover new features and reflect changes.
- Added a new section to `README.md`: Live Showcase.
- Updated the Benchmarks section in `README.md`.

### Development

- Added npm scripts: `dev:benchmark`, `build:sandbox`, and `preview:sandbox`.
- Changed `npm run dev` to use WebGL rendering by default.
- Refactored the local sandbox to support switching between multiple demos.
- Added downloadable performance statistics reports to the local sandbox.

## 0.2.0 (2026-08-04)

### ⚠ BREAKING CHANGES

* Removed `Gnist.INFINITE_DURATION`.
* Removed `Gnist.config`.
* Changed `Gnist.config.cullingBounds` to `Gnist.cullingBounds`.
* Changed `Gnist.getEmitters()` to `Gnist.emitters` (`readonly`).
* Changed `Gnist.getParticles()` to `Gnist.particles` (`readonly`).
* Changed `Gnist.getGlobalForces()` to `Gnist.globalForces` (`readonly`).
* Removed `Emitter.duration`.
* Removed `Emitter.looping`.
* Changed `Emitter.isRunning` to `Emitter.enabled` which is now `readonly`.
* Changed `Emitter.initParticle()` to `Emitter._initParticle()`; the method is now considered internal and is not part of the public API.
* Changed `id` properties of `Emitter`, `Force`, and `Modifier` classes and their subclasses to `readonly`.

### Features

- Added emitters: `EllipseEmitter`, `LineEmitter`, `RectEmitter`.
- Added forces: `RadialForce`, `Vortex`.
- Added modifiers: `SineWave`, `Turbulence`, `RotationTween`, `ScaleTween`, `Spin`.
- Emitters now have playback control methods.
- Emitters now have configurable emission source mode.
- Emitters now have additional utility methods: `getModifier()`, `removeModifier()`, `getScopedForce()`, `removeScopedForce()`
- Added `Particle.visualModifiers`, `Particle.pathModifiers`, and `Particle.scopedForces` for accessing the particle's associated modifiers and scoped forces.
- Simulation state can now be exported in a GPU-friendly format for advanced rendering pipelines via `Gnist.fillFlatArray()`.
- Added `FlatParticleDataFormat` runtime constants describing the flat particle data format for GPU-friendly rendering.
- Added `EmissionSource` runtime constants defining emission source modes.

### Documentation

- Added comprehensive how-to guides with step-by-step tutorials and practical examples covering Gnist concepts and usage.
- Added new sections to `README.md`: Sandbox, Benchmark, and Changelog.

## 0.1.1 (2026-07-01)

### Documentation

- Updated the Installation section in `README.md`.
- Fixed the import in the basic usage example in `README.md`.

## 0.1.0 (2026-07-01)

Initial public release of Gnist.

### Features

- Added the core particle simulation system, including lifecycle management and emitter, force, and modifier architectures.

### Development

- Added a local sandbox environment for testing and experimentation.
