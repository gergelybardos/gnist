import { Particle } from '../core/Particle.js';
import { Force } from './Force.js';
import type { ForceConfig } from './Force.js';
export type DirectionalForceConfigSpecifics = {
    /**
     * Horizontal acceleration component (in pixels per second²). Positive values accelerate particles to the right, negative values to the left.
     */
    ax?: number;
    /**
     * Vertical acceleration component (in pixels per second²). Positive values accelerate particles downward, negative values upward.
     */
    ay?: number;
};
export type DirectionalForceConfig = ForceConfig & DirectionalForceConfigSpecifics;
/**
 * @import { ForceConfig } from './Force.js';
 */
/**
 * DirectionalForce-specific configuration options.
 * @typedef {object} DirectionalForceConfigSpecifics
 * @property {number} [ax=0] Horizontal acceleration component (in pixels per second²). Positive values accelerate particles to the right, negative values to the left.
 * @property {number} [ay=0] Vertical acceleration component (in pixels per second²). Positive values accelerate particles downward, negative values upward.
 */
/**
 * DirectionalForce configuration options. Includes all properties from {@link ForceConfig}.
 * @typedef {ForceConfig & DirectionalForceConfigSpecifics} DirectionalForceConfig
 */
/**
 * Environmental force that applies a constant directional push to particles.
 * @class
 * @extends Force
 */
export declare class DirectionalForce extends Force {
    /**
     * Horizontal acceleration component (in pixels per second²).
     * @type {number}
     */
    ax: number;
    /**
     * Vertical acceleration component (in pixels per second²).
     * @type {number}
     */
    ay: number;
    /**
     * Initializes a directional force with horizontal and vertical acceleration components.
     * @constructor
     * @param {DirectionalForceConfig} [config={}] DirectionalForce configuration options.
     */
    constructor(config?: DirectionalForceConfig);
    /**
     * Changes a particle's velocity based on the force's horizontal and vertical acceleration.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    apply(particle: Particle, dt: number): void;
}
