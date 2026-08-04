# Changelog

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

- Added a comprehensive how-to guide with step-by-step tutorials and practical examples covering Gnist concepts and usage.
- Added new sections to `README.md`: Sandbox, Benchmark, and Changelog.

## 0.1.1 (2026-07-01)

### Documentation

- Updated the installation section in `README.md`.
- Fixed the import in the basic usage example in `README.md`.

## 0.1.0 (2026-07-01)

Initial public release of Gnist.

### Features

- Added the core particle simulation system, including lifecycle management and emitter, force, and modifier architectures.

### Development

- Added a local sandbox environment for testing and experimentation.
