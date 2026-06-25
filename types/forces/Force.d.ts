/**
 * Abstract base class for environmental forces. Forces affect the motion of particles.
 * @abstract
 * @class
 */
export class Force {
    /**
     * Initializes an environmental force.
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
     * Applies acceleration to a particle's velocity.
     * @abstract
     * @param {Particle} _particle Particle instance to affect.
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {Error}
     */
    apply(_particle: Particle, _dt: number): void;
}
import { Particle } from '../core/Particle.js';
