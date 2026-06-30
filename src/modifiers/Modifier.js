import { Particle } from '../core/Particle.js';

/**
 * Modifier configuration options.
 * @typedef {object} ModifierConfig
 * @property {string} [id] Unique identifier. Defaults to a generated UUID.
 */

/**
 * Abstract base class for particle modifiers.
 * Modifiers apply per-particle state and appearance transformations based on normalized particle age.
 * @abstract
 * @class
 */
export class Modifier {
    /**
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     */
    id;

    /**
     * Initializes a modifier.
     * @constructor
     * @param {ModifierConfig} [config={}] Configuration parameters.
     * @throws {TypeError}
     */
    constructor(config = {}) {
        if (new.target === Modifier) {
            throw new TypeError('Cannot instantiate abstract class Modifier directly.');
        }

        this.id = config?.id ?? crypto.randomUUID();
    }

    /**
     * Applies visual or lifecycle changes to a particle based on its normalized age.
     * @abstract
     * @param {Particle} _particle Particle instance to affect.
     * @param {number} _normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @returns {void}
     * @throws {Error}
     */
    update(_particle, _normalizedAge) {
        throw new Error('Method update() must be implemented by subclass.');
    }
}
