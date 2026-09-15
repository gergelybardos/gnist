import { Particle } from '../../core/Particle.js';
import { ModifierCategory } from '../../shared/Constants.js';

import { Modifier } from '../Modifier.js';

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
export class ColorRamp extends Modifier {
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
     * Array of precomputed linear interpolation segments between consecutive color stops.
     * Each segment caches the starting RGB color components and the precalculated delta values to the subsequent color stop.
     * @type {Array<{
     *     r: number,
     *     g: number,
     *     b: number,
     *     dr: number,
     *     dg: number,
     *     db: number
     * }>}
     */
    #segments = [];

    /**
     * Number of color ramp segments.
     * @type {number}
     */
    #segmentCount = 0;

    /**
     * Initializes a color ramp modifier with evenly distributed color stops.
     * @constructor
     * @param {ColorRampConfig} [config={}] ColorRamp configuration options.
     */
    constructor(config = {}) {
        super(config);

        const colors = config.colors ?? [[255, 255, 255], [0, 0, 0]];
        const colorCount = colors.length;

        if (colorCount < 2) {
            if (colorCount === 1) {
                const color = colors[0];

                this.#segments.push({
                    r: color[0],
                    g: color[1],
                    b: color[2],
                    dr: 0,
                    dg: 0,
                    db: 0,
                });
            }

            this.#segmentCount = 1;
            return;
        }

        const segmentCount = colorCount - 1;

        for (let i = 0; i < segmentCount; i++) {
            const lower = colors[i];
            const upper = colors[i + 1];

            this.#segments.push({
                r: lower[0],
                g: lower[1],
                b: lower[2],
                dr: upper[0] - lower[0],
                dg: upper[1] - lower[1],
                db: upper[2] - lower[2],
            });
        }

        this.#segmentCount = segmentCount;
    }

    /**
     * Blends a particle's color channels based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @returns {void}
     */
    update(particle, normalizedAge) {
        if (this.#segmentCount === 0) {
            return;
        }

        const segmentCount = this.#segmentCount;
        const age = Math.max(0, Math.min(1, normalizedAge));
        const scaledAge = age * segmentCount;
        const segmentIndex = Math.min(Math.floor(scaledAge), segmentCount - 1);
        const interpolationFactor = scaledAge - segmentIndex;
        const segment = this.#segments[segmentIndex];

        particle.color.r = segment.r + segment.dr * interpolationFactor;
        particle.color.g = segment.g + segment.dg * interpolationFactor;
        particle.color.b = segment.b + segment.db * interpolationFactor;
    }
}
