/**
 * Force configuration options.
 * @typedef {object} ForceConfig
 * @property {string} [id] Unique identifier. Defaults to a generated UUID.
 */
/**
 * Abstract base class for environmental forces. Forces affect the motion of particles.
 * @abstract
 * @class
 */
export class Force {
    /**
     * Initializes an environmental force.
     * @constructor
     * @param {ForceConfig} [config={}] Force configuration options.
     * @throws {TypeError}
     */
    constructor(config?: ForceConfig);
    /**
     * Unique identifier. Defaults to a generated UUID.
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
/**
 * Force configuration options.
 */
export type ForceConfig = {
    /**
     * Unique identifier. Defaults to a generated UUID.
     */
    id?: string | undefined;
};
import { Particle } from '../core/Particle.js';
