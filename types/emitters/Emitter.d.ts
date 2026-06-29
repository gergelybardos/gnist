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
    id: string;
    /**
     * Flag indicating whether the emitter is running or not.
     * @type {boolean}
     */
    enabled: boolean;
    /**
     * Flag indicating whether a finite-duration emitter restarts when its time is up.
     * @type {boolean}
     */
    looping: boolean;
    /**
     * Continuous emission rate of new particles per second.
     * @type {number}
     */
    particlesPerSecond: number;
    /**
     * Duration of particle emission (in seconds), where -1 represents infinite emission.
     * @type {number}
     */
    duration: number;
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
     * Registers a modifier to be applied to the particles emitted by the emitter.
     * @param {Modifier} modifier Modifier instance to register.
     * @returns {void}
     */
    addModifier(modifier: Modifier): void;
    /**
     * Registers a scoped emitter-specific force to be applied to the particles emitted by the emitter.
     * @param {Force} force Force instance to register.
     * @returns {void}
     */
    addScopedForce(force: Force): void;
    /**
     * Updates the emitter's internal timer and returns any new particles to be emitted in the current frame.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {Array<Particle>} An array of particles emitted this frame.
     */
    update(dt: number): Array<Particle>;
    /**
     * Sets up a particle's movement, visuals, and lifecycle state.
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    initParticle(particle: Particle): void;
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
     * Flag indicating whether a finite-duration emitter restarts when its time is up.
     */
    looping?: boolean | undefined;
    /**
     * Continuous emission rate of new particles per second.
     */
    particlesPerSecond?: number | undefined;
    /**
     * Duration of particle emission (in seconds), where -1 represents infinite emission.
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
     * Orientation angle in radians.
     */
    rotation?: number | number[] | undefined;
    /**
     * Angular rotation speed (radians per second).
     */
    angularVelocity?: number | number[] | undefined;
    /**
     * The visual size or scale factor. Interpreted by the renderer as pixels, radius, or a transform scale.
     */
    size?: number | number[] | undefined;
    /**
     * RGB color channels.
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
