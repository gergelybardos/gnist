/**
 * @import { ModifierConfig } from './Modifier.js';
 */
/**
 * ColorRamp configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} ColorRampConfig
 * @property {Array<Array<number>>} [colors=[[255, 255, 255], [0, 0, 0]]] Array of RGB color arrays.
 */
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
     * @param {ColorRampConfig} [config={}] ColorRampConfig configuration options.
     */
    constructor(config?: ColorRampConfig);
    #private;
}
/**
 * ColorRamp configuration options.
 * Includes all properties from {@link ModifierConfig}.
 */
export type ColorRampConfig = {
    /**
     * Array of RGB color arrays.
     */
    colors?: number[][] | undefined;
};
import { Modifier } from './Modifier.js';
