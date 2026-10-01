import { Particle } from '../core/Particle.js';
import { Force } from './Force.js';
import type { ForceConfig } from './Force.js';
export type RadialForceConfigSpecifics = {
    /**
     * Horizontal coordinate of the force center.
     */
    x?: number;
    /**
     * Vertical coordinate of the force center.
     */
    y?: number;
    /**
     * Magnitude of the force. Positive values create attraction, negative values create repulsion. Typical values range from several thousand to several hundred thousand, depending on scene size.
     */
    strength?: number;
    /**
     * Smoothing factor to prevent divide-by-zero errors and infinite acceleration spikes near the center. Stored internally as a squared value in {@link RadialForce#epsilonSquared}.
     */
    epsilon?: number;
    /**
     * Distance threshold from the center below which particles are marked dead. Set to 0 to disable. Stored internally as a squared value in {@link RadialForce#cullingRadiusSquared}.
     */
    cullingRadius?: number;
};
export type RadialForceConfig = ForceConfig & RadialForceConfigSpecifics;
/**
 * @import { ForceConfig } from './Force.js'
 */
/**
 * RadialForce-specific configuration options.
 * @typedef {object} RadialForceConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the force center.
 * @property {number} [y=0] Vertical coordinate of the force center.
 * @property {number} [strength=50000] Magnitude of the force. Positive values create attraction, negative values create repulsion. Typical values range from several thousand to several hundred thousand, depending on scene size.
 * @property {number} [epsilon=10] Smoothing factor to prevent divide-by-zero errors and infinite acceleration spikes near the center. Stored internally as a squared value in {@link RadialForce#epsilonSquared}.
 * @property {number} [cullingRadius=0] Distance threshold from the center below which particles are marked dead. Set to 0 to disable. Stored internally as a squared value in {@link RadialForce#cullingRadiusSquared}.
 */
/**
 * RadialForce configuration options.
 * Includes all properties from {@link ForceConfig}.
 * @typedef {ForceConfig & RadialForceConfigSpecifics} RadialForceConfig
 */
/**
 * Environmental force that accelerates particles radially toward or away from a central point.
 * @class
 * @extends Force
 */
export declare class RadialForce extends Force {
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
    epsilonSquared: number;
    /**
     * Distance threshold from the center below which particles are marked dead.
     * @type {number}
     */
    cullingRadiusSquared: number;
    /**
     * Initializes a radial force with a center point, strength, epsilon, and culling radius.
     * @constructor
     * @param {RadialForceConfig} [config={}] RadialForce configuration options.
     */
    constructor(config?: RadialForceConfig);
    /**
     * Applies radial acceleration to the particle's velocity based on its distance from the force center.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    apply(particle: Particle, dt: number): void;
}
