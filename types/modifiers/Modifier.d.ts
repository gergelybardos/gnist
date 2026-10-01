import { Particle } from '../core/Particle.js';
export type ModifierConfig = {
    /**
     * Unique identifier. Defaults to a generated UUID.
     */
    id?: string;
};
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
export declare class Modifier {
    #private;
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @abstract
     * @type {string}
     * @returns {string}
     * @throws {TypeError}
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
     * Read-only.
     * Unique identifier. Defaults to a generated UUID.
     * @type {string}
     */
    get id(): string;
    /**
     * Applies changes to a particle based on its normalized lifecycle progress.
     * @ignore
     * @abstract
     * @param {Particle} _particle Particle instance to affect.
     * @param {number} _normalizedProgress Normalized lifecycle progress (0.0 = start, 1.0 = end).
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {TypeError}
     */
    update(_particle: Particle, _normalizedProgress: number, _dt: number): void;
}
