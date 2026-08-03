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
    /**
     * Initializes an opacity fade modifier with starting and ending opacity levels.
     * @constructor
     * @param {OpacityFadeConfig} [config={}] OpacityFade configuration options.
     */
    constructor(config?: OpacityFadeConfig);
    /**
     * Opacity at particle emission.
     * @type {number}
     */
    startOpacity: number;
    /**
     * Opacity at particle death.
     * @type {number}
     */
    endOpacity: number;
    /**
     * Blends a particle's opacity based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @returns {void}
     */
    override update(particle: Particle, normalizedAge: number): void;
}
/**
 * OpacityFade configuration options.
 * Includes all properties from {@link ModifierConfig}.
 */
export type OpacityFadeConfig = {
    /**
     * Opacity at particle emission. Values range from 0.0 (fully transparent) to 1.0 (fully opaque).
     */
    startOpacity?: number | undefined;
    /**
     * Opacity at particle death. Values range from 0.0 (fully transparent) to 1.0 (fully opaque).
     */
    endOpacity?: number | undefined;
};
import { Modifier } from '../Modifier.js';
import { Particle } from '../../core/Particle.js';
