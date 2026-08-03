import { Particle } from '../../core/Particle.js';
import { ModifierCategory } from '../../shared/Constants.js';

import { Modifier } from '../Modifier.js';

/**
 * @import { ModifierConfig } from './Modifier.js';
 */

/**
 * RotationTween configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} RotationTweenConfig
 * @property {number} [startRotation=0] RotationTween angle (in radians) at particle emission.
 * @property {number} [endRotation=6.283185] RotationTween angle (in radians) at particle death.
 */

/**
 * Particle modifier that interpolates the rotation angle of particles over their lifespan between two target values.
 * @class
 * @extends Modifier
 */
export class RotationTween extends Modifier {
    // Skipped @override because it fails on static members in TypeScript
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category() {
        return ModifierCategory.VISUAL;
    }

    /**
     * RotationTween angle (in radians) at particle emission.
     * @type {number}
     */
    startRotation;

    /**
     * RotationTween angle (in radians) at particle death.
     * @type {number}
     */
    endRotation;

    /**
     * Initializes a rotation tween modifier with starting and ending rotation angles.
     * @constructor
     * @param {RotationTweenConfig} [config={}] RotationTween configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.startRotation = config.startRotation ?? 0;
        this.endRotation = config.endRotation ?? Math.PI * 2;
    }

    /**
     * Interpolates a particle's rotation based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @returns {void}
     */
    update(particle, normalizedAge) {
        particle.rotation = this.startRotation + (this.endRotation - this.startRotation) * normalizedAge;
    }
}
