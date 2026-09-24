import { Particle } from '../core/Particle.js';
import { Emitter } from './Emitter.js';
import type { EmitterConfig, ParticleBlueprint } from './Emitter.js';
export type PointEmitterConfigSpecifics = {
    /**
     * Horizontal coordinate of the emission point.
     */
    x?: number;
    /**
     * Vertical coordinate of the emission point.
     */
    y?: number;
};
export type PointEmitterConfig = EmitterConfig & PointEmitterConfigSpecifics;
/**
 * @import { EmitterConfig, ParticleBlueprint } from './Emitter.js'
 */
/**
 * PointEmitter-specific configuration options.
 * @typedef {object} PointEmitterConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the emission point.
 * @property {number} [y=0] Vertical coordinate of the emission point.
 */
/**
 * PointEmitter configuration options. Includes all properties from {@link EmitterConfig}.
 * @typedef {EmitterConfig & PointEmitterConfigSpecifics} PointEmitterConfig
 */
/**
 * Particle emitter that emits particles from a single point.
 * @class
 * @extends Emitter
 */
export declare class PointEmitter extends Emitter {
    /**
     * Horizontal coordinate of the emission point.
     * @type {number}
     */
    x: number;
    /**
     * Vertical coordinate of the emission point.
     * @type {number}
     */
    y: number;
    /**
     * Initializes a point emitter with given coordinates.
     * Particles are emitted from the point at the specified coordinates.
     * @constructor
     * @param {PointEmitterConfig} [config={}] PointEmitter configuration options.
     */
    constructor(config?: PointEmitterConfig);
    /**
     * Extends the base initialization by positioning the particle at the coordinates of the emitter origin.
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
