import { Emitter } from '../emitters/Emitter.js';
import { Force } from '../forces/Force.js';
import { LoopMode } from '../shared/Constants.js';

import { Particle } from './Particle.js';

/**
 * Engine configuration options.
 * @typedef {object} EngineConfig
 * @property {CullingBounds|null} [cullingBounds=null] Optional region used for particle culling.
 */

/**
 * Defines a region beyond which particles are considered outside the simulation and are marked dead.
 * A safety margin is applied per particle based on its coordinates and size, preventing early removal while it is still partially inside the region.
 * @typedef {object} CullingBounds
 * @property {number} xMin Left boundary of the region.
 * @property {number} yMin Top boundary of the region.
 * @property {number} xMax Right boundary of the region.
 * @property {number} yMax Bottom boundary of the region.
 */

/**
 * The core particle engine that manages the simulation pipeline and particle lifecycle.
 * @class
 */
export class Gnist {
    /**
     * The semantic version of the Gnist particle engine.
     * @type {string}
     * @returns {string}
     */
    static get VERSION() {
        return '0.3.0';
    }

    /**
     * Internal collection of registered emitters.
     * @type {Array<Emitter>}
     */
    #emitters;

    /**
     * Internal collection of registered global environmental forces.
     * @type {Array<Force>}
     */
    #globalForces;

    /**
     * Internal collection of active particles.
     * @type {Array<Particle>}
     */
    #activeParticles;

    /**
     * Internal staging queue of particles created mid-frame during sub-emission.
     * Prevents mid-frame array mutation issues.
     * @type {Array<Particle>}
     */
    #pendingParticles;

    /**
     * Internal collection of reusable particles.
     * Used for object pooling to reduce the overhead of memory allocation and garbage collection.
     * @type {Array<Particle>}
     */
    #reusableParticles;

    /**
     * Callback used internally to provide particle acquisition for object pooling to other components.
     * @type {function(): Particle}
     */
    #acquireParticleCallback;

    /**
     * Internal state of the optional region used for particle culling.
     * @type {CullingBounds|null}
     */
    #cullingBounds;

    /**
     * Initializes an empty simulation pipeline.
     * @constructor
     * @param {EngineConfig} [config={}] Engine configuration options.
     */
    constructor(config = {}) {
        this.#emitters = [];
        this.#globalForces = [];
        this.#activeParticles = [];
        this.#pendingParticles = [];
        this.#reusableParticles = [];
        this.#acquireParticleCallback = () => this.#acquireParticle();
        this.cullingBounds = config.cullingBounds;
    }

    /**
     * Registered emitters emitting active particles.
     * @type {Array<Emitter>}
     */
    get emitters() {
        return this.#emitters;
    }

    /**
     * Registered global environmental forces affecting all active particles.
     * @type {Array<Force>}
     */
    get globalForces() {
        return this.#globalForces;
    }

    /**
     * Common pool of active particles.
     * @type {Array<Particle>}
     */
    get particles() {
        return this.#activeParticles;
    }

    /**
     * Optional region used for particle culling.
     * @type {CullingBounds|null}
     */
    get cullingBounds() {
        return this.#cullingBounds;
    }

    /**
     * Sets the optional region used for particle culling.
     * @param {CullingBounds|null} cullingBounds The new region or null to disable culling.
     * @throws {RangeError}
     */
    set cullingBounds(cullingBounds) {
        if (!cullingBounds) {
            this.#cullingBounds = null;
            return;
        }

        const xMin = cullingBounds.xMin ?? -10_000_000;
        const yMin = cullingBounds.yMin ?? -10_000_000;
        const xMax = cullingBounds.xMax ?? 10_000_000;
        const yMax = cullingBounds.yMax ?? 10_000_000;

        if (xMin > xMax || yMin > yMax) {
            throw new RangeError('[Gnist] Invalid culling bounds: `xMin` must be less than or equal to `xMax` and `yMin` must be less than or equal to `yMax`.');
        }

        this.#cullingBounds = { xMin, yMin, xMax, yMax };
    }

    /**
     * Finds a registered emitter by its unique identifier.
     * @param {string} id The unique identifier of the target emitter.
     * @returns {Emitter|null} The emitter instance if found, null otherwise.
     */
    getEmitter(id) {
        return this.#emitters.find(em => em.id === id) ?? null;
    }

