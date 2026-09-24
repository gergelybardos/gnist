import { Force } from '../forces/Force.js';
import { Modifier } from '../modifiers/Modifier.js';
import { Particle } from '../core/Particle.js';
import type { Color } from '../shared/Types.js';
import type { PointEmitterConfigSpecifics } from './PointEmitter';
import type { LineEmitterConfigSpecifics } from './LineEmitter';
import type { RectEmitterConfigSpecifics } from './RectEmitter';
import type { EllipseEmitterConfigSpecifics } from './EllipseEmitter';
export type EmitterConfig = {
    /**
     * Unique identifier. Defaults to a generated UUID.
     */
    id?: string;
    /**
     * Flag indicating whether the emitter is running or not.
     */
    enabled?: boolean;
    /**
     * Continuous emission rate of new particles per second.
     */
    particlesPerSecond?: number;
    /**
     * Duration of particle emission (in seconds) or JavaScript's native Infinity global object or a negative number for infinite emission.
     */
    duration?: number;
    /**
     * Emission source mode, defining the geometric distribution and initial direction of emitted particles.
     * The default direction depends on both the emission source mode and the emitter type and can be overridden by specifying `particleBlueprint.direction` in the emitter config.
     * See {@link EmissionSourceValues} for available configuration constants.
     */
    emissionSource?: string;
    /**
     * Configuration for emitted particles.
     */
    particleBlueprint?: ParticleBlueprint;
};
export type EmitterOverrides = Partial<PointEmitterConfigSpecifics | LineEmitterConfigSpecifics | RectEmitterConfigSpecifics | EllipseEmitterConfigSpecifics>;
export type ParticleCallback = (particle: Particle) => void;
export type AcquireParticleCallback = () => Particle;
export type ParticleBlueprint = {
    /**
     * Lifecycle callback executed at particle death.
     */
    onDeath?: ParticleCallback;
    /**
     * Lifecycle callback executed periodically at particle update. The interval is specified by the `interval` property.
     */
    onInterval?: ParticleCallback;
    /**
     * Orientation angle (in radians).
     */
    rotation?: number | number[];
    /**
     * Angular rotation speed (in radians per second).
     */
    angularVelocity?: number | number[];
    /**
     * The visual size or scale factor. Interpreted by the renderer as pixels, radius, or a transform scale.
     */
    size?: number | number[];
    /**
     * The particle color, defined by individual RGB channels.
     */
    color?: Color;
    /**
     * Transparency (0.0 = fully transparent, 1.0 = fully opaque).
     */
    opacity?: number | number[];
    /**
     * Maximum allowed lifespan (in seconds).
     */
    lifespan?: number | number[];
    /**
     * Speed (in pixels per second) used to derive the particle's initial horizontal and vertical velocity.
     */
    speed?: number | number[];
    /**
     * Movement direction angle (in radians) used to derive the particle's initial horizontal and vertical velocity.
     */
    direction?: number | number[];
    /**
     * Time interval between `onInterval` callback executions (in seconds).
     */
    interval?: number | number[];
};
export type EngineContext = {
    /**
     * Callback to retrieve a particle instance from the reusable particles.
     */
    acquireParticle: AcquireParticleCallback;
    /**
     * Callback to queue a newly emitted particle into the pending particles.
     */
    enqueueParticle: ParticleCallback;
};
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
 * @callback ParticleCallback
 * @param {Particle} particle The particle instance.
 * @returns {void}
 */
/**
 * Callback used to acquire a reusable particle instance.
 * @callback AcquireParticleCallback
 * @returns {Particle} Reusable particle instance.
 */
/**
 * Configuration options used by emitters to initialize particles at emission.
 * This object is not runtime Particle state and does not correspond directly to Particle properties.
 * Options are interpreted either directly or indirectly to derive Particle properties.
 * Most options may be specified as a single number or a [min, max] range array.
 * @typedef {object} ParticleBlueprint
 * @property {ParticleCallback} [onDeath] Lifecycle callback executed at particle death.
 * @property {ParticleCallback} [onInterval] Lifecycle callback executed periodically at particle update. The interval is specified by the `interval` property.
 * @property {number|number[]} [rotation] Orientation angle (in radians).
 * @property {number|number[]} [angularVelocity] Angular rotation speed (in radians per second).
 * @property {number|number[]} [size] The visual size or scale factor. Interpreted by the renderer as pixels, radius, or a transform scale.
 * @property {Color} [color] The particle color, defined by individual RGB channels.
 * @property {number|number[]} [opacity] Transparency (0.0 = fully transparent, 1.0 = fully opaque).
 * @property {number|number[]} [lifespan] Maximum allowed lifespan (in seconds).
 * @property {number|number[]} [speed] Speed (in pixels per second) used to derive the particle's initial horizontal and vertical velocity.
 * @property {number|number[]} [direction] Movement direction angle (in radians) used to derive the particle's initial horizontal and vertical velocity.
 * @property {number|number[]} [interval] Time interval between `onInterval` callback executions (in seconds).
 */
/**
 * Engine context providing particle acquisition and queueing callbacks.
 * @typedef {object} EngineContext
 * @property {AcquireParticleCallback} acquireParticle Callback to retrieve a particle instance from the reusable particles.
 * @property {ParticleCallback} enqueueParticle Callback to queue a newly emitted particle into the pending particles.
 */
