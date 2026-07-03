/**
 * LineEmitter configuration options.
 * @typedef {object} LineEmitterConfig
 * @property {number} [x1=0] Horizontal coordinate of the start point of the emission line segment.
 * @property {number} [y1=0] Vertical coordinate of the start point of the emission line segment.
 * @property {number} [x2=100] Horizontal coordinate of the end point of the emission line segment.
 * @property {number} [y2=0] Vertical coordinate of the end point of the emission line segment.
 */
/**
 * Particle emitter that emits particles randomly along a line segment, using a uniform distribution.
 * @class
 * @extends Emitter
 */
export class LineEmitter extends Emitter {
    /**
     * Initializes a line emitter with two endpoints defining a line segment.
     * Particles are emitted randomly along the segment using a uniform distribution.
     * @constructor
     * @param {LineEmitterConfig} [config={}] LineEmitter configuration options.
     */
    constructor(config?: LineEmitterConfig);
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
}
/**
 * LineEmitter configuration options.
 */
export type LineEmitterConfig = {
    /**
     * Horizontal coordinate of the start point of the emission line segment.
     */
    x1?: number | undefined;
    /**
     * Vertical coordinate of the start point of the emission line segment.
     */
    y1?: number | undefined;
    /**
     * Horizontal coordinate of the end point of the emission line segment.
     */
    x2?: number | undefined;
    /**
     * Vertical coordinate of the end point of the emission line segment.
     */
    y2?: number | undefined;
};
import { Emitter } from './Emitter.js';
