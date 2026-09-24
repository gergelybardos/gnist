import { Particle } from '../core/Particle.js';
import { Emitter } from './Emitter.js';
import type { EmitterConfig, ParticleBlueprint } from './Emitter.js';
export type LineEmitterConfigSpecifics = {
    /**
     * Horizontal coordinate of the start point of the emission line segment.
     */
    x1?: number;
    /**
     * Vertical coordinate of the start point of the emission line segment.
     */
    y1?: number;
    /**
     * Horizontal coordinate of the end point of the emission line segment.
     */
    x2?: number;
    /**
     * Vertical coordinate of the end point of the emission line segment.
     */
    y2?: number;
};
export type LineEmitterConfig = EmitterConfig & LineEmitterConfigSpecifics;
/**
 * @import { EmitterConfig, ParticleBlueprint } from './Emitter.js'
 */
/**
 * LineEmitter-specific configuration options.
 * @typedef {object} LineEmitterConfigSpecifics
 * @property {number} [x1=0] Horizontal coordinate of the start point of the emission line segment.
 * @property {number} [y1=0] Vertical coordinate of the start point of the emission line segment.
 * @property {number} [x2=100] Horizontal coordinate of the end point of the emission line segment.
 * @property {number} [y2=0] Vertical coordinate of the end point of the emission line segment.
 */
/**
 * LineEmitter configuration options. Includes all properties from {@link EmitterConfig}.
 * @typedef {EmitterConfig & LineEmitterConfigSpecifics} LineEmitterConfig
 */
/**
 * Particle emitter that emits particles randomly along a line segment, using a uniform distribution.
 * @class
 * @extends Emitter
 */
export declare class LineEmitter extends Emitter {
    /**
     * Horizontal coordinate of the start point of the emission line segment.
     * @type {number}
     */
    x1: number;
    /**
     * Vertical coordinate of the start point of the emission line segment.
     * @type {number}
     */
    y1: number;
    /**
     * Horizontal coordinate of the end point of the emission line segment.
     * @type {number}
     */
    x2: number;
    /**
     * Vertical coordinate of the end point of the emission line segment.
     * @type {number}
     */
    y2: number;
    /**
     * Initializes a line emitter with two endpoints defining a line segment.
     * Particles are emitted randomly along the segment using a uniform distribution.
     * @constructor
     * @param {LineEmitterConfig} [config={}] LineEmitter configuration options.
     */
    constructor(config?: LineEmitterConfig);
    /**
     * Extends the base initialization by positioning the particle at a random point along the line segment.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @param {ParticleBlueprint} [particleBlueprintOverrides] Temporary overrides for the particle blueprint.
     * @returns {void}
     */
    _initParticle(particle: Particle, particleBlueprintOverrides?: ParticleBlueprint): void;
    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * @override
     * @param {Particle} _particle The newly emitted Particle instance providing coordinates for the direction calculation.
     * @returns {number} The default emission direction angle (in radians).
     */
    _getInitialParticleDirection(_particle: Particle): number;
}
