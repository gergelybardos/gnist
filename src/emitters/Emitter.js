import { Force } from '../forces/Force.js';
import { Modifier } from '../modifiers/Modifier.js';
import { Particle } from '../core/Particle.js';
import { ModifierCategory, EmissionSource } from '../shared/Constants.js';

/**
 * @import { Gnist } from '../core/Gnist.js'
 * @import { Color, EmissionSourceValues } from '../shared/Types.js'
 * @import { PointEmitterConfigSpecifics } from './PointEmitter'
 * @import { LineEmitterConfigSpecifics } from './LineEmitter'
 * @import { RectEmitterConfigSpecifics } from './RectEmitter'
 * @import { EllipseEmitterConfigSpecifics } from './EllipseEmitter'
 */

/**
 * Emitter configuration options.
 * @typedef {object} EmitterConfig
 * @property {string} [id] Unique identifier. Defaults to a generated UUID.
 * @property {boolean} [enabled=true] Flag indicating whether the emitter is running or not.
 * @property {number} [particlesPerSecond=10] Continuous emission rate of new particles per second.
 * @property {number} [duration=Infinity] Duration of particle emission (in seconds) or JavaScript's native Infinity global object or a negative number for infinite emission.
 * @property {string} [emissionSource=EmissionSource.VOLUME] Emission source mode, defining the geometric distribution and initial direction of emitted particles.
 * The default direction depends on both the emission source mode and the emitter type and can be overridden by specifying `particleBlueprint.direction` in the emitter config.
 * See {@link EmissionSourceValues} for available configuration constants.
 * @property {ParticleBlueprint} [particleBlueprint={}] Configuration for emitted particles.
 */

/**
 * Temporary emitter configuration option overrides for an `emit()` call.
 * Allows overriding emitter-specific geometry (e.g., `x`, `y`, `width`, `height`).
 * @typedef {Partial<PointEmitterConfigSpecifics | LineEmitterConfigSpecifics | RectEmitterConfigSpecifics | EllipseEmitterConfigSpecifics>} EmitterOverrides
 */

/**
 * Callback executed during particle lifecycle events.
 * @callback ParticleLifecycleCallback
 * @param {Particle} particle The particle instance.
 * @returns {void}
 */

/**
 * Callback to retrieve a particle instance from the reusable particles.
 * @callback AcquireParticleCallback
 * @returns {Particle} Reusable particle instance.
 */

/**
 * Configuration options used by emitters to initialize particles at emission.
 * This object is not runtime Particle state and does not correspond directly to Particle properties.
 * Options are interpreted either directly or indirectly to derive Particle properties.
 * Most options may be specified as a single number or a [min, max] range array.
 * @typedef {object} ParticleBlueprint
 * @property {ParticleLifecycleCallback} [onDeath] Lifecycle callback executed at particle death.
 * @property {ParticleLifecycleCallback} [onInterval] Lifecycle callback executed periodically at particle update. The interval is specified by the `interval` property.
 * @property {number|number[]} [rotation] Orientation angle (in radians).
 * @property {number|number[]} [angularVelocity] Angular rotation speed (in radians per second).
 * @property {number|number[]} [size] The visual size or scale factor. Interpreted by the renderer as pixels, radius, or a transform scale.
 * @property {Color} [color] The particle color, defined by individual RGB channels.
 * @property {number|number[]} [opacity] Transparency (0.0 = fully transparent, 1.0 = fully opaque).
 * @property {number|number[]} [lifespan] Maximum allowed lifespan (in seconds).
 * @property {boolean} [loopLifecycle] Flag indicating whether the particle's age resets to zero upon reaching its lifespan instead of dying, creating a continuous loop for modifiers.
 * @property {string} [loopMode] Determines how particle age is interpreted by modifiers when the particle loops.
 * @property {number|number[]} [speed] Speed (in pixels per second) used to derive the particle's initial horizontal and vertical velocity.
 * @property {number|number[]} [direction] Movement direction angle (in radians) used to derive the particle's initial horizontal and vertical velocity.
 * @property {number|number[]} [interval] Time interval between `onInterval` callback executions (in seconds).
 */

