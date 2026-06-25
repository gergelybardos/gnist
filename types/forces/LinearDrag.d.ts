/**
 * Environmental force that applies linear drag (friction) to slow down particles over time.
 * @class
 * @extends Force
 */
export class LinearDrag extends Force {
    /**
     * Initializes a linear drag with a specified friction coefficient.
     * @constructor
     * @param {object} [config={}] Configuration parameters.
     * @param {string} [config.id] Unique identifier. Defaults to an auto-generated UUID if none is provided.
     * @param {number} [config.drag=0.99] Friction coefficient.
     */
    constructor(config?: {
        id?: string | undefined;
        drag?: number | undefined;
    });
    /**
     * Friction coefficient where 0 means no drag and higher values slow particles down faster.
     * @type {number}
     */
    drag: number;
    /**
     * Reduces a particle's velocity over time using linear damping.
     * @override
     * @param {object} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    override apply(particle: object, dt: number): void;
}
import { Force } from './Force.js';