    /**
     * Registers an emitter with the simulation pipeline.
     * @param {Emitter} emitter The emitter instance to register.
     * @returns {this} The Gnist engine instance for method chaining.
     */
    addEmitter(emitter) {
        if (!this.#emitters.includes(emitter)) {
            this.#emitters.push(emitter);

            emitter.bindEngineContext({
                acquireParticle: this.#acquireParticleCallback,
                enqueueParticle: (particle) => {
                    this.#pendingParticles.push(particle);
                },
            });
        }

        return this;
    }

    /**
     * Removes an emitter from the simulation pipeline.
     * @param {Emitter} emitter The emitter instance to remove.
     * @returns {boolean} True if found and removed, false otherwise.
     */
    removeEmitter(emitter) {
        const index = this.#emitters.indexOf(emitter);

        if (index !== -1) {
            this.#emitters.splice(index, 1);
            emitter.unbindEngineContext();

            return true;
        }

        return false;
    }

    /**
     * Finds a registered global environmental force by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {Force|null} The force instance if found, null otherwise.
     */
    getGlobalForce(id) {
        return this.#globalForces.find(f => f.id === id) ?? null;
    }

    /**
     * Registers a global environmental force with the simulation pipeline.
     * @param {Force} force The force instance to register.
     * @returns {this} The Gnist engine instance for method chaining.
     */
    addGlobalForce(force) {
        this.#globalForces.push(force);

        return this;
    }

    /**
     * Removes a global environmental force from the simulation pipeline by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {boolean} True if found and successfully removed, false otherwise.
     */
    removeGlobalForce(id) {
        const initialLength = this.#globalForces.length;

        this.#globalForces = this.#globalForces.filter(e => e.id !== id);

        return this.#globalForces.length < initialLength;
    }

    /**
     * Steps the simulation pipeline forward by a given time delta.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(dt) {
        if (dt <= 0) {
            return;
        }

        // Cap maximum step size to preserve physics stability during tab switches
        const safeDt = Math.min(dt, 0.1);

        this.#emitParticles(safeDt);
        this.#tickParticles(safeDt);

        // Flush particles queued during ticking

        const pending = this.#pendingParticles;
        const pendingCount = pending.length;

        for (let i = 0; i < pendingCount; i++) {
            this.#activeParticles.push(pending[i]);
        }

        this.#pendingParticles.length = 0;
    }

    /**
     * Fills a provided TypedArray with particle data for WebGL.
     * @param {Float32Array} targetArray - The array to write data into.
     * @returns {number} The number of particles written.
     */
    fillFlatArray(targetArray) {
        let offset = 0;
        const count = this.#activeParticles.length;
        const particles = this.#activeParticles;

        for (let i = 0; i < count; i++) {
            const p = particles[i];

            if (!p.alive) {
                continue;
            }

            // Physical attributes
            targetArray[offset++] = p.x;
            targetArray[offset++] = p.y;
            targetArray[offset++] = p.size;
            targetArray[offset++] = p.rotation;

            // Visuals (normalized for WebGL)
            targetArray[offset++] = p.color.r / 255;
            targetArray[offset++] = p.color.g / 255;
            targetArray[offset++] = p.color.b / 255;
            targetArray[offset++] = p.opacity;
        }

        return offset / 8;
    }

