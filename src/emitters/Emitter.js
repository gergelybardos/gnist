import { Force } from '../forces/Force.js';
import { Gnist } from '../core/Gnist.js';
import { Modifier } from '../modifiers/Modifier.js';
import { Particle } from '../core/Particle.js';

/**
 * Abstract base class for particle emitters.
 * @abstract
 * @class
 */
export class Emitter {
    /**
     * Unique identifier. Defaults to an auto-generated UUID if none is provided.
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
     * Lifetime of the emitter (in seconds), where -1 represents infinite emission.
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
    #spawnConfig;

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
     * @param {object} [config={}] Configuration parameters.
     * @throws {TypeError}
     */
    constructor(config = {}) {
        if (new.target === Emitter) {
            throw new TypeError('Cannot instantiate abstract class Emitter directly.');
        }

        this.id = config.id || crypto.randomUUID();
        this.enabled = config.enabled ?? true;
        this.looping = config.looping ?? true;
        this.particlesPerSecond = config.particlesPerSecond ?? 10;
        this.duration = config.duration ?? Gnist.INFINITE_DURATION;
        this.x = config.x ?? 0;
        this.y = config.y ?? 0;

        this.#spawnConfig = config.spawnConfig ?? {};
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
        const config = this.#spawnConfig;
        const speed = this.#resolveNumber(config.speed, 50);
        const angle = this.#resolveNumber(config.rotation, 0);

        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed;
        particle.angularVelocity = this.#resolveNumber(config.angularVelocity, 0);

        particle.size = this.#resolveNumber(config.size, particle.size);
        particle.color = {
            r: config.color?.r ?? 255,
            g: config.color?.g ?? 255,
            b: config.color?.b ?? 255,
        };
        particle.opacity = this.#resolveNumber(config.opacity, particle.opacity);

        particle.age = 0;
        particle.lifespan = this.#resolveNumber(config.lifespan, particle.lifespan);
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
