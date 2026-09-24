import { Particle } from '../core/Particle.js';
export type ForceConfig = {
    /**
     * Unique identifier. Defaults to a generated UUID.
     */
    id?: string;
};
/**
 * Force configuration options.
 * @typedef {object} ForceConfig
 * @property {string} [id] Unique identifier. Defaults to a generated UUID.
 */
/**
 * Abstract base class for environmental forces. Forces apply external influences to particle motion.
 * @abstract
 * @class
 */
export declare class Force {
    #private;
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
    get id(): string;
    /**
     * Applies acceleration to a particle's velocity.
     * @ignore
     * @abstract
     * @param {Particle} _particle Particle instance to affect.
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {TypeError}
     */
    apply(_particle: Particle, _dt: number): void;
}
