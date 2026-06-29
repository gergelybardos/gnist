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
            const relativePosition = count === 1 ? 0 : i / (count - 1);  // [0.0, 1.0]

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
        const particleAge = Math.max(0, Math.min(1, normalizedAge));
        const totalColorStopCount = this.#colorStops.length;

        // Map the normalized particle age onto the array indices of the color stops.
        // E.g., if there are 5 stops, the max index is 4. An age of 0.5 results in 2.0.
        const fractionalIndex = particleAge * (totalColorStopCount - 1);

        // The integer part of the index represents the lower color stop flanking the particle's age
        const lowerColorStopIndex = Math.floor(fractionalIndex);

        // The next integer represents the upper color stop, capped to stay inside array bounds
        const upperColorStopIndex = Math.min(lowerColorStopIndex + 1, totalColorStopCount - 1);

        const lowerColorStop = this.#colorStops[lowerColorStopIndex];
        const upperColorStop = this.#colorStops[upperColorStopIndex];

        // The decimal part is the particle's local age (progress factor) within this segment
        const interpolationFactor = fractionalIndex - lowerColorStopIndex;

        // Linear interpolation on each RGB channel between the lower and upper colors of this segment
        // based on the particle's local progress
        particle.color.r = lowerColorStop.r + (upperColorStop.r - lowerColorStop.r) * interpolationFactor;
        particle.color.g = lowerColorStop.g + (upperColorStop.g - lowerColorStop.g) * interpolationFactor;
        particle.color.b = lowerColorStop.b + (upperColorStop.b - lowerColorStop.b) * interpolationFactor;
    }
}
