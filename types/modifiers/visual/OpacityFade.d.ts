import { Particle } from '../../core/Particle.js';
import { Modifier } from '../Modifier.js';
import type { ModifierConfig } from '../Modifier.js';
export type OpacityFadeConfigSpecifics = {
    /**
     * Opacity at particle emission. Values range from 0.0 (fully transparent) to 1.0 (fully opaque).
     */
    startOpacity?: number;
    /**
     * Opacity at particle death. Values range from 0.0 (fully transparent) to 1.0 (fully opaque).
     */
    endOpacity?: number;
};
export type OpacityFadeConfig = ModifierConfig & OpacityFadeConfigSpecifics;
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
 * OpacityFade configuration options. Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & OpacityFadeConfigSpecifics} OpacityFadeConfig
 */
/**
 * Particle modifier that blends the opacity of particles over their lifespan by interpolating between two target levels.
 * @class
 * @extends Modifier
 */
export declare class OpacityFade extends Modifier {
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category(): string;
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
     * Initializes an opacity fade modifier with starting and ending opacity levels.
     * @constructor
     * @param {OpacityFadeConfig} [config={}] OpacityFade configuration options.
     */
    constructor(config?: OpacityFadeConfig);
    /**
     * Blends a particle's opacity based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(particle: Particle, normalizedAge: number, _dt: number): void;
}
