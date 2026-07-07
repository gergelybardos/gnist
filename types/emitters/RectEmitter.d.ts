/**
 * @import { EmitterConfig } from './Emitter.js'
 */
/**
 * RectEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {object} RectEmitterConfig
 * @property {number} [x=0] Horizontal coordinate of the top-left corner of the emission rectangle.
 * @property {number} [y=0] Vertical coordinate of the top-left corner of the emission rectangle.
 * @property {number} [width=100] Width of the emission rectangle.
 * @property {number} [height=100] Height of the emission rectangle.
 */
/**
 * Particle emitter that emits particles from a rectangular area.
 * @class
 * @extends Emitter
 */
export class RectEmitter extends Emitter {
    /**
     * Initializes a rectangle emitter with a given top-left origin position, width, and height.
     * Particles are emitted randomly from the rectangular area using a uniform distribution.
     * @constructor
     * @param {RectEmitterConfig} [config={}] RectEmitter configuration options.
     */
    constructor(config?: RectEmitterConfig);
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
     * Calculates the default emission direction angle radially outward or inward from the rectangle's center.
     * @override
     * @param {Particle} particle Particle instance requiring a geometric heading calculation.
     * @returns {number} The fallback direction angle (in radians).
     */
    override getDefaultDirection(particle: Particle): number;
}
/**
 * RectEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 */
export type RectEmitterConfig = {
    /**
     * Horizontal coordinate of the top-left corner of the emission rectangle.
     */
    x?: number | undefined;
    /**
     * Vertical coordinate of the top-left corner of the emission rectangle.
     */
    y?: number | undefined;
    /**
     * Width of the emission rectangle.
     */
    width?: number | undefined;
    /**
     * Height of the emission rectangle.
     */
    height?: number | undefined;
};
import { Emitter } from './Emitter.js';
import { Particle } from '../core/Particle.js';
