import { Particle } from '../core/Particle.js';

import { Force } from './Force.js';

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
 * @property {number} [cullingRadius=0] Distance threshold from the force center below which particles are marked dead, surrounded by a frame-rate independent soft-aging buffer zone to prevent visual popping.
 * Note that high particle `speed` or long particle `lifespan` may cause particles to mathematically bypass the force center and slingshot outward.
 * One way of preventing this slingshot effect is to tweak mentioned parameters. The other is to increase `cullingRadius` to intercept particles before they reach their escape brink.
 * Omit or set to 0 to disable.
 * Stored internally as {@link RadialForce#cullingRadius} and as a squared value in {@link RadialForce#cullingRadiusSquared}.
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
export class RadialForce extends Force {
    /**
     * Horizontal coordinate of the force center.
     * @type {number}
     */
    x;

    /**
     * Vertical coordinate of the force center.
     * @type {number}
     */
    y;

    /**
     * Magnitude of the force. Positive values create attraction, negative values create repulsion.
     * @type {number}
     */
    strength;

    /**
     * Smoothing factor to prevent divide-by-zero errors and infinite acceleration spikes near the center.
     * @type {number}
     */
    epsilonSquared;

    /**
     * Distance threshold from the force center below which particles are marked dead, surrounded by a frame-rate independent soft-aging buffer zone to prevent visual popping.
     * Note that high particle `speed` or long particle `lifespan` may cause particles to mathematically bypass the force center and slingshot outward.
     * One way of preventing this slingshot effect is to tweak mentioned parameters. The other is to increase `cullingRadius` to intercept particles before they reach their escape brink.
     * Omit or set to 0 to disable.
     * @type {number}
     */
    cullingRadius;

    /**
     * Culling radius stored internally as a squared value for high-performance comparisons.
     * @type {number}
     */
    cullingRadiusSquared;

    /**
     * Initializes a radial force with a center point, strength, epsilon, and culling radius.
     * @constructor
     * @param {RadialForceConfig} [config={}] RadialForce configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.strength = config.strength ?? 50000;

        const epsilon = config.epsilon ?? 10;
        this.epsilonSquared = epsilon * epsilon;

        this.cullingRadius = config.cullingRadius ?? 0;
        this.cullingRadiusSquared = this.cullingRadius * this.cullingRadius;
    }

    /**
     * Applies radial acceleration to the particle's velocity based on its distance from the force center.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    apply(particle, dt) {
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        const distanceSquared = dx * dx + dy * dy;

        // Culling radius check
        if (this.cullingRadiusSquared > 0 && distanceSquared < this.cullingRadiusSquared) {
            particle.alive = false;

            if (particle.onDeath) {
                particle.onDeath(particle);
            }

            return;
        }

        const distance = Math.sqrt(distanceSquared);

        // Soft-aging buffer zone
        if (this.cullingRadiusSquared > 0) {
            const agingZoneThickness = this.cullingRadius * 0.5;
            const agingThreshold = this.cullingRadius + agingZoneThickness;

            if (distance < agingThreshold) {
                const proximityFactor = 1.0 - ((distance - this.cullingRadius) / agingZoneThickness);
                particle.age += dt * proximityFactor * 5.0;
            }
        }

        const accelerationMagnitude = (this.strength / (distanceSquared + this.epsilonSquared)) * dt;

        particle.vx += dx * accelerationMagnitude;
        particle.vy += dy * accelerationMagnitude;
    }
}
