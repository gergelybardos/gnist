/**
 * @import { EmitterConfig } from './Emitter.js'
 */
/**
 * EllipseEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {object} EllipseEmitterConfig
 * @property {number} [x=0] Horizontal coordinate of the emission ellipse center.
 * @property {number} [y=0] Vertical coordinate of the emission ellipse center.
 * @property {number} [radiusX=50] Horizontal radius of the emission ellipse.
 * @property {number} [radiusY=50] Vertical radius of the emission ellipse.
 */
/**
 * Particle emitter that emits particles randomly from an elliptical area, using a uniform distribution.
 * @class
 * @extends Emitter
 */
export class EllipseEmitter extends Emitter {
    /**
     * Initializes an ellipse emitter with a given position and radius.
     * Particles are emitted randomly from the elliptical area using a uniform distribution.
     * @constructor
     * @param {EllipseEmitterConfig} [config={}] EllipseEmitter configuration options.
     */
    constructor(config?: EllipseEmitterConfig);
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
     * Calculates the default emission direction angle.
     * @override
     * @param {Particle} particle Particle instance properties may be necessary for the calculation.
     * @returns {number} The fallback emission direction angle (in radians).
     */
    override getDefaultDirection(particle: Particle): number;
}
/**
 * EllipseEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 */
export type EllipseEmitterConfig = {
    /**
     * Horizontal coordinate of the emission ellipse center.
     */
    x?: number | undefined;
    /**
     * Vertical coordinate of the emission ellipse center.
     */
    y?: number | undefined;
    /**
     * Horizontal radius of the emission ellipse.
     */
    radiusX?: number | undefined;
    /**
     * Vertical radius of the emission ellipse.
     */
    radiusY?: number | undefined;
};
import { Emitter } from './Emitter.js';
import { Particle } from '../core/Particle.js';
