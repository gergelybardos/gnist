/**
 * Abstract base class for particle emitters.
 * @abstract
 * @class
 */
export class Emitter {
    /**
     * Initializes a particle emitter.
     * @constructor
     * @param {object} [config={}] Configuration parameters.
     * @throws {TypeError}
     */
    constructor(config?: object);
    /**
     * Unique identifier. Defaults to an auto-generated UUID if none is provided.
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
import { Modifier } from '../modifiers/Modifier.js';
import { Force } from '../forces/Force.js';
import { Particle } from '../core/Particle.js';
