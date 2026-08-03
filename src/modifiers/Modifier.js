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
     * @ignore
     * @abstract
     * @type {string}
     * @returns {string}
     * @throws {TypeError}
     */
    static get category() {
        throw new TypeError('[Gnist] "category" getter must be implemented by subclass.');
    }

    /**
     * Internal state of the modifier's unique identifier.
     * @type {string}
     */
    #id;

    /**
     * Initializes a modifier.
     * @constructor
     * @param {ModifierConfig} [config={}] Modifier configuration options.
     * @throws {TypeError}
     */
    constructor(config = {}) {
        if (new.target === Modifier) {
            throw new TypeError('[Gnist] Cannot instantiate abstract class Modifier directly.');
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
     * Applies visual or lifecycle changes to a particle based on its normalized age.
     * @ignore
     * @abstract
     * @param {Particle} _particle Particle instance to affect.
     * @param {number} _normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {TypeError}
     */
    update(_particle, _normalizedAge, _dt) {
        throw new TypeError('[Gnist] Method update() must be implemented by subclass.');
    }
}
