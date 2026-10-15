import { Particle } from '../core/Particle.js';

import { Force } from './Force.js';

/**
 * @import { ForceConfig } from './Force.js'
 */

/**
 * OrbitalForce-specific force configuration options.
 * @typedef {object} OrbitalForceConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the orbital center.
 * @property {number} [y=0] Vertical coordinate of the orbital center.
 * @property {number} [tangentialSpeed=100] Target tangential speed. Positive values produce clockwise motion; negative values produce counter-clockwise motion.
 * @property {number} [radialSpeed=50] Target radial speed. Positive values move particles toward the center; negative values move them away from the center.
 * @property {number} [radius=Infinity] Maximum radius of influence. Particles outside this distance are unaffected.
 * @property {number} [cullingRadius=0] Distance threshold from the orbital center below which particles are marked dead, surrounded by a frame-rate independent soft-aging buffer zone to prevent visual popping.
 * Note that high velocities or long lifespans may cause particles to mathematically bypass the center and slingshot outward.
 * In such cases, increase this radius to intercept particles before they reach their escape brink.
 * Omit or set to 0 to disable.
 * Stored internally as {@link OrbitalForce#cullingRadius} and as a squared value in {@link OrbitalForce#cullingRadiusSquared}.
 */

/**
 * OrbitalForce configuration options.
 * Includes all properties from {@link ForceConfig}.
 * @typedef {ForceConfig & OrbitalForceConfigSpecifics} OrbitalForceConfig
 */

/**
 * Environmental force that steers particles toward a target orbital motion using radial and tangential velocity components.
 * @class
 * @extends Force
 */
export class OrbitalForce extends Force {
    /**
     * Horizontal coordinate of the orbital center.
     * @type {number}
     */
    x;

    /**
     * Vertical coordinate of the orbital center.
     * @type {number}
     */
    y;

    /**
     * Target tangential velocity. Positive values produce clockwise motion; negative values produce counter-clockwise motion.
     * @type {number}
     */
    tangentialSpeed;

    /**
     * Target radial velocity. Positive values move particles toward the center; negative values move them away from the center.
     * @type {number}
     */
    radialSpeed;

    /**
     * Radius of influence. Particles outside this distance are unaffected.
     * @type {number}
     */
    radius;

    /**
     * Distance threshold from the center below which particles are marked dead, surrounded by a frame-rate independent soft-aging buffer zone to prevent visual popping.
     * Note that high velocities or long lifespans may cause particles to mathematically bypass the center and slingshot outward.
     * In such cases, increase this radius to intercept particles before they reach their escape brink.
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
     * Initializes an orbital force with a center point, target tangential and radial speeds.
     * @constructor
     * @param {OrbitalForceConfig} [config={}] Orbital force configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.tangentialSpeed = config.tangentialSpeed ?? 100;
        this.radialSpeed = config.radialSpeed ?? 50;
        this.radius = config.radius ?? Infinity;

        this.cullingRadius = config.cullingRadius ?? 0;
        this.cullingRadiusSquared = this.cullingRadius * this.cullingRadius;
    }

    /**
     * Steers a particle's velocity toward a target orbital motion.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    apply(particle, dt) {
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        const distanceSq = dx * dx + dy * dy;

        // Influence radius exit check
        if (this.radius !== Infinity && distanceSq > this.radius * this.radius) {
            return;
        }

        // Culling radius check
        if (this.cullingRadiusSquared > 0 && distanceSq <= this.cullingRadiusSquared) {
            particle.alive = false;
            if (particle.onDeath) {
                particle.onDeath(particle);
            }
            return;
        }

        // Prevent unstable calculations near the center
        if (distanceSq < 0.01) {
            return;
        }

        const distance = Math.sqrt(distanceSq);

        // Soft-aging buffer zone
        if (this.cullingRadiusSquared > 0) {
            const agingZoneThickness = this.cullingRadius * 0.5;
            const agingThreshold = this.cullingRadius + agingZoneThickness;

            if (distance < agingThreshold) {
                const proximityFactor = 1.0 - ((distance - this.cullingRadius) / agingZoneThickness);
                particle.age += dt * proximityFactor * 5.0;
            }
        }

        // Calculate directional and tangential vectors
        const nx = dx / distance;
        const ny = dy / distance;
        const tx = -ny;
        const ty = nx;

        // Orbital velocity steering

        // Measure current velocities along the radial (in/out) and tangential (sideways) axes
        const currentVr = particle.vx * nx + particle.vy * ny;
        const currentVt = particle.vx * tx + particle.vy * ty;

        // Define target velocities: radialSpeed controls inward/outward motion; tangentialSpeed controls orbital motion
        const targetVr = -this.radialSpeed;
        const targetVt = this.tangentialSpeed;

        // Steer current velocity toward the target orbit state
        const steeringResponsiveness = Math.min(1, 5.0 * dt); // responsiveness (higher = snaps faster to orbit)
        const newVr = currentVr + (targetVr - currentVr) * steeringResponsiveness;
        const newVt = currentVt + (targetVt - currentVt) * steeringResponsiveness;

        // Apply velocity update
        particle.vx = nx * newVr + tx * newVt;
        particle.vy = ny * newVr + ty * newVt;
    }
}
