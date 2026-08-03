import { Particle } from '../core/Particle.js';

import { Force } from './Force.js';

/**
 * @import { ForceConfig } from './Force.js'
 */

/**
 * Vortex force configuration options.
 * Includes all properties from {@link ForceConfig}.
 * @typedef {object} VortexConfig
 * @property {number} [x=0] Horizontal coordinate of the vortex center.
 * @property {number} [y=0] Vertical coordinate of the vortex center.
 * @property {number} [rotationSpeed=100] Rotation speed. Positive values for clockwise, negative values for counter-clockwise rotation.
 * @property {number} [suctionSpeed=50] Inward suction speed. Positive values pull inward, negative values push outward.
 * @property {number} [radius=Infinity] Maximum radius of influence. Particles outside this distance are unaffected.
 * @property {number} [cullingRadius=0] Distance threshold from the center below which particles are marked dead, surrounded
 * by a frame-rate independent soft-aging buffer zone to prevent visual popping. Note that high velocities or long lifespans
 * may cause particles to mathematically bypass the center and slingshot outward. In such cases, increase this radius to
 * intercept particles before they reach their escape brink. Omit or set to 0 to disable. Stored internally as
 * {@link Vortex#cullingRadius} and as a squared value in {@link Vortex#cullingRadiusSquared}.
 */

/**
 * Environmental force that applies a swirling combination of radial attraction/repulsion and tangential (orbital) forces to particles.
 * @class
 * @extends Force
 */
export class Vortex extends Force {
    /**
     * Horizontal coordinate of the vortex center.
     * @type {number}
     */
    x;

    /**
     * Vertical coordinate of the vortex center.
     * @type {number}
     */
    y;

    /**
     * Strength of the rotational force. Positive values rotate clockwise, negative values rotate counter-clockwise.
     * @type {number}
     */
    rotationSpeed;

    /**
     * Strength of the radial attraction/repulsion. Positive values pull inward, negative values push outward.
     * @type {number}
     */
    suctionSpeed;

    /**
     * Radius of influence. Particles outside this distance are unaffected.
     * @type {number}
     */
    radius;

    /**
     * Distance threshold from the center below which particles are marked dead, surrounded by a frame-rate independent
     * soft-aging buffer zone to prevent visual popping. Note that high velocities or long lifespans may cause particles
     * to mathematically bypass the center and slingshot outward. In such cases, increase this radius to intercept
     * particles before they reach their escape brink. Omit or set to 0 to disable.
     * @type {number}
     */
    cullingRadius;

    /**
     * Culling radius stored internally as a squared value for high-performance comparisons.
     * @type {number}
     */
    cullingRadiusSquared;

    /**
     * Initializes a vortex force with a center point, rotation speed, and suction speed.
     * @constructor
     * @param {VortexConfig} [config={}] Vortex configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.rotationSpeed = config.rotationSpeed ?? 100;
        this.suctionSpeed = config.suctionSpeed ?? 50;
        this.radius = config.radius ?? Infinity;

        this.cullingRadius = config.cullingRadius ?? 0;
        this.cullingRadiusSquared = this.cullingRadius * this.cullingRadius;
    }

    /**
     * Applies a swirling combination of centripetal (suction) and tangential (orbital) forces to a particle.
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

        // Inside dead zone check
        if (this.cullingRadiusSquared > 0 && distanceSq <= this.cullingRadiusSquared) {
            particle.age = particle.lifespan;
            particle.alive = false;
            return;
        }

        // Singularity gate check
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

        // Apply velocity update
        particle.vx += (nx * this.suctionSpeed + tx * this.rotationSpeed) * dt;
        particle.vy += (ny * this.suctionSpeed + ty * this.rotationSpeed) * dt;
    }
}
