import { Particle } from '../../core/Particle.js';
import { ModifierCategory } from '../../shared/Constants.js';

import { Modifier } from '../Modifier.js';

/**
 * @import { ModifierConfig } from './Modifier.js';
 */

/**
 * OpacityFade configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} OpacityFadeConfig
 * @property {number} [startOpacity=1.0] Opacity at particle emission. Values range from 0.0 (fully transparent) to 1.0 (fully opaque).
 * @property {number} [endOpacity=0.0] Opacity at particle death. Values range from 0.0 (fully transparent) to 1.0 (fully opaque).
 */

/**
 * Particle modifier that blends the opacity of particles over their lifespan by interpolating between two target levels.
 * @class
 * @extends Modifier
 */
export class OpacityFade extends Modifier {
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
     * @param {OpacityFadeConfig} [config={}] OpacityFade configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.startOpacity = Math.max(0, Math.min(1, config.startOpacity ?? 1.0));
        this.endOpacity = Math.max(0, Math.min(1, config.endOpacity ?? 0.0));
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
