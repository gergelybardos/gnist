/**
 * @import { ForceConfig } from './Force.js';
 */
/**
 * DirectionalForce configuration options.
 * Includes all properties from {@link ForceConfig}.
 * @typedef {object} DirectionalForceConfig
 * @property {number} [ax=0] Horizontal acceleration component (in pixels per second²). Positive values accelerate particles to the right, negative values to the left.
 * @property {number} [ay=0] Vertical acceleration component (in pixels per second²). Positive values accelerate particles downward, negative values upward.
 */
/**
 * Environmental force that applies a constant directional push to particles.
 * @class
 * @extends Force
 */
export class DirectionalForce extends Force {
    /**
     * Initializes a directional force with horizontal and vertical acceleration components.
     * @constructor
     * @param {DirectionalForceConfig} [config={}] DirectionalForce configuration options.
     */
    constructor(config?: DirectionalForceConfig);
    /**
     * Current horizontal acceleration component (in pixels per second²).
     * @type {number}
     */
    ax: number;
    /**
     * Current vertical acceleration component (in pixels per second²).
     * @type {number}
     */
    ay: number;
}
/**
 * DirectionalForce configuration options.
 * Includes all properties from {@link ForceConfig}.
 */
export type DirectionalForceConfig = {
    /**
     * Horizontal acceleration component (in pixels per second²). Positive values accelerate particles to the right, negative values to the left.
     */
    ax?: number | undefined;
    /**
     * Vertical acceleration component (in pixels per second²). Positive values accelerate particles downward, negative values upward.
     */
    ay?: number | undefined;
};
import { Force } from './Force.js';
