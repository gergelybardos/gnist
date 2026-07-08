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
 * intercept particles before they reach their escape brink. Omit or set to 0 to disable.
 */
/**
 * Environmental force that applies a swirling combination of centripetal (suction) and tangential (orbital) forces to particles.
 * @class
 * @extends Force
 */
export class Vortex extends Force {
    /**
     * Initializes a Vortex force with a center point, rotation speed, and suction speed.
     * @constructor
     * @param {VortexConfig} [config={}] Vortex configuration options.
     */
    constructor(config?: VortexConfig);
    /**
     * Horizontal coordinate of the vortex center.
     * @type {number}
     */
    x: number;
    /**
     * Vertical coordinate of the vortex center.
     * @type {number}
     */
    y: number;
    /**
     * Rotation speed. Positive values for clockwise, negative values for counter-clockwise rotation.
     * @type {number}
     */
    rotationSpeed: number;
    /**
     * Inward suction speed. Positive values pull inward, negative values push outward.
     * @type {number}
     */
    suctionSpeed: number;
    /**
     * Radius of influence. Particles outside this distance are unaffected.
     * @type {number}
     */
    radius: number;
    /**
     * Distance threshold from the center below which particles are marked dead, surrounded by a frame-rate independent
     * soft-aging buffer zone to prevent visual popping. Note that high velocities or long lifespans may cause particles
     * to mathematically bypass the center and slingshot outward. In such cases, increase this radius to intercept
     * particles before they reach their escape brink. Omit or set to 0 to disable.
     * Stored internally as a squared value for high-performance comparisons.
     * @type {number}
     */
    cullingRadiusSquared: number;
}
/**
 * Vortex force configuration options.
 * Includes all properties from {@link ForceConfig}.
 */
export type VortexConfig = {
    /**
     * Horizontal coordinate of the vortex center.
     */
    x?: number | undefined;
    /**
     * Vertical coordinate of the vortex center.
     */
    y?: number | undefined;
    /**
     * Rotation speed. Positive values for clockwise, negative values for counter-clockwise rotation.
     */
    rotationSpeed?: number | undefined;
    /**
     * Inward suction speed. Positive values pull inward, negative values push outward.
     */
    suctionSpeed?: number | undefined;
    /**
     * Maximum radius of influence. Particles outside this distance are unaffected.
     */
    radius?: number | undefined;
    /**
     * Distance threshold from the center below which particles are marked dead, surrounded
     * by a frame-rate independent soft-aging buffer zone to prevent visual popping. Note that high velocities or long lifespans
     * may cause particles to mathematically bypass the center and slingshot outward. In such cases, increase this radius to
     * intercept particles before they reach their escape brink. Omit or set to 0 to disable.
     */
    cullingRadius?: number | undefined;
};
import { Force } from './Force.js';
