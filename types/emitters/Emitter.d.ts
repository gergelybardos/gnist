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
     * Initializes a particle emitter.
     * @constructor
     * @param {EmitterConfig} [config={}] Emitter configuration options.
     * @throws {TypeError}
     */
    constructor(config?: EmitterConfig);
    /**
     * Continuous emission rate of new particles per second.
     * @type {number}
     */
    particlesPerSecond: number;
    /**
     * Current horizontal coordinate of the emitter origin.
     * @type {number}
     */
    x: number;
    /**
     * Current vertical coordinate of the emitter origin.
     * @type {number}
     */
    y: number;
    /**
     * Emission source mode, defining the geometric distribution and initial direction of emitted particles.
     * The default direction depends on both the emission source mode and the emitter type and can be overridden by specifying
     * `particleBlueprint.direction` in the emitter config.
     * @see {@link EmissionSourceValues} for available configuration constants.
     * @type {string}
     */
    emissionSource: string;
    /**
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     * @readonly
     */
    readonly get id(): string;
    /**
     * Flag indicating whether the emitter is running or not.
     * @type {boolean}
     * @readonly
     */
    readonly get enabled(): boolean;
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
     * Updates the emitter's internal timer and returns any new particles to be emitted in the current frame.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @param {Array<Particle>} particlePool Reference to the internal collection of active particles in the main {Gnist} class.
     * @returns {void}
     */
    update(dt: number, particlePool: Array<Particle>): void;
    /**
     * Sets up a particle's movement, visuals, and lifecycle state.
     * @ignore
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    _initParticle(particle: Particle): void;
    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * This is a fallback value when no explicit `direction` was specified in the emitter config's `particleBlueprint`.
     * @ignore
     * @param {Particle} [_particle] Particle instance. Subclasses may use this when calculating the direction.
     * @returns {number} The default emission direction angle (in radians).
     */
    _getDefaultDirection(_particle?: Particle): number;
    #private;
}
/**
 * Emitter configuration options.
 */
export type EmitterConfig = {
    /**
     * Unique identifier. Defaults to a generated UUID.
     */
    id?: string | undefined;
    /**
     * Flag indicating whether the emitter is running or not.
     */
    enabled?: boolean | undefined;
    /**
     * Continuous emission rate of new particles per second.
     */
    particlesPerSecond?: number | undefined;
    /**
     * Duration of particle emission (in seconds) or JavaScript's native Infinity global object or a negative number for infinite emission.
     */
    duration?: number | undefined;
    /**
     * Current horizontal coordinate of the emitter origin.
     */
    x?: number | undefined;
    /**
     * Current vertical coordinate of the emitter origin.
     */
    y?: number | undefined;
    /**
     * Emission source mode, defining the geometric distribution and initial direction of emitted particles.
     * The default direction depends on both the emission source mode and the emitter type and can be overridden by specifying `particleBlueprint.direction` in the emitter config.
     * See {@link EmissionSourceValues} for available configuration constants.
     */
    emissionSource?: string | undefined;
    /**
     * Configuration for emitted particles.
     */
    particleBlueprint?: ParticleBlueprint | undefined;
};
/**
 * Configuration options used by emitters to initialize particles at emission.
 * This object is not runtime Particle state and does not correspond directly to Particle properties.
 * Options are interpreted either directly or indirectly to derive Particle properties.
 * Most options may be specified as a single number or a [min, max] range array.
 */
export type ParticleBlueprint = {
    /**
     * Orientation angle (in radians).
     */
    rotation?: number | number[] | undefined;
    /**
     * Angular rotation speed (in radians per second).
     */
    angularVelocity?: number | number[] | undefined;
    /**
     * The visual size or scale factor. Interpreted by the renderer as pixels, radius, or a transform scale.
     */
    size?: number | number[] | undefined;
    /**
     * The particle color, defined by individual RGB channels.
     */
    color?: Color | undefined;
    /**
     * Transparency (0.0 = fully transparent, 1.0 = fully opaque).
     */
    opacity?: number | number[] | undefined;
    /**
     * Maximum allowed lifespan (in seconds).
     */
    lifespan?: number | number[] | undefined;
    /**
     * Speed (in pixels per second) used to derive the particle's initial horizontal and vertical velocity.
     */
    speed?: number | number[] | undefined;
    /**
     * Movement direction angle (in radians) used to derive the particle's initial horizontal and vertical velocity.
     */
    direction?: number | number[] | undefined;
};
import { Modifier } from '../modifiers/Modifier.js';
import { Force } from '../forces/Force.js';
import { Particle } from '../core/Particle.js';
import type { Color } from '../shared/Types.js';
