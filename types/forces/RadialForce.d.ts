/**
 * @import { ForceConfig } from './Force.js'
 */
/**
 * RadialForce configuration options.
 * Includes all properties from {@link ForceConfig}.
 * @typedef {object} RadialForceConfig
 * @property {number} [x=0] Horizontal coordinate of the force center.
 * @property {number} [y=0] Vertical coordinate of the force center.
 * @property {number} [strength=100] Magnitude of the force. Positive values create attraction, negative values create repulsion.
 * @property {number} [epsilon=100] Smoothing factor to prevent divide-by-zero errors and infinite acceleration spikes near the center.
 * @property {number} [cullingRadius=0] Distance threshold from the center below which particles are marked dead. Set to 0 to disable.
 */
/**
 * Environmental force that accelerates particles radially toward or away from a central point.
 * @class
 * @extends Force
 */
export class RadialForce extends Force {
    /**
     * Initializes a radial force with a center point, strength, epsilon, and culling radius.
     * @constructor
     * @param {RadialForceConfig} [config={}] RadialForce configuration options.
     */
    constructor(config?: RadialForceConfig);
    /**
     * Horizontal coordinate of the force center.
     * @type {number}
     */
    x: number;
    /**
     * Vertical coordinate of the force center.
     * @type {number}
     */
    y: number;
    /**
     * Magnitude of the force. Positive values create attraction, negative values create repulsion.
     * @type {number}
     */
    strength: number;
    /**
     * Smoothing factor to prevent divide-by-zero errors and infinite acceleration spikes near the center.
     * @type {number}
     */
    epsilon: number;
    /**
     * Distance threshold from the center below which particles are marked dead.
     * Stored internally as a squared value for high-performance comparisons.
     * @type {number}
     */
    cullingRadiusSquared: number;
}
/**
 * RadialForce configuration options.
 * Includes all properties from {@link ForceConfig}.
 */
export type RadialForceConfig = {
    /**
     * Horizontal coordinate of the force center.
     */
    x?: number | undefined;
    /**
     * Vertical coordinate of the force center.
     */
    y?: number | undefined;
    /**
     * Magnitude of the force. Positive values create attraction, negative values create repulsion.
     */
    strength?: number | undefined;
    /**
     * Smoothing factor to prevent divide-by-zero errors and infinite acceleration spikes near the center.
     */
    epsilon?: number | undefined;
    /**
     * Distance threshold from the center below which particles are marked dead. Set to 0 to disable.
     */
    cullingRadius?: number | undefined;
};
import { Force } from './Force.js';
