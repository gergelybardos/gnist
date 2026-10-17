import { Particle } from '../core/Particle.js';
import { Emitter } from './Emitter.js';
import type { Color } from '../shared/Types.js';
import type { EmitterConfig, ParticleBlueprint } from './Emitter.js';
export type ImageData = {
    /**
     * Width of the image in pixels.
     */
    width: number;
    /**
     * Height of the image in pixels.
     */
    height: number;
    /**
     * RGBA pixel data stored in row-major order, with 4 consecutive 0–255 values per pixel.
     */
    data: Uint8ClampedArray;
};
export type ImageEmitterConfigSpecifics = {
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
    /**
     * Image data used to determine particle properties.
     */
    imageData: ImageData;
    /**
     * Minimum pixel opacity required for emission (0.0 to 1.0).
     */
    opacityThreshold?: number;
    /**
     * RGB color to exclude from particle emission.
     */
    ignoreColor?: Color;
    /**
     * Allowed color difference when matching the ignored color (0 to 255).
     */
    ignoreColorTolerance?: number;
    /**
     * Color mode that determines how pixel colors are applied to particles by an ImageEmitter.
     */
    colorMode?: string;
};
export type ImageEmitterConfig = EmitterConfig & ImageEmitterConfigSpecifics;
/**
 * @import { Color } from '../shared/Types.js'
 */
/**
 * @import { EmitterConfig, ParticleBlueprint } from './Emitter.js'
 */
/**
 * @typedef {object} ImageData
 * @property {number} width Width of the image in pixels.
 * @property {number} height Height of the image in pixels.
 * @property {Uint8ClampedArray} data RGBA pixel data stored in row-major order, with 4 consecutive 0–255 values per pixel.
 */
/**
 * ImageEmitter-specific configuration options.
 * @typedef {object} ImageEmitterConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the top-left corner of the emission rectangle.
 * @property {number} [y=0] Vertical coordinate of the top-left corner of the emission rectangle.
 * @property {number} [width=100] Width of the emission rectangle.
 * @property {number} [height=100] Height of the emission rectangle.
 * @property {ImageData} imageData Image data used to determine particle properties.
 * @property {number} [opacityThreshold=0] Minimum pixel opacity required for emission (0.0 to 1.0).
 * @property {Color} [ignoreColor] RGB color to exclude from particle emission.
 * @property {number} [ignoreColorTolerance=0] Allowed color difference when matching the ignored color (0 to 255).
 * @property {string} [colorMode] Color mode that determines how pixel colors are applied to particles by an ImageEmitter.
 */
/**
 * ImageEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * ImageEmitter always uses {@link EmissionSource.VOLUME} as `emissionSource`.
 * @typedef {EmitterConfig & ImageEmitterConfigSpecifics} ImageEmitterConfig
 */
/**
 * Particle emitter that emits particles from a rectangular area, using image pixel data to determine particle properties.
 * @class
 * @extends Emitter
 */
export declare class ImageEmitter extends Emitter {
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
     * Image data used to determine particle properties.
     * @type {ImageData}
     */
    imageData: ImageData;
    /**
     * Minimum pixel opacity required for emission (0.0 to 1.0).
     * @type {number}
     */
    opacityThreshold: number;
    /**
     * RGB color to exclude from particle emission.
     * @type {Color}
     */
    ignoreColor: Color;
    /**
     * Allowed color difference when matching the ignored color (0 to 255).
     * @type {number}
     */
    ignoreColorTolerance: number;
    /**
     * Color mode that determines how pixel colors are applied to particles by an ImageEmitter.
     * @type {string}
     */
    colorMode: string;
    /**
     * Initializes an image-based emitter.
     * Particles are emitted randomly from the rectangular area using a uniform distribution.
     * ImageEmitter always uses {@link EmissionSource.VOLUME} as `emissionSource`.
     * @constructor
     * @param {ImageEmitterConfig} [config={}] ImageEmitter configuration options.
     */
    constructor(config?: ImageEmitterConfig);
    /**
     * Extends the base initialization by positioning the particle at a random point along or within the rectangle.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @param {ParticleBlueprint} [particleBlueprintOverrides = {}] Temporary overrides for the particle blueprint.
     * @returns {boolean}
     */
    _initParticle(particle: Particle, particleBlueprintOverrides?: ParticleBlueprint): boolean;
    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * @override
     * @param {Particle} particle The newly emitted Particle instance providing coordinates for the direction calculation.
     * @returns {number} The default emission direction angle (in radians).
     */
    _getInitialParticleDirection(particle: Particle): number;
}
