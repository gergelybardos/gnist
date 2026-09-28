import { Particle } from '../../core/Particle.js';
import { ModifierCategory } from '../../shared/Constants.js';

import { Modifier } from '../Modifier.js';

/**
 * @import { ModifierConfig } from '../Modifier.js';
 */

/**
 * OpacityFade-specific configuration options.
 * @typedef {object} OpacityFadeConfigSpecifics
 * @property {number} [startOpacity=1.0] Opacity at particle emission. Values range from 0.0 (fully transparent) to 1.0 (fully opaque).
 * @property {number} [endOpacity=0.0] Opacity at particle death. Values range from 0.0 (fully transparent) to 1.0 (fully opaque).
 */

/**
 * OpacityFade configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & OpacityFadeConfigSpecifics} OpacityFadeConfig
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
     * @ignore
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
     * @param {number} normalizedProgress Normalized lifecycle progress (0.0 = start, 1.0 = end).
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(particle, normalizedProgress, _dt) {
        particle.opacity = this.startOpacity + (this.endOpacity - this.startOpacity) * normalizedProgress;
    }
}
