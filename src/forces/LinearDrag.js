import { Force } from './Force.js';

/**
 * @import { ForceConfig } from './Force.js';
 */

/**
 * LinearDrag configuration options.
 * Includes all properties from {@link ForceConfig}.
 * @typedef {object} LinearDragConfig
 * @property {number} [drag=0.99] Friction coefficient where 0 means no drag and higher values slow particles down faster.
 */

/**
 * Environmental force that applies linear drag (friction) to slow down particles over time.
 * @class
 * @extends Force
 */
export class LinearDrag extends Force {
    /**
     * Friction coefficient where 0 means no drag and higher values slow particles down faster.
     * @type {number}
     */
    drag;

    /**
     * Initializes a linear drag with a specified friction coefficient.
     * @constructor
     * @param {LinearDragConfig} [config={}] LinearDrag configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.drag = config.drag ?? 0.99;
    }

    /**
     * Reduces a particle's velocity over time using linear damping.
     * @override
     * @param {object} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    apply(particle, dt) {
        particle.vx -= particle.vx * this.drag * dt;
        particle.vy -= particle.vy * this.drag * dt;
    }
}
