import { Particle } from '../core/Particle.js';

import { Force } from './Force.js';

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
     * Current horizontal acceleration component (in pixels per second).
     * @type {number}
     */
    ax;

    /**
     * Current vertical acceleration component (in pixels per second).
     * @type {number}
     */
    ay;

    /**
     * Initializes a directional force with horizontal and vertical acceleration components.
     * @constructor
     * @param {DirectionalForceConfig} [config={}] DirectionalForce configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.ax = config.ax ?? 0;
        this.ay = config.ay ?? 0;
    }

    /**
     * Changes a particle's velocity based on the force's horizontal and vertical acceleration.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    apply(particle, dt) {
        particle.vx += this.ax * dt;
        particle.vy += this.ay * dt;
    }
}
