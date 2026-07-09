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
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @abstract
     * @type {string}
     * @returns {string}
     * @throws {Error}
     */
    static get category() {
        throw new Error('"category" getter must be implemented by subclass.');
    }

    /**
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     */
    id;

    /**
     * Initializes a modifier.
     * @constructor
     * @param {ModifierConfig} [config={}] Modifier configuration options.
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
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {Error}
     */
    update(_particle, _normalizedAge, _dt) {
        throw new Error('Method update() must be implemented by subclass.');
    }
}
