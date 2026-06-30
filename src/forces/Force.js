import { Particle } from '../core/Particle.js';

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
export class Force {
    /**
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     */
    id;

    /**
     * Initializes an environmental force.
     * @constructor
     * @param {ForceConfig} [config={}] Force configuration options.
     * @throws {TypeError}
     */
    constructor(config = {}) {
        if (new.target === Force) {
            throw new TypeError('Cannot instantiate abstract class Force directly.');
        }

        this.id = config?.id ?? crypto.randomUUID();
    }

    /**
     * Applies acceleration to a particle's velocity.
     * @abstract
     * @param {Particle} _particle Particle instance to affect.
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {Error}
     */
    apply(_particle, _dt) {
        throw new Error('Method apply() must be implemented by subclass.');
    }
}
