import { Particle } from '../core/Particle.js';
import { Emitter } from './Emitter.js';
import type { EmitterConfig, ParticleBlueprint } from './Emitter.js';
export type RectEmitterConfigSpecifics = {
    /**
     * Horizontal coordinate of the top-left corner of the emission rectangle.
     */
    x?: number;
    /**
     * Vertical coordinate of the top-left corner of the emission rectangle.
     */
    y?: number;
    /**
     * Width of the emission rectangle.
     */
    width?: number;
    /**
     * Height of the emission rectangle.
     */
    height?: number;
};
export type RectEmitterConfig = EmitterConfig & RectEmitterConfigSpecifics;
/**
 * @import { EmitterConfig, ParticleBlueprint } from './Emitter.js'
 */
/**
 * RectEmitter-specific configuration options.
 * @typedef {object} RectEmitterConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the top-left corner of the emission rectangle.
 * @property {number} [y=0] Vertical coordinate of the top-left corner of the emission rectangle.
 * @property {number} [width=100] Width of the emission rectangle.
 * @property {number} [height=100] Height of the emission rectangle.
 */
/**
 * RectEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {EmitterConfig & RectEmitterConfigSpecifics} RectEmitterConfig
 */
/**
 * Particle emitter that emits particles from a rectangular area.
 * @class
 * @extends Emitter
 */
export declare class RectEmitter extends Emitter {
    /**
     * Horizontal coordinate of the top-left corner of the emission rectangle.
     * @type {number}
     */
    x: number;
    /**
     * Vertical coordinate of the top-left corner of the emission rectangle.
     * @type {number}
     */
    y: number;
    /**
     * Width of the emission rectangle.
     * @type {number}
     */
    width: number;
    /**
     * Height of the emission rectangle.
     * @type {number}
     */
    height: number;
    /**
     * Initializes a rectangle emitter with given top-left origin coordinates, width, and height.
     * Particles are emitted randomly from the rectangular area using a uniform distribution.
     * @constructor
     * @param {RectEmitterConfig} [config={}] RectEmitter configuration options.
     */
    constructor(config?: RectEmitterConfig);
    /**
     * Extends the base initialization by positioning the particle at a random point along or within the rectangle.
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
