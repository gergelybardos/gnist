import { Particle } from '../core/Particle.js';

import { Modifier } from './Modifier.js';

/**
 * @import { ModifierConfig } from './Modifier.js';
 */

/**
 * OpacityFade configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} OpacityFadeConfig
 * @property {number} [startOpacity=1.0] Opacity at particle emission.
 * @property {number} [endOpacity=0.0] Opacity at particle death.
 */

/**
 * Particle modifier that blends a particle's opacity over time between two target levels.
 * @class
 * @extends Modifier
 */
export class OpacityFade extends Modifier {
    /**
     * Opacity at particle emission.
     * @type {number}
     */
    startOpacity;

    /**
     * Opacity at particle death.
     * @type {number}
     */
    endOpacity;

    /**
     * Initializes an opacity fade modifier with starting and ending opacity levels.
     * @constructor
     * @param {OpacityFadeConfig} [config={}] ColorRampConfig configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.startOpacity = config.startOpacity ?? 1.0;
        this.endOpacity = config.endOpacity ?? 0.0;
    }

    /**
     * Blends a particle's opacity based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @returns {void}
     */
    update(particle, normalizedAge) {
        particle.opacity = this.startOpacity + (this.endOpacity - this.startOpacity) * normalizedAge;
    }
}
