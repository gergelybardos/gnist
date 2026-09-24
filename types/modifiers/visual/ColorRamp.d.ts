import { Particle } from '../../core/Particle.js';
import { Modifier } from '../Modifier.js';
import type { ModifierConfig } from '../Modifier.js';
export type ColorRampConfigSpecifics = {
    /**
     * Array of RGB color arrays.
     */
    colors?: Array<Array<number>>;
};
export type ColorRampConfig = ModifierConfig & ColorRampConfigSpecifics;
/**
 * @import { ModifierConfig } from '../Modifier.js';
 */
/**
 * ColorRamp-specific configuration options.
 * @typedef {object} ColorRampConfigSpecifics
 * @property {Array<Array<number>>} [colors=[[255, 255, 255], [0, 0, 0]]] Array of RGB color arrays.
 */
/**
 * ColorRamp configuration options. Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & ColorRampConfigSpecifics} ColorRampConfig
 */
/**
 * Particle modifier that blends the color of particles over their lifespan by interpolating through an arbitrary number of colors.
 * Colors are distributed evenly across particle lifespan.
 * @class
 * @extends Modifier
 */
export declare class ColorRamp extends Modifier {
    #private;
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category(): string;
    /**
     * Initializes a color ramp modifier with evenly distributed color stops.
     * @constructor
     * @param {ColorRampConfig} [config={}] ColorRamp configuration options.
     */
    constructor(config?: ColorRampConfig);
    /**
     * Blends a particle's color channels based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(particle: Particle, normalizedAge: number, _dt: number): void;
}
