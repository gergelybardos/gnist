import { Particle } from '../core/Particle.js';
import { Emitter } from './Emitter.js';
import type { EmitterConfig, ParticleBlueprint } from './Emitter.js';
export type EllipseEmitterConfigSpecifics = {
    /**
     * Horizontal coordinate of the emission ellipse center.
     */
    x?: number;
    /**
     * Vertical coordinate of the emission ellipse center.
     */
    y?: number;
    /**
     * Horizontal radius of the emission ellipse.
     */
    radiusX?: number;
    /**
     * Vertical radius of the emission ellipse.
     */
    radiusY?: number;
};
export type EllipseEmitterConfig = EmitterConfig & EllipseEmitterConfigSpecifics;
/**
 * @import { EmitterConfig, ParticleBlueprint } from './Emitter.js'
 */
/**
 * EllipseEmitter-specific configuration options.
 * @typedef {object} EllipseEmitterConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the emission ellipse center.
 * @property {number} [y=0] Vertical coordinate of the emission ellipse center.
 * @property {number} [radiusX=50] Horizontal radius of the emission ellipse.
 * @property {number} [radiusY=50] Vertical radius of the emission ellipse.
 */
/**
 * EllipseEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {EmitterConfig & EllipseEmitterConfigSpecifics} EllipseEmitterConfig
 */
/**
 * Particle emitter that emits particles randomly from an elliptical area, using a uniform distribution.
 * @class
 * @extends Emitter
 */
export declare class EllipseEmitter extends Emitter {
    /**
     * Horizontal coordinate of the emission ellipse center.
     * @type {number}
     */
    x: number;
    /**
     * Vertical coordinate of the emission ellipse center.
     * @type {number}
     */
    y: number;
    /**
     * Horizontal radius of the emission ellipse.
     * @type {number}
     */
    radiusX: number;
    /**
     * Vertical radius of the emission ellipse.
     * @type {number}
     */
    radiusY: number;
    /**
     * Initializes an ellipse emitter with given coordinates and radius.
     * Particles are emitted randomly from the elliptical area using a uniform distribution.
     * @constructor
     * @param {EllipseEmitterConfig} [config={}] EllipseEmitter configuration options.
     */
    constructor(config?: EllipseEmitterConfig);
    /**
     * Extends the base initialization by positioning the particle at a random point along or within the ellipse.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @param {ParticleBlueprint} [particleBlueprintOverrides = {}] Temporary overrides for the particle blueprint.
     * @returns {void}
     */
    _initParticle(particle: Particle, particleBlueprintOverrides?: ParticleBlueprint): void;
    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * @override
     * @param {Particle} particle The newly emitted Particle instance providing coordinates for the direction calculation.
     * @returns {number} The default emission direction angle (in radians).
     */
    _getInitialParticleDirection(particle: Particle): number;
}