    /**
     * Retrieves a reusable particle from the pool or creates a new one.
     * @returns {Particle}
     */
    #acquireParticle() {
        return this.#reusableParticles.pop() ?? new Particle();
    }

    /**
     * Resets a particle and returns it to the pool.
     * @param {Particle} particle
     * @returns {void}
     */
    #releaseParticle(particle) {
        particle.reset();
        this.#reusableParticles.push(particle);
    }

    /**
     * Iterates through registered emitters to emit new particles.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    #emitParticles(dt) {
        const particles = this.#activeParticles;
        const emitterCount = this.#emitters.length;

        for (let i = 0; i < emitterCount; i++) {
            const emitter = this.#emitters[i];

            if (emitter) {
                emitter.update(
                    dt,
                    particles,
                    this.#acquireParticleCallback,
                );
            }
        }
    }

    /**
     * Updates particle lifecycles, applies global and scoped emitter-specific forces, moves particles, and applies modifiers.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {Error}
     */
    #tickParticles(dt) {
        const ERROR_INVALID_LOOP_MODE = '[Gnist] Invalid loop mode.';

        const globalForces = this.#globalForces;
        const globalForcesCount = globalForces.length;
        const particles = this.#activeParticles;
        const particleCount = particles.length;
        const reusableParticles = this.#reusableParticles;
        const cullingBounds = this.#cullingBounds;

        let aliveCount = 0;

        for (let i = 0; i < particleCount; i++) {
            const particle = particles[i];

            const age = (particle.age += dt);
            const lifespan = particle.lifespan;

            if (!particle.persistent && age >= lifespan) {
                particle.alive = false;

                if (particle.onDeath !== null) {
                    particle.onDeath(particle);
                }
            }

            if (particle.alive) {
                const pathModifiers = particle.pathModifiers;
                const pathModifiersCount = pathModifiers.length;
                const visualModifiers = particle.visualModifiers;
                const visualModifiersCount = visualModifiers.length;

                let normalizedModifierProgress = 1.0;

                if (pathModifiersCount > 0 || visualModifiersCount > 0) {
                    const loopDuration = particle.loopDuration;

                    switch (particle.loopMode) {
                        case LoopMode.HOLD: {
                            if (particle.persistent && age > loopDuration) {
                                particle.age = loopDuration;
                            }

                            normalizedModifierProgress = age >= loopDuration ? 1.0 : age / loopDuration;
                            break;
                        }
                        case LoopMode.REPEAT: {
                            if (particle.persistent && age >= loopDuration) {
                                particle.age %= loopDuration;
                            }

                            const loopAge = particle.persistent ? particle.age : age % loopDuration;

                            normalizedModifierProgress = loopAge / loopDuration;
                            break;
                        }
                        case LoopMode.OSCILLATE: {
                            const cycleDuration = loopDuration * 2;

                            if (particle.persistent && age >= cycleDuration) {
                                particle.age %= cycleDuration;
                            }

                            const cycleAge = particle.persistent ? particle.age : age % cycleDuration;

                            normalizedModifierProgress = cycleAge < loopDuration
                                ? cycleAge / loopDuration
                                : 2.0 - (cycleAge / loopDuration);
                            break;
                        }
                        default:
                            throw new Error(ERROR_INVALID_LOOP_MODE);
                    }
                }

                // Environmental forces

                for (let j = 0; j < globalForcesCount; j++) {
                    globalForces[j].apply(particle, dt);
                }

                // Scoped forces

                const scopedForces = particle.scopedForces;
                const scopedForcesCount = scopedForces.length;

                for (let j = 0; j < scopedForcesCount; j++) {
                    scopedForces[j].apply(particle, dt);
                }

                // Path modifiers (must run BEFORE kinematic integration so velocity changes apply immediately)

                for (let j = 0; j < pathModifiersCount; j++) {
                    pathModifiers[j].update(particle, normalizedModifierProgress, dt);
                }

                // Kinematic integration

                particle.x += particle.vx * dt;
                particle.y += particle.vy * dt;
                particle.rotation += particle.angularVelocity * dt;

                // Visual Modifiers (must run AFTER kinematic integration)

                for (let j = 0; j < visualModifiersCount; j++) {
                    visualModifiers[j].update(particle, normalizedModifierProgress, dt);
                }

                if (particle.onInterval !== null && particle.interval > 0) {
                    particle.intervalTimer += dt;

                    while (particle.intervalTimer >= particle.interval) {
                        particle.intervalTimer -= particle.interval;
                        particle.onInterval(particle);

                        if (!particle.alive) {
                            break;
                        }
                    }
                }

                // Culling

                if (particle.alive && cullingBounds !== null) {
                    const safetyMargin = particle.size;

                    if (
                        particle.x < cullingBounds.xMin - safetyMargin ||
                        particle.x > cullingBounds.xMax + safetyMargin ||
                        particle.y < cullingBounds.yMin - safetyMargin ||
                        particle.y > cullingBounds.yMax + safetyMargin
                    ) {
                        particle.alive = false;

                        if (particle.onDeath !== null) {
                            particle.onDeath(particle);
                        }
                    }
                }
            }

            // In-place dual-pointer compaction
            if (particle.alive) {
                if (aliveCount !== i) {
                    particles[aliveCount] = particle;
                }
                aliveCount++;
            } else {
                particle.reset();
                reusableParticles.push(particle);
            }
        }

        particles.length = aliveCount;
    }
}
