import { Particle } from '../core/Particle.js';

import { Modifier } from './Modifier.js';

/**
 * Particle modifier that blends a particle's color over time by interpolating through an arbitrary number of colors.
 * Colors are distributed evenly along the timeline.
 * @class
 * @extends Modifier
 */
export class ColorRamp extends Modifier {
    /**
     * Array of color stop objects; keys and their relative positions along the timeline.
     * @type {Array<{pos: number, r: number, g: number, b: number}>}
     */
    #colorStops = [];

    /**
     * Initializes a color ramp modifier with evenly distributed color stops.
     * @constructor
     * @param {Array<Array<number>>} [colors=[[255, 255, 255], [0, 0, 0]]] Array of RGB color arrays.
     */
    constructor(colors = [[255, 255, 255], [0, 0, 0]]) {
        super();

        const count = colors.length;
        for (let i = 0; i < count; i++) {
            const relativePosition = i / (count - 1);  // [0.0, 1.0]

            this.#colorStops.push({
                pos: relativePosition,
                r: colors[i][0],
                g: colors[i][1],
                b: colors[i][2],
            });
        }
    }

    /**
     * Blends a particle's color channels based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @returns {void}
     */
    update(particle, normalizedAge) {
        const t = Math.max(0, Math.min(1, normalizedAge));

        let lower = this.#colorStops[0];
        let upper = this.#colorStops[this.#colorStops.length - 1];

        // Find the current segment of the gradient (two sequential color stops that flank the current progress)
        for (let i = 0; i < this.#colorStops.length - 1; i++) {
            if (t >= this.#colorStops[i].pos && t <= this.#colorStops[i + 1].pos) {
                lower = this.#colorStops[i];
                upper = this.#colorStops[i + 1];
                break;
            }
        }

        // Calculate the local progress factor (0.0 to 1.0) within the current segment
        const segmentLength = upper.pos - lower.pos;
        const localT = segmentLength === 0 ? 0 : (t - lower.pos) / segmentLength;

        // Linear interpolation of each RGB channel between the lower and upper colors of the current segment
        // using the local progress factor
        particle.color.r = lower.r + (upper.r - lower.r) * localT;
        particle.color.g = lower.g + (upper.g - lower.g) * localT;
        particle.color.b = lower.b + (upper.b - lower.b) * localT;
    }
}
