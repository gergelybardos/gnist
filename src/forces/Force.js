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
     * Internal state of the force's unique identifier.
     * @type {string}
     */
    #id;

    /**
     * Initializes an environmental force.
     * @constructor
     * @param {ForceConfig} [config={}] Force configuration options.
     * @throws {TypeError}
     */
    constructor(config = {}) {
        if (new.target === Force) {
            throw new TypeError('[Gnist] Cannot instantiate abstract class Force directly.');
        }

        this.#id = config?.id ?? crypto.randomUUID();
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
     * Applies acceleration to a particle's velocity.
     * @ignore
     * @abstract
     * @param {Particle} _particle Particle instance to affect.
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {TypeError}
     */
    apply(_particle, _dt) {
        throw new TypeError('[Gnist] Method apply() must be implemented by subclass.');
    }
}
