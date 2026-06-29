/**
 * @import { ForceConfig } from './Force.js';
 */
/**
 * DirectionalForce configuration options.
 * Includes all properties from {@link ForceConfig}.
 * @typedef {object} DirectionalForceConfig
 * @property {number} [ax=0] Horizontal acceleration component (in pixels per second).
 * @property {number} [ay=0] Vertical acceleration component (in pixels per second).
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
     * Current horizontal acceleration component (in pixels per second).
     * @type {number}
     */
    ax: number;
    /**
     * Current vertical acceleration component (in pixels per second).
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
     * Horizontal acceleration component (in pixels per second).
     */
    ax?: number | undefined;
    /**
     * Vertical acceleration component (in pixels per second).
     */
    ay?: number | undefined;
};
import { Force } from './Force.js';