/**
 * Engine context providing particle acquisition and queueing callbacks.
 * @typedef {object} EngineContext
 * @property {AcquireParticleCallback} acquireParticle Callback to retrieve a particle instance from the reusable particles.
 * @property {ParticleLifecycleCallback} enqueueParticle Callback to queue a newly emitted particle into the pending particles.
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
     * Emission source mode, defining the geometric distribution and initial direction of emitted particles.
     * The default direction depends on both the emission source mode and the emitter type and can be overridden by specifying `particleBlueprint.direction` in the emitter config.
     * @see {@link EmissionSourceValues} for available configuration constants.
     * @type {string}
     */
    emissionSource;

    /**
     * List of property names on the emitter instance that can be temporarily overridden.
     * @ignore
     * @type {Array<string>}
     */
    _overridableFields;

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
     * Engine context providing particle acquisition and queueing callbacks.
     * @type {EngineContext|null}
     */
    #engineContext = null;

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
        this.#accumulator = 0;
        this.#elapsedTime = 0;

        this.particlesPerSecond = config.particlesPerSecond ?? 10;

        this.#duration = (config.duration < 0) ? Infinity : (config.duration ?? Infinity);

        this.emissionSource = config.emissionSource ?? EmissionSource.VOLUME;

        this.#particleBlueprint = config.particleBlueprint ?? {};

        this.#visualModifiers = [];
        this.#pathModifiers = [];
        this.#scopedForces = [];

        this._overridableFields = [];
    }

    /**
     * Read-only.
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     */
    get id() {
        return this.#id;
    }

    /**
     * Read-only.
     * Flag indicating whether the emitter is running or not.
     * @type {boolean}
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
     * Updates the emitter's internal timer and enqueues newly emitted particles into the active particles.
     * @ignore
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @param {Array<Particle>} particles Reference to the internal collection of active particles in {@link Gnist}.
     * @param {function(): Particle} acquireParticle Callback to retrieve a particle instance from the reusable particles.
     * @returns {void}
     */
    update(dt, particles, acquireParticle) {
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
        const particleCount = Math.floor(this.#accumulator);
        this.#accumulator -= particleCount;

        for (let i = 0; i < particleCount; i++) {
            const particle = acquireParticle();

            this._initParticle(particle);

            particle.visualModifiers = this.#visualModifiers;
            particle.pathModifiers = this.#pathModifiers;
            particle.scopedForces = this.#scopedForces;

            particles.push(particle);
        }
    }

    /**
     * Instantly emits particles using optional overrides.
     * @param {number} particleCount Number of particles to emit.
     * @param {EmitterOverrides} [emitterOverrides={}] Temporary overrides for emitter-specific geometry (e.g., `x`, `y`, `width`, `height`).
     * @param {ParticleBlueprint} [particleBlueprintOverrides={}] Temporary overrides for the particle blueprint.
     * @returns {void}
     */
    emit(particleCount, emitterOverrides = {}, particleBlueprintOverrides = {}) {
        if (!this.#engineContext) {
            return;
        }

        const originalEmitterState = {};

        for (const field of this._overridableFields) {
            const overrideValue = emitterOverrides[field];

            if (overrideValue !== null && overrideValue !== undefined) {
                if (field in this) {
                    originalEmitterState[field] = this[field];
                }

                this[field] = overrideValue;
            }
        }

        const { acquireParticle, enqueueParticle } = this.#engineContext;

        for (let i = 0; i < particleCount; i++) {
            const particle = acquireParticle();

            this._initParticle(particle, particleBlueprintOverrides);

            particle.visualModifiers = this.#visualModifiers;
            particle.pathModifiers = this.#pathModifiers;
            particle.scopedForces = this.#scopedForces;

            enqueueParticle(particle);
        }

        for (const key in originalEmitterState) {
            this[key] = originalEmitterState[key];
        }
    }

    /**
     * Binds the engine context. Called by {@link Gnist} when the emitter is registered with the simulation pipeline.
     * @ignore
     * @param {EngineContext} context Engine context providing particle acquisition and queueing callbacks.
     * @returns {void}
     */
    bindEngineContext(context) {
        this.#engineContext = context;
    }

    /**
     * Unbinds the engine context. Called by {@link Gnist} when the emitter is removed from the simulation pipeline.
     * @ignore
     * @returns {void}
     */
    unbindEngineContext() {
        this.#engineContext = null;
    }

    /**
     * Sets up a particle's movement, visuals, and lifecycle state based on both the `particleBlueprint` object the emitter was configured with and optional temporary overrides.
     * @ignore
     * @param {Particle} particle Particle instance to initialize.
     * @param {ParticleBlueprint} [particleBlueprintOverrides] Temporary overrides for the particle blueprint.
     * @returns {void}
     */
    _initParticle(particle, particleBlueprintOverrides = {}) {
        // Keep this allocation-free as this is a hot path executed for every particle, including sub-emitter particles.

        const blueprint = this.#particleBlueprint;

        this.#initParticleVelocity(particle, particleBlueprintOverrides);

        particle.originX = particle.x;
        particle.originY = particle.y;

        particle.rotation = this.#resolveNumber(particleBlueprintOverrides?.rotation ?? blueprint.rotation, particle.rotation);
        particle.angularVelocity = this.#resolveNumber(particleBlueprintOverrides?.angularVelocity ?? blueprint.angularVelocity, particle.angularVelocity);

        particle.size = this.#resolveNumber(particleBlueprintOverrides?.size ?? blueprint.size, particle.size);
        particle.baseSize = particle.size;

        const pColor = particle.color;
        const bColor = particleBlueprintOverrides?.color ?? blueprint.color;
        pColor.r = Math.max(0, Math.min(255, bColor?.r ?? 255));
        pColor.g = Math.max(0, Math.min(255, bColor?.g ?? 255));
        pColor.b = Math.max(0, Math.min(255, bColor?.b ?? 255));

        particle.opacity = Math.max(0, Math.min(1, this.#resolveNumber(particleBlueprintOverrides?.opacity ?? blueprint.opacity, particle.opacity)));

        particle.age = 0;
        particle.lifespan = this.#resolveNumber(particleBlueprintOverrides?.lifespan ?? blueprint.lifespan, particle.lifespan);
        particle.loopLifecycle = particleBlueprintOverrides?.loopLifecycle ?? blueprint.loopLifecycle ?? particle.loopLifecycle;
        particle.loopMode = particleBlueprintOverrides?.loopMode ?? blueprint.loopMode ?? particle.loopMode;
        particle.alive = true;
        particle.interval = this.#resolveNumber(
            particleBlueprintOverrides?.interval ?? blueprint.interval,
            0
        );

        particle.onDeath = particleBlueprintOverrides?.onDeath ?? blueprint.onDeath ?? null;
        particle.onInterval = particleBlueprintOverrides?.onInterval ?? blueprint.onInterval ?? null;
    }

    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * This is a fallback value when no explicit `direction` was specified in the emitter config's `particleBlueprint`.
     * @ignore
     * @abstract
     * @param {Particle} _particle The newly emitted Particle instance providing coordinates for the direction calculation.
     * @returns {number} The default emission direction angle (in radians).
     * @throws {TypeError}
     */
    _getInitialParticleDirection(_particle) {
        throw new TypeError('[Gnist] Method _getInitialParticleDirection() must be implemented by subclass.');
    }

    /**
     * Sets up a particle's horizontal and vertical velocity components using the `speed` and `direction` values specified in the emitter config's `particleBlueprint`.
     * If no explicit `direction` was specified, it falls back to the emitter's shape-specific direction.
     * @param {Particle} particle Particle instance to initialize.
     * @param {ParticleBlueprint|null} [particleBlueprintOverrides=null] Temporary overrides for the particle blueprint.
     * @returns {void}
     */
    #initParticleVelocity(particle, particleBlueprintOverrides) {
        const blueprint = this.#particleBlueprint;

        const speed = this.#resolveNumber(particleBlueprintOverrides?.speed ?? blueprint.speed, 50);
        const direction = this.#resolveNumber(particleBlueprintOverrides?.direction ?? blueprint.direction, this._getInitialParticleDirection(particle));

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
