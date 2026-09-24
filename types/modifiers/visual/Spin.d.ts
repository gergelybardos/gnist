import { Particle } from '../../core/Particle.js';
import { Modifier } from '../Modifier.js';
import type { ModifierConfig } from '../Modifier.js';
export type SpinConfigSpecifics = {
    /**
     * Optional spin rate in radians per second. If omitted, the particle's own angularVelocity value is used.
     */
    angularVelocity?: number;
};
export type SpinConfig = ModifierConfig & SpinConfigSpecifics;
/**
 * @import { ModifierConfig } from '../Modifier.js';
 */
/**
 * Spin-specific configuration options.
 * @typedef {object} SpinConfigSpecifics
 * @property {number} [angularVelocity] Optional spin rate in radians per second. If omitted, the particle's own angularVelocity value is used.
 */
/**
 * Spin configuration options. Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & SpinConfigSpecifics} SpinConfig
 */
/**
 * Particle modifier that continuously updates the orientation of the particles based on their angular velocity.
 * @class
 * @extends Modifier
 */
export declare class Spin extends Modifier {
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category(): string;
    /**
     * Explicit spin rate override (in radians per second).
     * @type {number|null}
     */
    angularVelocity: number | null;
    /**
     * Initializes a spin modifier with an optional fixed angular velocity rate.
     * @constructor
     * @param {SpinConfig} [config={}] Spin configuration options.
     */
    constructor(config?: SpinConfig);
    /**
     * Advances the particle's rotation angle based on angular velocity and frame time delta.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(particle: Particle, normalizedAge: number, dt: number): void;
}
