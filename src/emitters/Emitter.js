import { Force } from '../forces/Force.js';
import { Modifier } from '../modifiers/Modifier.js';
import { Particle } from '../core/Particle.js';
import { ModifierCategory, EmissionSource } from '../shared/Constants.js';

/**
 * @import { Color, EmissionSourceValues } from '../shared/Types.js'
 */

/**
 * Emitter configuration options.
 * @typedef {object} EmitterConfig
 * @property {string} [id] Unique identifier. Defaults to a generated UUID.
 * @property {boolean} [enabled=true] Flag indicating whether the emitter is running or not.
 * @property {number} [particlesPerSecond=10] Continuous emission rate of new particles per second.
 * @property {number} [duration=Infinity] Duration of particle emission (in seconds) or JavaScript's native Infinity global object or a negative number for infinite emission.
 * @property {number} [x=0] Current horizontal coordinate of the emitter origin.
 * @property {number} [y=0] Current vertical coordinate of the emitter origin.
 * @property {string} [emissionSource=EmissionSource.VOLUME] Emission source mode, defining the geometric distribution and initial direction of emitted particles.
 * The default direction depends on both the emission source mode and the emitter type and can be overridden by specifying `particleBlueprint.direction` in the emitter config.
 * See {@link EmissionSourceValues} for available configuration constants.
 * @property {ParticleBlueprint} [particleBlueprint={}] Configuration for emitted particles.
 */

