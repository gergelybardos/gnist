import { Force } from '../forces/Force.js';
import { Gnist } from '../core/Gnist.js';
import { Modifier } from '../modifiers/Modifier.js';
import { Particle } from '../core/Particle.js';

import '../shared/Types.js';

/**
 * @import { Color } from '../shared/Types.js'
 */

/**
 * Emitter configuration options.
 * @typedef {object} EmitterConfig
 * @property {string} [id] Unique identifier. Defaults to a generated UUID.
 * @property {boolean} [enabled=true] Flag indicating whether the emitter is running or not.
 * @property {boolean} [looping=true] Flag indicating whether a finite-duration emitter restarts when its time is up.
 * @property {number} [particlesPerSecond=10] Continuous emission rate of new particles per second.
 * @property {number} [duration=Gnist.INFINITE_DURATION] Duration of particle emission (in seconds), where -1 represents infinite emission.
 * @property {number} [x=0] Current horizontal coordinate of the emitter origin.
 * @property {number} [y=0] Current vertical coordinate of the emitter origin.
 * @property {ParticleBlueprint} [particleBlueprint={}] Configuration for emitted particles.
 */

/**
 * Configuration options used by emitters to initialize particles at emission.
 * This object is not runtime Particle state and does not correspond directly to Particle properties.
 * Options are interpreted either directly or indirectly to derive Particle properties.
 * Most options may be specified as a single number or a [min, max] range array.
 * @typedef {object} ParticleBlueprint
 * @property {number|number[]} [rotation] Orientation angle in radians.
 * @property {number|number[]} [angularVelocity] Angular rotation speed (radians per second).
 * @property {number|number[]} [size] The visual size or scale factor. Interpreted by the renderer as pixels, radius, or a transform scale.
 * @property {Color} [color] RGB color channels.
 * @property {number|number[]} [opacity] Transparency (0.0 = fully transparent, 1.0 = fully opaque).
 * @property {number|number[]} [lifespan] Maximum allowed lifespan (in seconds).
 * @property {number|number[]} [speed] Speed (in pixels per second) used to derive the particle's initial horizontal and vertical velocity.
 * @property {number|number[]} [direction] Movement direction angle (in radians) used to derive the particle's initial horizontal and vertical velocity.
 */

/**
 * Abstract base class for particle emitters.
 * @abstract
 * @class
 */
export class Emitter {
    /**
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     */
    id;

    /**
     * Flag indicating whether the emitter is running or not.
     * @type {boolean}
     */
    enabled;

    /**
     * Flag indicating whether a finite-duration emitter restarts when its time is up.
     * @type {boolean}
     */
    looping;

    /**
     * Continuous emission rate of new particles per second.
     * @type {number}
     */
    particlesPerSecond;

    /**
     * Duration of particle emission (in seconds), where -1 represents infinite emission.
     * @type {number}
     */
    duration;

    /**
     * Current horizontal coordinate of the emitter origin.
     * @type {number}
     */
    x;

    /**
     * Current vertical coordinate of the emitter origin.
     * @type {number}
     */
    y;

    /**
     * Configuration settings used to initialize emitted particles.
     * @type {object}
     */
    #particleBlueprint;

    /**
     * Leftover fractional particles to be emitted between frames.
     * @type {number}
     */
    #accumulator;

    /**
     * Total elapsed running time of the emitter (in seconds).
     * @type {number}
     */
    #elapsedTime;

    /**
     * Shared reference to the emitter's modifier array.
     * @type {Array<Modifier>}
     */
    #modifiers;

    /**
     * Shared reference to the emitter's scoped emitter-specific force array.
     * @type {Array<Force>}
     */
    #scopedForces;

