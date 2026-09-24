import { Particle } from '../core/Particle.js';
import { Force } from './Force.js';
import type { ForceConfig } from './Force.js';
export type LinearDragConfigSpecifics = {
    /**
     * Friction coefficient where 0 means no drag and higher values slow particles down faster.
     */
    drag?: number;
};
export type LinearDragConfig = ForceConfig & LinearDragConfigSpecifics;
/**
 * @import { ForceConfig } from './Force.js';
 */
/**
 * LinearDrag-specific configuration options.
 * @typedef {object} LinearDragConfigSpecifics
 * @property {number} [drag=0.99] Friction coefficient where 0 means no drag and higher values slow particles down faster.
 */
/**
 * LinearDrag configuration options. Includes all properties from {@link ForceConfig}.
 * @typedef {ForceConfig & LinearDragConfigSpecifics} LinearDragConfig
 */
/**
 * Environmental force that applies linear drag (friction) to slow down particles over time.
 * @class
 * @extends Force
 */
export declare class LinearDrag extends Force {
    /**
     * Friction coefficient where 0 means no drag and higher values slow particles down faster.
     * @type {number}
     */
    drag: number;
    /**
     * Initializes a linear drag with a specified friction coefficient.
     * @constructor
     * @param {LinearDragConfig} [config={}] LinearDrag configuration options.
     */
    constructor(config?: LinearDragConfig);
    /**
     * Reduces the velocity of particles over time using linear damping.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    apply(particle: Particle, dt: number): void;
}
