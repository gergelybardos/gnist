import { Particle } from '../../core/Particle.js';
import { ModifierCategory } from '../../shared/Constants.js';

import { Modifier } from '../Modifier.js';

/**
 * @import { ModifierConfig } from './Modifier.js';
 */

/**
 * Spin configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} SpinConfig
 * @property {number} [angularVelocity] Optional spin rate in radians per second. If omitted, uses particle.angularVelocity.
 */

/**
 * Particle modifier that continuously updates a particle's orientation based on angular velocity.
 * @class
 * @extends Modifier
 */
export class Spin extends Modifier {
    // Skipped @override because it fails on static members in TypeScript
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @type {string}
     * @returns {string}
     */
    static get category() {
        return ModifierCategory.VISUAL;
    }

    /**
     * Explicit spin rate override (in radians per second).
     * @type {number|null}
     */
    angularVelocity;

    /**
     * Initializes a spin modifier with an optional fixed angular velocity rate.
     * @constructor
     * @param {SpinConfig} [config={}] Spin configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.angularVelocity = config.angularVelocity ?? null;
    }

    /**
     * Advances the particle's rotation angle based on angular velocity and frame time delta.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(particle, normalizedAge, dt) {
        const rate = this.angularVelocity ?? particle.angularVelocity ?? 0;
        particle.rotation += rate * dt;
    }
}
