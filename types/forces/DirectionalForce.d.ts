/**
 * Environmental force that applies a constant directional push to particles.
 * @class
 * @extends Force
 */
export class DirectionalForce extends Force {
    /**
     * Initializes a directional force with horizontal and vertical acceleration components.
     * @constructor
     * @param {object} [config={}] Configuration parameters.
     * @param {string} [config.id] Unique identifier. Defaults to an auto-generated UUID if none is provided.
     * @param {number} [config.ax=0] Horizontal acceleration component (pixels per second).
     * @param {number} [config.ay=0] Vertical acceleration component (pixels per second).
     */
    constructor(config?: {
        id?: string | undefined;
        ax?: number | undefined;
        ay?: number | undefined;
    });
    /**
     * Horizontal acceleration value.
     * @type {number}
     */
    ax: number;
    /**
     * Vertical acceleration value.
     * @type {number}
     */
    ay: number;
}
import { Force } from './Force.js';
