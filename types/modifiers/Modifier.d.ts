/**
 * Modifier configuration options.
 * @typedef {object} ModifierConfig
 * @property {string} [id] Unique identifier. Defaults to a generated UUID.
 */
/**
 * Abstract base class for particle modifiers.
 * Modifiers apply visual or lifecycle changes to particles based on their normalized age.
 * @abstract
 * @class
 */
export class Modifier {
    /**
     * Initializes a modifier.
     * @constructor
     * @param {ModifierConfig} [config={}] Configuration parameters.
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
     * @returns {void}
     * @throws {Error}
     */
    update(_particle: Particle, _normalizedAge: number): void;
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
