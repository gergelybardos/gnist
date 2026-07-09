import { Particle } from '../core/Particle.js';

import { Modifier } from './Modifier.js';

/**
 * @import { ModifierConfig } from './Modifier.js';
 */

/**
 * ScaleTween configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} ScaleTweenConfig
 * @property {number} [startScale=1.0] Scale multiplier at particle emission.
 * @property {number} [endScale=0.1] Scale multiplier at particle death.
 */

/**
 * Particle modifier that interpolates a particle's size over time, scaling it relative to its base size between two target scale multipliers.
 * @class
 * @extends Modifier
 */
export class ScaleTween extends Modifier {
    /**
     * Scale multiplier at particle emission.
     * @type {number}
     */
    startScale;

    /**
     * Scale multiplier at particle death.
     * @type {number}
     */
    endScale;

    /**
     * Initializes a scale tween modifier with starting and ending scale multipliers.
     * @constructor
     * @param {ScaleTweenConfig} [config={}] ScaleTween configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.startScale = config.startScale ?? 1.0;
        this.endScale = config.endScale ?? 0.1;
    }

    /**
     * Scales the particle relative to its base size based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @returns {void}
     */
    update(particle, normalizedAge) {
        if (particle.lifespan <= 0) {
            return;
        }

        const base = particle.baseSize ?? 1;
        const currentScale = this.startScale + (this.endScale - this.startScale) * (normalizedAge);

        particle.size = base * currentScale;
    }
}
