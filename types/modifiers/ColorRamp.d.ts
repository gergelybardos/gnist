/**
 * Particle modifier that blends a particle's color over time by interpolating through an arbitrary number of colors.
 * Colors are distributed evenly along the timeline.
 * @class
 * @extends Modifier
 */
export class ColorRamp extends Modifier {
    /**
     * Initializes a color ramp modifier with evenly distributed color stops.
     * @constructor
     * @param {Array<Array<number>>} [colors=[[255, 255, 255], [0, 0, 0]]] Array of RGB color arrays.
     */
    constructor(colors?: Array<Array<number>>);
    #private;
}
import { Modifier } from './Modifier.js';