    /**
     * Initializes a particle emitter.
     * @constructor
     * @param {EmitterConfig} [config={}] Emitter configuration options.
     * @throws {TypeError}
     */
    constructor(config = {}) {
        if (new.target === Emitter) {
            throw new TypeError('Cannot instantiate abstract class Emitter directly.');
        }

        this.id = config.id ?? crypto.randomUUID();
        this.enabled = config.enabled ?? true;
        this.looping = config.looping ?? true;
        this.particlesPerSecond = config.particlesPerSecond ?? 10;
        this.duration = config.duration ?? Gnist.INFINITE_DURATION;
        this.x = config.x ?? 0;
        this.y = config.y ?? 0;

        this.#particleBlueprint = config.particleBlueprint ?? {};

        this.#accumulator = 0;
        this.#elapsedTime = 0;

        this.#modifiers = [];
        this.#scopedForces = [];
    }

    /**
     * Registers a modifier to be applied to the particles emitted by the emitter.
     * @param {Modifier} modifier Modifier instance to register.
     * @returns {void}
     */
    addModifier(modifier) {
        this.#modifiers.push(modifier);
    }

    /**
     * Registers a scoped emitter-specific force to be applied to the particles emitted by the emitter.
     * @param {Force} force Force instance to register.
     * @returns {void}
     */
    addScopedForce(force) {
        this.#scopedForces.push(force);
    }

    /**
     * Updates the emitter's internal timer and returns any new particles to be emitted in the current frame.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {Array<Particle>} An array of particles emitted this frame.
     */
    update(dt) {
        if (!this.enabled) {
            return [];
        }

        if (this.duration > 0) {
            this.#elapsedTime += dt;
            if (this.#elapsedTime >= this.duration) {
                if (this.looping) {
                    this.#elapsedTime = 0;
                } else {
                    this.enabled = false;
                    return [];
                }
            }
        }

        this.#accumulator += dt * this.particlesPerSecond;
        const spawnCount = Math.floor(this.#accumulator);
        this.#accumulator -= spawnCount;

        const newParticles = [];
        for (let i = 0; i < spawnCount; i++) {
            const particle = new Particle();

            this.initParticle(particle);

            particle.setModifiers(this.#modifiers);
            particle.setScopedForces(this.#scopedForces);

            newParticles.push(particle);
        }

        return newParticles;
    }

    /**
     * Sets up a particle's movement, visuals, and lifecycle state.
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    initParticle(particle) {
        // Blueprint values that may be either a single number or a range are resolved via this.#resolveNumber().
        // Values that may only be numbers are accessed directly.

        const blueprint = this.#particleBlueprint;
        const speed = this.#resolveNumber(blueprint.speed, 50);
        const direction = this.#resolveNumber(blueprint.direction, 0);

        particle.vx = Math.cos(direction) * speed;
        particle.vy = Math.sin(direction) * speed;
        particle.rotation = this.#resolveNumber(blueprint.rotation, particle.rotation);
        particle.angularVelocity = this.#resolveNumber(blueprint.angularVelocity, particle.angularVelocity);

        particle.size = this.#resolveNumber(blueprint.size, particle.size);
        particle.color = {
            r: blueprint.color?.r ?? 255,
            g: blueprint.color?.g ?? 255,
            b: blueprint.color?.b ?? 255,
        };
        particle.opacity = this.#resolveNumber(blueprint.opacity, particle.opacity);

        particle.age = 0;
        particle.lifespan = this.#resolveNumber(blueprint.lifespan, particle.lifespan);
        particle.alive = true;
    }

    /**
     * Resolves an input - usually a property - into a single number, picking a random value if a [min, max] range array is provided.
     * @param {number|Array<number>} value Number or [min, max] range array to resolve.
     * @param {number} defaultValue Fallback value to use if the property is neither a number nor a valid [min, max] range array.
     * @returns {number} Resolved numeric value.
     */
    #resolveNumber(value, defaultValue) {
        if (typeof value === 'number') {
            return value;
        }

        if (Array.isArray(value) && value.length === 2) {
            const min = value[0];
            const max = value[1];

            if (typeof min === 'number' && typeof max === 'number') {
                return min + Math.random() * (max - min);
            }
        }

        return defaultValue;
    }
}
