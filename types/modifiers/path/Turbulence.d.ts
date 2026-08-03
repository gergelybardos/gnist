/**
 * @import { ModifierConfig } from './Modifier.js';
 */
/**
 * Turbulence configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} TurbulenceConfig
 * @property {number|number[]} [strength=20] Magnitude of displacement (in pixels per second) or a [start, end] range array interpolated over lifespan.
 * @property {number} [scale=0.01] Noise scale factor. Smaller values produce smooth, sweeping currents; larger values produce tight, chaotic jitter.
 */
/**
 * Path modifier that applies pseudo-random, continuous displacement to particles over their lifespan.
 * @class
 * @extends Modifier
 */
export class Turbulence extends Modifier {
    /**
     * Initializes a turbulence path modifier.
     * @constructor
     * @param {TurbulenceConfig} [config={}] Turbulence configuration options.
     */
    constructor(config?: TurbulenceConfig);
    /**
     * Magnitude of displacement (in pixels per second) at particle emission.
     * @type {number}
     */
    startStrength: number;
    /**
     * Magnitude of displacement (in pixels per second) at particle death.
     * @type {number}
     */
    endStrength: number;
    /**
     * Noise scale factor controlling the size of turbulence patterns. Smaller values produce smooth, sweeping currents; larger values produce tight, chaotic jitter.
     * @type {number}
     */
    scale: number;
    #private;
}
/**
 * Turbulence configuration options.
 * Includes all properties from {@link ModifierConfig}.
 */
export type TurbulenceConfig = {
    /**
     * Magnitude of displacement (in pixels per second) or a [start, end] range array interpolated over lifespan.
     */
    strength?: number | number[] | undefined;
    /**
     * Noise scale factor. Smaller values produce smooth, sweeping currents; larger values produce tight, chaotic jitter.
     */
    scale?: number | undefined;
};
import { Modifier } from '../Modifier.js';