/**
 * Configuration options used by emitters to initialize particles at emission.
 * This object is not runtime Particle state and does not correspond directly to Particle properties.
 * Options are interpreted either directly or indirectly to derive Particle properties.
 * Most options may be specified as a single number or a [min, max] range array.
 * @typedef {object} ParticleBlueprint
 * @property {number|number[]} [rotation] Orientation angle (in radians).
 * @property {number|number[]} [angularVelocity] Angular rotation speed (in radians per second).
 * @property {number|number[]} [size] The visual size or scale factor. Interpreted by the renderer as pixels, radius, or a transform scale.
 * @property {Color} [color] The particle color, defined by individual RGB channels.
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
     * Continuous emission rate of new particles per second.
     * @type {number}
     */
    particlesPerSecond;

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
     * Emission source mode, defining the geometric distribution and initial direction of emitted particles.
     * The default direction depends on both the emission source mode and the emitter type and can be overridden by specifying
     * `particleBlueprint.direction` in the emitter config.
     * @see {@link EmissionSourceValues} for available configuration constants.
     * @type {string}
     */
    emissionSource;

    /**
     * Internal state of the emitter's unique identifier. Defaults to a generated UUID.
     * @type {string}
     */
    #id;

    /**
     * Duration of particle emission (in seconds), where Infinity and negative numbers represent infinite emission.
     * @type {number}
     */
    #duration;

    /**
     * Internal state of the flag indicating whether the emitter is running or not.
     * @type {boolean}
     */
    #enabled;

    /**
     * Configuration settings used to initialize emitted particles.
     * @type {ParticleBlueprint}
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
     * Shared reference to the emitter's visual modifier array.
     * @type {Array<Modifier>}
     */
    #visualModifiers;

    /**
     * Shared reference to the emitter's path modifier array.
     * @type {Array<Modifier>}
     */
    #pathModifiers;

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
            throw new TypeError('[Gnist] Cannot instantiate abstract class Emitter directly.');
        }

        this.#id = config.id ?? crypto.randomUUID();
        this.#enabled = config.enabled ?? true;
        this.particlesPerSecond = config.particlesPerSecond ?? 10;

        this.#duration = (config.duration === Infinity || config.duration < 0) ? -1 : (config.duration ?? -1);

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.emissionSource = config.emissionSource ?? EmissionSource.VOLUME;

        this.#particleBlueprint = config.particleBlueprint ?? {};

        this.#accumulator = 0;
        this.#elapsedTime = 0;

        this.#visualModifiers = [];
        this.#pathModifiers = [];
        this.#scopedForces = [];
    }

    /**
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     * @readonly
     */
    get id() {
        return this.#id;
    }

    /**
     * Flag indicating whether the emitter is running or not.
     * @type {boolean}
     * @readonly
     */
    get enabled() {
        return this.#enabled;
    }

    /**
     * Finds a registered modifier by its unique identifier.
     * @param {string} id The unique identifier of the target modifier.
     * @returns {Modifier|null} The modifier instance if found, null otherwise.
     */
    getModifier(id) {
        return this.#visualModifiers.find(m => m.id === id) ||
               this.#pathModifiers.find(m => m.id === id) ||
               null;
    }

    /**
     * Registers a modifier to be applied to the particles emitted by the emitter.
     * @param {Modifier} modifier Modifier instance to register.
     * @returns {void}
     * @throws {Error}
     */
    addModifier(modifier) {
        const category = modifier.constructor.category;

        switch (category) {
            case ModifierCategory.VISUAL:
                this.#visualModifiers.push(modifier);
                break;
            case ModifierCategory.PATH:
                this.#pathModifiers.push(modifier);
                break;
            default:
                throw new Error(`[Gnist] Unknown modifier category: "${category}"`);
        }
    }

    /**
     * Removes a modifier from any of the emitter's registered modifier lists by its unique identifier.
     * @param {string} id The unique identifier of the target modifier.
     * @returns {boolean} True if found and successfully removed, false otherwise.
     */
    removeModifier(id) {
        const initialLength = this.#visualModifiers.length + this.#pathModifiers.length;

        this.#visualModifiers = this.#visualModifiers.filter(m => m.id !== id);
        this.#pathModifiers = this.#pathModifiers.filter(m => m.id !== id);

        return this.#visualModifiers.length + this.#pathModifiers.length < initialLength;
    }

    /**
     * Finds a registered scoped emitter-specific force by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {Force|null} The force instance if found, null otherwise.
     */
    getScopedForce(id) {
        return this.#scopedForces.find(f => f.id === id) ?? null;
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
     * Removes a scoped emitter-specific force from the emitter's registered forces lists by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {boolean} True if found and successfully removed, false otherwise.
     */
    removeScopedForce(id) {
        const initialLength = this.#scopedForces.length;

        this.#scopedForces = this.#scopedForces.filter(f => f.id !== id);

        return this.#scopedForces.length < initialLength;
    }

    /**
     * Starts or forcefully restarts particle emission from the beginning.
     * Resets internal tracking and sets the emitter to an active state.
     * @returns {void}
     */
    start() {
        this.#enabled = true;
        this.#elapsedTime = 0;
        this.#accumulator = 0;
    }

    /**
     * Temporarily halts particle emission and locks internal tracking.
     * @returns {void}
     */
    pause() {
        this.#enabled = false;
    }

    /**
     * Resumes particle emission and internal tracking from where they were paused.
     * @returns {void}
     */
    resume() {
        this.#enabled = true;
    }

    /**
     * Halts particle emission and resets internal tracking.
     * The emitter is deactivated but remains ready to be started again.
     * @returns {void}
     */
    stop() {
        this.#enabled = false;
        this.#elapsedTime = 0;
        this.#accumulator = 0;
    }

    /**
     * Updates the emitter's internal timer and returns any new particles to be emitted in the current frame.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @param {Array<Particle>} particlePool Reference to the internal collection of active particles in the main {Gnist} class.
     * @returns {void}
     */
    update(dt, particlePool) {
        if (!this.#enabled) {
            return;
        }

        if (this.#duration > 0) {
            this.#elapsedTime += dt;
            if (this.#elapsedTime >= this.#duration) {
                this.stop();
                return;
            }
        }

        this.#accumulator += dt * this.particlesPerSecond;
        const spawnCount = Math.floor(this.#accumulator);
        this.#accumulator -= spawnCount;

        for (let i = 0; i < spawnCount; i++) {
            const particle = new Particle();

            this._initParticle(particle);

            particle.visualModifiers = this.#visualModifiers;
            particle.pathModifiers = this.#pathModifiers;
            particle.scopedForces = this.#scopedForces;

            particlePool.push(particle);
        }
    }

    /**
     * Sets up a particle's movement, visuals, and lifecycle state.
     * @ignore
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    _initParticle(particle) {
        // Blueprint values may be specified either as an explicit value or as a range.
        // Ranges are resolved to a single random value via this.#resolveNumber().

        const blueprint = this.#particleBlueprint;

        this.#initParticleVelocity(particle);

        particle.rotation = this.#resolveNumber(blueprint.rotation, particle.rotation);
        particle.angularVelocity = this.#resolveNumber(blueprint.angularVelocity, particle.angularVelocity);

        particle.size = this.#resolveNumber(blueprint.size, particle.size);
        particle.baseSize = particle.size;

        const pColor = particle.color;
        const bColor = blueprint.color;
        pColor.r = Math.max(0, Math.min(255, bColor?.r ?? 255));
        pColor.g = Math.max(0, Math.min(255, bColor?.g ?? 255));
        pColor.b = Math.max(0, Math.min(255, bColor?.b ?? 255));

        particle.opacity = Math.max(0, Math.min(1, this.#resolveNumber(blueprint.opacity, particle.opacity)));

        particle.age = 0;
        particle.lifespan = this.#resolveNumber(blueprint.lifespan, particle.lifespan);
        particle.alive = true;
    }

    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * This is a fallback value when no explicit `direction` was specified in the emitter config's `particleBlueprint`.
     * @ignore
     * @param {Particle} [_particle] Particle instance. Subclasses may use this when calculating the direction.
     * @returns {number} The default emission direction angle (in radians).
     */
    _getDefaultDirection(_particle) {
        return 0;
    }

    /**
     * Sets up a particle's horizontal and vertical velocity components using the `speed` and `direction` values
     * specified in the emitter config's `particleBlueprint`. If no explicit `direction` was specified, it falls back
     * to the emitter's shape-specific direction.
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    #initParticleVelocity(particle) {
        const blueprint = this.#particleBlueprint;

        const speed = this.#resolveNumber(blueprint.speed, 50);
        const direction = this.#resolveNumber(blueprint.direction, this._getDefaultDirection(particle));

        particle.vx = Math.cos(direction) * speed;
        particle.vy = Math.sin(direction) * speed;
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
