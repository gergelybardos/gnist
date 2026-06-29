import { Emitter } from '../emitters/Emitter.js';
import { Force } from '../forces/Force.js';

import { Particle } from './Particle.js';

/**
 * Simulation configuration.
 * @typedef {object} EngineConfig
 * @property {CullingBounds|null} [cullingBounds=null] Optional simulation area used for particle culling.
 */

/**
 * Defines a region beyond which particles are considered outside the simulation and are marked dead.
 * A safety margin is applied per particle based on its position and size, preventing early removal while it is still
 * partially inside the region.
 * @typedef {object} CullingBounds
 * @property {number} xMin Left boundary of the simulation area.
 * @property {number} yMin Top boundary of the simulation area.
 * @property {number} xMax Right boundary of the simulation area.
 * @property {number} yMax Bottom boundary of the simulation area.
 */

/**
 * The core particle engine that manages the simulation pipeline and particle lifecycle.
 * @class
 */
export class Gnist {
    /**
     * The current semantic version of the Gnist particle engine.
     * @returns {string}
     */
    static get VERSION() {
        return '0.0.0';
    }

    /**
     * Constant value representing an infinite particle lifespan.
     * @type {number}
     */
    static get INFINITE_DURATION() {
        return -1;
    }

    /**
     * Engine configuration options.
     * @type {EngineConfig}
     */
    config;

    /**
     * Registered emitters emitting active particles.
     * @type {Array<Emitter>}
     */
    #emitters;

    /**
     * Registered global environmental forces affecting all active particles.
     * @type {Array<Force>}
     */
    #globalForces;

    /**
     * Common pool of active particles.
     * @type {Array<Particle>}
     */
    #particles;

    /**
     * Initializes an empty simulation pipeline.
     * @constructor
     * @param {EngineConfig} [config={}] Engine configuration options.
     */
    constructor(config = {}) {
        this.#emitters = [];
        this.#globalForces = [];
        this.#particles = [];

        this.config = {};
        this.config.cullingBounds = config.cullingBounds ?? null;
    }

    /**
     * Gets the current list of registered emitters.
     * @returns {Array<Emitter>}
     */
    getEmitters() {
        return this.#emitters;
    }

    /**
     * Finds a registered emitter by its unique identifier.
     * @param {string} id The unique identifier of the target emitter.
     * @returns {Emitter|null} The emitter instance if found, null otherwise.
     */
    getEmitter(id) {
        for (let i = 0; i < this.#emitters.length; i++) {
            if (this.#emitters[i].id === id) {
                return this.#emitters[i];
            }
        }

        return null;
    }

    /**
     * Registers an emitter into the simulation pipeline.
     * @param {Emitter} emitter The emitter instance to register.
     * @returns {this} The Gnist engine instance for method chaining.
     */
    addEmitter(emitter) {
        this.#emitters.push(emitter);

        return this;
    }

    /**
     * Removes an emitter from the simulation pipeline by its unique identifier.
     * @param {string} id The unique identifier of the target emitter.
     * @returns {boolean} True if found and successfully removed, false otherwise.
     */
    removeEmitter(id) {
        const initialLength = this.#emitters.length;

        this.#emitters = this.#emitters.filter(e => e.id !== id);

        return this.#emitters.length < initialLength;
    }

    /**
     * Gets the current list of registered global environmental forces.
     * @returns {Array<Force>}
     */
    getGlobalForces() {
        return this.#globalForces;
    }

    /**
     * Finds a registered global environmental force by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {Force|null} The force instance if found, null otherwise.
     */
    getGlobalForce(id) {
        for (let i = 0; i < this.#globalForces.length; i++) {
            if (this.#globalForces[i].id === id) {
                return this.#globalForces[i];
            }
        }

        return null;
    }

    /**
     * Registers a global environmental force into the simulation pipeline.
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
     * Gets the current list of active particles of the common particle pool.
     * @returns {Array<Particle>}
     */
    getParticles() {
        return this.#particles;
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

        this.emitParticles(dt);
        this.tickParticles(dt);
    }

    /**
     * Iterates through registered emitters to emit new particles.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    emitParticles(dt) {
        for (let i = 0; i < this.#emitters.length; i++) {
            const newParticles = this.#emitters[i].update(dt);

            if (newParticles.length > 0) {
                this.#particles.push(...newParticles);
            }
        }
    }

    /**
     * Updates particle lifecycles, applies global and scoped emitter-specific forces, moves particles, and
     * applies modifiers.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    tickParticles(dt) {
        const globalForces = this.#globalForces;
        const globalForcesCount = globalForces.length;
        const particles = this.#particles;
        const particleCount = particles.length;
        const cullingBounds = this.config.cullingBounds;

        let aliveCount = 0;

        for (let i = 0; i < particleCount; i++) {
            const particle = particles[i];

            particle.age += dt;
            if (particle.age >= particle.lifespan) {
                particle.alive = false;
            }

            if (particle.alive) {
                const normalizedAge = Math.min(particle.age / particle.lifespan, 1.0);

                for (let j = 0; j < globalForcesCount; j++) {
                    globalForces[j].apply(particle, dt);
                }

                const scopedForces = particle.getScopedForces();
                const scopedForcesCount = scopedForces.length;
                for (let j = 0; j < scopedForcesCount; j++) {
                    scopedForces[j].apply(particle, dt);
                }

                particle.x += particle.vx * dt;
                particle.y += particle.vy * dt;
                particle.rotation += particle.angularVelocity * dt;

                const activeModifiers = particle.getModifiers();
                const activeModifiersCount = activeModifiers.length;
                for (let j = 0; j < activeModifiersCount; j++) {
                    activeModifiers[j].update(particle, normalizedAge, dt);
                }

                if (cullingBounds !== null) {
                    const safetyMargin = particle.size ?? 0;

                    if (particle.x < cullingBounds.xMin - safetyMargin ||
                        particle.x > cullingBounds.xMax + safetyMargin ||
                        particle.y < cullingBounds.yMin - safetyMargin ||
                        particle.y > cullingBounds.yMax + safetyMargin
                    ) {
                        particle.alive = false;
                    }
                }
            }

            // In-place dual-pointer compaction avoids Array.filter allocations, eliminating garbage collection spikes
            if (particle.alive) {
                if (aliveCount !== i) {
                    particles[aliveCount] = particle;
                }
                aliveCount++;
            }
        }

        particles.length = aliveCount;
    }
}
