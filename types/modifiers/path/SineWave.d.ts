/**
 * @import { ModifierConfig } from './Modifier.js';
 */
/**
 * SineWave configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} SineWaveConfig
 * @property {number|number[]} [amplitude=10] Wave amplitude (in pixels), or a [start, end] range array interpolated over lifespan.
 * @property {number|number[]} [frequency=2] Cycles per second (Hz), or a [start, end] range array interpolated over lifespan.
 */
/**
 * Path modifier that applies a perpendicular sine-wave displacement relative to the particle's current movement direction.
 * @class
 * @extends Modifier
 */
export class SineWave extends Modifier {
    /**
     * Initializes a sine wave path modifier.
     * @constructor
     * @param {SineWaveConfig} [config={}] SineWave configuration options.
     */
    constructor(config?: SineWaveConfig);
    /**
     * Magnitude of displacement (in pixels) at particle emission.
     * @type {number}
     */
    startAmplitude: number;
    /**
     * Magnitude of displacement (in pixels) at particle death.
     * @type {number}
     */
    endAmplitude: number;
    /**
     * Cycles per second (Hz) at particle emission.
     * @type {number}
     */
    startFrequency: number;
    /**
     * Cycles per second (Hz) at particle death.
     * @type {number}
     */
    endFrequency: number;
}
/**
 * SineWave configuration options.
 * Includes all properties from {@link ModifierConfig}.
 */
export type SineWaveConfig = {
    /**
     * Wave amplitude (in pixels), or a [start, end] range array interpolated over lifespan.
     */
    amplitude?: number | number[] | undefined;
    /**
     * Cycles per second (Hz), or a [start, end] range array interpolated over lifespan.
     */
    frequency?: number | number[] | undefined;
};
import { Modifier } from '../Modifier.js';
