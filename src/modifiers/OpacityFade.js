import { Particle } from '../core/Particle.js';

import { Modifier } from './Modifier.js';

/**
 * Particle modifier that blends a particle's opacity over time between two target levels.
 * @class
 * @extends Modifier
 */
export class OpacityFade extends Modifier {
    /**
     * Target opacity at particle emission.
     * @type {number}
     */
    startOpacity;

    /**
     * Target opacity at particle death.
     * @type {number}
     */
    endOpacity;

    /**
     * Initializes an opacity fade modifier with starting and ending opacity levels.
     * @constructor
     * @param {number} [startOpacity=1.0] Opacity at emission.
     * @param {number} [endOpacity=0.0] Opacity at death.
     */
    constructor(startOpacity = 1.0, endOpacity = 0.0) {
        super();

        this.startOpacity = startOpacity;
        this.endOpacity = endOpacity;
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
