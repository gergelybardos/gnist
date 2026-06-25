import {Force} from './Force.js';

/**
 * Environmental force that applies a constant directional push to particles.
 * @class
 * @extends Force
 */
export class DirectionalForce extends Force {
    /**
     * Horizontal acceleration value.
     * @type {number}
     */
    ax;

    /**
     * Vertical acceleration value.
     * @type {number}
     */
    ay;

    /**
     * Initializes a directional force with horizontal and vertical acceleration components.
     * @constructor
     * @param {Object} [config={}] Configuration parameters.
     * @param {string} [config.id] Unique identifier. Defaults to an auto-generated UUID if none is provided.
     * @param {number} [config.ax=0] Horizontal acceleration component (pixels per second).
     * @param {number} [config.ay=0] Vertical acceleration component (pixels per second).
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
