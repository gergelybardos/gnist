import { Particle } from '../core/Particle.js';

import { Force } from './Force.js';

/**
 * @import { ForceConfig } from './Force.js'
 */

/**
 * Vortex-specific force configuration options.
 * @typedef {object} VortexConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the vortex center.
 * @property {number} [y=0] Vertical coordinate of the vortex center.
 * @property {number} [rotationSpeed=100] Strength of the rotational force. Positive values rotate clockwise, negative values rotate counter-clockwise.
 * @property {number} [suctionSpeed=50] Strength of the radial attraction/repulsion. Positive values pull inward, negative values push outward.
 * @property {number} [damping=0.05] Velocity damping factor applied near the vortex center to stabilize motion and prevent particle overshooting.
 * @property {number} [radius=Infinity] Radius of influence. Particles outside this distance are unaffected.
 * @property {number} [cullingRadius=0] Distance threshold from the vortex center below which particles are marked dead, surrounded by a frame-rate independent soft-aging buffer zone to prevent visual popping.
 * Note that high particle `speed` or long particle `lifespan`, and/or vortexes with small or zero `damping` may cause particles to mathematically bypass the vortex center and slingshot outward.
 * One way of preventing this slingshot effect is to tweak mentioned parameters. The other is to increase `cullingRadius` to intercept particles before they reach their escape brink.
 * Omit or set to 0 to disable.
 * Stored internally as {@link Vortex#cullingRadius} and as a squared value in {@link Vortex#cullingRadiusSquared}.
 */

/**
 * Vortex configuration options.
 * Includes all properties from {@link ForceConfig}.
 * @typedef {ForceConfig & VortexConfigSpecifics} VortexConfig
 */

/**
 * Environmental force that applies a combination of distance-scaled radial attraction/repulsion and tangential rotation forces to particles, supplemented by velocity damping to stabilize particle motion.
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
     * Velocity damping factor applied near the vortex center to stabilize motion and prevent particle overshooting.
     * @type {number}
     */
    damping;

    /**
     * Radius of influence. Particles outside this distance are unaffected.
     * @type {number}
     */
    radius;

    /**
     * Distance threshold from the vortex center below which particles are marked dead, surrounded by a frame-rate independent soft-aging buffer zone to prevent visual popping.
     * Note that high particle `speed` or long particle `lifespan`, and/or vortexes with small or zero `damping` may cause particles to mathematically bypass the vortex center and slingshot outward.
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
        this.damping = config.damping ?? 0.05;
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
        const distanceSquared = dx * dx + dy * dy;

        // Influence radius exit check
        if (this.radius !== Infinity && distanceSquared > this.radius * this.radius) {
            return;
        }

        // Culling radius check
        if (this.cullingRadiusSquared > 0 && distanceSquared <= this.cullingRadiusSquared) {
            particle.alive = false;

            if (particle.onDeath) {
                particle.onDeath(particle);
            }

            return;
        }

        // Prevent unstable calculations near the center
        if (distanceSquared < 0.01) {
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

        // Calculate directional and tangential vectors
        const nx = dx / distance;
        const ny = dy / distance;
        const tx = ny;
        const ty = -nx;

        // Proximity factor (0 at the edge, 1 at the center)
        const factor = this.radius === Infinity ? 1.0 : Math.max(0, 1.0 - (distance / this.radius));

        // Smooth drag: 1.0 at the edge (zero slowdown), scaling up gently near the core
        const damping = 1.0 - (this.damping * factor);
        particle.vx *= damping;
        particle.vy *= damping;

        // Apply velocity update
        particle.vx += (nx * (this.suctionSpeed * factor) + tx * (this.rotationSpeed * factor)) * dt;
        particle.vy += (ny * (this.suctionSpeed * factor) + ty * (this.rotationSpeed * factor)) * dt;
    }
}
