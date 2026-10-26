import { Particle } from '../core/Particle.js';
import { Force } from './Force.js';
import type { ForceConfig } from './Force.js';
export type OrbitalForceConfigSpecifics = {
    /**
     * Horizontal coordinate of the orbital center.
     */
    x?: number;
    /**
     * Vertical coordinate of the orbital center.
     */
    y?: number;
    /**
     * Target tangential speed. Positive values rotate clockwise, negative values rotate counter-clockwise.
     */
    tangentialSpeed?: number;
    /**
     * Target radial speed. Positive values push outward, negative values pull inward.
     */
    radialSpeed?: number;
    /**
     * Radius of influence. Particles outside this distance are unaffected.
     */
    radius?: number;
    /**
     * Distance threshold from the orbital center below which particles are marked dead, surrounded by a frame-rate independent soft-aging buffer zone to prevent visual popping.
     * `OrbitalForce` prevents particles with high speeds or long lifespans from overshooting the center, unlike `RadialForce` or `Vortex`.
     * With `OrbitalForce`, `cullingRadius` is an optional feature rather than a way to prevent slingshot effects.
     * Omit or set to 0 to disable.
     * Stored internally as {@link OrbitalForce#cullingRadius} and as a squared value in {@link OrbitalForce#cullingRadiusSquared}.
     */
    cullingRadius?: number;
};
export type OrbitalForceConfig = ForceConfig & OrbitalForceConfigSpecifics;
/**
 * @import { ForceConfig } from './Force.js'
 */
/**
 * OrbitalForce-specific force configuration options.
 * @typedef {object} OrbitalForceConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the orbital center.
 * @property {number} [y=0] Vertical coordinate of the orbital center.
 * @property {number} [tangentialSpeed=100] Target tangential speed. Positive values rotate clockwise, negative values rotate counter-clockwise.
 * @property {number} [radialSpeed=50] Target radial speed. Positive values push outward, negative values pull inward.
 * @property {number} [radius=Infinity] Radius of influence. Particles outside this distance are unaffected.
 * @property {number} [cullingRadius=0] Distance threshold from the orbital center below which particles are marked dead, surrounded by a frame-rate independent soft-aging buffer zone to prevent visual popping.
 * `OrbitalForce` prevents particles with high speeds or long lifespans from overshooting the center, unlike `RadialForce` or `Vortex`.
 * With `OrbitalForce`, `cullingRadius` is an optional feature rather than a way to prevent slingshot effects.
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
export declare class OrbitalForce extends Force {
    /**
     * Horizontal coordinate of the orbital center.
     * @type {number}
     */
    x: number;
    /**
     * Vertical coordinate of the orbital center.
     * @type {number}
     */
    y: number;
    /**
     * Target tangential speed. Positive values rotate clockwise, negative values rotate counter-clockwise.
     * @type {number}
     */
    tangentialSpeed: number;
    /**
     * Target radial speed. Positive values push outward, negative values pull inward.
     * @type {number}
     */
    radialSpeed: number;
    /**
     * Radius of influence. Particles outside this distance are unaffected.
     * @type {number}
     */
    radius: number;
    /**
     * Distance threshold from the orbital center below which particles are marked dead, surrounded by a frame-rate independent soft-aging buffer zone to prevent visual popping.
     * `OrbitalForce` prevents particles with high speeds or long lifespans from overshooting the center, unlike `RadialForce` or `Vortex`.
     * With `OrbitalForce`, `cullingRadius` is an optional feature rather than a way to prevent slingshot effects.
     * Omit or set to 0 to disable.
     * @type {number}
     */
    cullingRadius: number;
    /**
     * Culling radius stored internally as a squared value for high-performance comparisons.
     * @type {number}
     */
    cullingRadiusSquared: number;
    /**
     * Initializes an orbital force with a center point, target tangential and radial speeds.
     * @constructor
     * @param {OrbitalForceConfig} [config={}] Orbital force configuration options.
     */
    constructor(config?: OrbitalForceConfig);
    /**
     * Steers a particle's velocity toward a target orbital motion.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    apply(particle: Particle, dt: number): void;
}
