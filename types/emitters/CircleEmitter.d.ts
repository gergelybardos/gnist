/**
 * @import { EmitterConfig } from './Emitter.js'
 */
/**
 * CircleEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {object} CircleEmitterConfig
 * @property {number} [x=0] Horizontal coordinate of the emission circle center.
 * @property {number} [y=0] Vertical coordinate of the emission circle center.
 * @property {number} [radius=50] Radius of the emission circle.
 */
/**
 * Particle emitter that emits particles randomly from a circular area, using a uniform distribution.
 * @class
 * @extends Emitter
 */
export class CircleEmitter extends Emitter {
    /**
     * Initializes a circle emitter with a given position and radius.
     * Particles are emitted randomly from the circular area using a uniform distribution.
     * @constructor
     * @param {CircleEmitterConfig} [config={}] CircleEmitter configuration options.
     */
    constructor(config?: CircleEmitterConfig);
    /**
     * Radius of the emission circle.
     * @type {number}
     */
    radius: number;
    /**
     * Calculates the default emission direction angle.
     * @override
     * @param {Particle} particle Particle instance properties may be necessary for the calculation.
     * @returns {number} The fallback emission direction angle (in radians).
     */
    override getDefaultDirection(particle: Particle): number;
}
/**
 * CircleEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 */
export type CircleEmitterConfig = {
    /**
     * Horizontal coordinate of the emission circle center.
     */
    x?: number | undefined;
    /**
     * Vertical coordinate of the emission circle center.
     */
    y?: number | undefined;
    /**
     * Radius of the emission circle.
     */
    radius?: number | undefined;
};
import { Emitter } from './Emitter.js';
import { Particle } from '../core/Particle.js';
