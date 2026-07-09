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
    static get category(): string;
    /**
     * Initializes a modifier.
     * @constructor
     * @param {ModifierConfig} [config={}] Modifier configuration options.
     * @throws {TypeError}
     */
    constructor(config?: ModifierConfig);
    /**
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     */
    id: string;
    /**
     * Applies visual or lifecycle changes to a particle based on its normalized age.
     * @abstract
     * @param {Particle} _particle Particle instance to affect.
     * @param {number} _normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {Error}
     */
    update(_particle: Particle, _normalizedAge: number, _dt: number): void;
}
/**
 * Modifier configuration options.
 */
export type ModifierConfig = {
    /**
     * Unique identifier. Defaults to a generated UUID.
     */
    id?: string | undefined;
};
import { Particle } from '../core/Particle.js';