/**
 * Abstract base class for particle emitters.
 * @abstract
 * @class
 */
export declare class Emitter {
    #private;
    /**
     * Continuous emission rate of new particles per second.
     * @type {number}
     */
    particlesPerSecond: number;
    /**
     * Emission source mode, defining the geometric distribution and initial direction of emitted particles.
     * The default direction depends on both the emission source mode and the emitter type and can be overridden by specifying
     * `particleBlueprint.direction` in the emitter config.
     * @see {@link EmissionSourceValues} for available configuration constants.
     * @type {string}
     */
    emissionSource: string;
    /**
     * List of property names on the emitter instance that can be temporarily overridden.
     * @ignore
     * @type {Array<string>}
     */
    _overridableFields: Array<string>;
    /**
     * Initializes a particle emitter.
     * @constructor
     * @param {EmitterConfig} [config={}] Emitter configuration options.
     * @throws {TypeError}
     */
    constructor(config?: EmitterConfig);
    /**
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     */
    get id(): string;
    /**
     * Flag indicating whether the emitter is running or not.
     * @type {boolean}
     */
    get enabled(): boolean;
    /**
     * Finds a registered modifier by its unique identifier.
     * @param {string} id The unique identifier of the target modifier.
     * @returns {Modifier|null} The modifier instance if found, null otherwise.
     */
    getModifier(id: string): Modifier | null;
    /**
     * Registers a modifier to be applied to the particles emitted by the emitter.
     * @param {Modifier} modifier Modifier instance to register.
     * @returns {void}
     * @throws {Error}
     */
    addModifier(modifier: Modifier): void;
    /**
     * Removes a modifier from any of the emitter's registered modifier lists by its unique identifier.
     * @param {string} id The unique identifier of the target modifier.
     * @returns {boolean} True if found and successfully removed, false otherwise.
     */
    removeModifier(id: string): boolean;
    /**
     * Finds a registered scoped emitter-specific force by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {Force|null} The force instance if found, null otherwise.
     */
    getScopedForce(id: string): Force | null;
    /**
     * Registers a scoped emitter-specific force to be applied to the particles emitted by the emitter.
     * @param {Force} force Force instance to register.
     * @returns {void}
     */
    addScopedForce(force: Force): void;
    /**
     * Removes a scoped emitter-specific force from the emitter's registered forces lists by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {boolean} True if found and successfully removed, false otherwise.
     */
    removeScopedForce(id: string): boolean;
    /**
     * Starts or forcefully restarts particle emission from the beginning.
     * Resets internal tracking and sets the emitter to an active state.
     * @returns {void}
     */
    start(): void;
    /**
     * Temporarily halts particle emission and locks internal tracking.
     * @returns {void}
     */
    pause(): void;
    /**
     * Resumes particle emission and internal tracking from where they were paused.
     * @returns {void}
     */
    resume(): void;
    /**
     * Halts particle emission and resets internal tracking.
     * The emitter is deactivated but remains ready to be started again.
     * @returns {void}
     */
    stop(): void;
    /**
     * Updates the emitter's internal timer and enqueues newly emitted particles into the active particles.
     * @ignore
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @param {Array<Particle>} particles Reference to the internal collection of active particles in {@link Gnist}.
     * @param {function(): Particle} acquireParticle Callback to retrieve a particle instance from the reusable particles.
     * @returns {void}
     */
    update(dt: number, particles: Array<Particle>, acquireParticle: Function): void;
    /**
     * Instantly emits particles using optional overrides.
     * @param {number} particleCount Number of particles to emit.
     * @param {EmitterOverrides} [emitterOverrides={}] Temporary overrides for emitter-specific geometry (e.g., `x`, `y`, `width`, `height`).
     * @param {ParticleBlueprint} [particleBlueprintOverrides={}] Temporary overrides for the particle blueprint.
     * @returns {void}
     */
    emit(particleCount: number, emitterOverrides?: EmitterOverrides, particleBlueprintOverrides?: ParticleBlueprint): void;
    /**
     * Binds the engine context. Called by {@link Gnist} when the emitter is registered with the simulation pipeline.
     * @ignore
     * @param {EngineContext} context Engine context providing particle acquisition and queueing callbacks.
     * @returns {void}
     */
    bindEngineContext(context: EngineContext): void;
    /**
     * Unbinds the engine context. Called by {@link Gnist} when the emitter is removed from the simulation pipeline.
     * @ignore
     * @returns {void}
     */
    unbindEngineContext(): void;
    /**
     * Sets up a particle's movement, visuals, and lifecycle state.
     * @ignore
     * @param {Particle} particle Particle instance to initialize.
     * @param {ParticleBlueprint} [particleBlueprintOverrides] Temporary overrides for the particle blueprint.
     * @returns {void}
     */
    _initParticle(particle: Particle, particleBlueprintOverrides?: ParticleBlueprint): void;
    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * This is a fallback value when no explicit `direction` was specified in the emitter config's `particleBlueprint`.
     * @ignore
     * @abstract
     * @param {Particle} _particle The newly emitted Particle instance providing coordinates for the direction calculation.
     * @returns {number} The default emission direction angle (in radians).
     * @throws {TypeError}
     */
    _getInitialParticleDirection(_particle: Particle): number;
}
