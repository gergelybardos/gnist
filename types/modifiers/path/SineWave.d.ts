import { Particle } from '../../core/Particle.js';
import { Modifier } from '../Modifier.js';
import type { ModifierConfig } from '../Modifier.js';
export type SineWaveConfigSpecifics = {
    /**
     * Wave amplitude (in pixels), or a [start, end] range array interpolated over lifespan.
     */
    amplitude?: number | number[];
    /**
     * Cycles per second (Hz), or a [start, end] range array interpolated over lifespan.
     */
    frequency?: number | number[];
};
export type SineWaveConfig = ModifierConfig & SineWaveConfigSpecifics;
/**
 * @import { ModifierConfig } from '../Modifier.js';
 */
/**
 * SineWave-specific configuration options.
 * @typedef {object} SineWaveConfigSpecifics
 * @property {number|number[]} [amplitude=10] Wave amplitude (in pixels), or a [start, end] range array interpolated over lifespan.
 * @property {number|number[]} [frequency=2] Cycles per second (Hz), or a [start, end] range array interpolated over lifespan.
 */
/**
 * SineWave configuration options. Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & SineWaveConfigSpecifics} SineWaveConfig
 */
/**
 * Path modifier that applies a perpendicular sine-wave displacement relative to the particle's movement direction.
 * @class
 * @extends Modifier
 */
export declare class SineWave extends Modifier {
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category(): string;
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
    /**
     * Initializes a sine wave path modifier.
     * @constructor
     * @param {SineWaveConfig} [config={}] SineWave configuration options.
     */
    constructor(config?: SineWaveConfig);
    /**
     * Offsets the particle's coordinates along a wave axis perpendicular to the particle's movement direction.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} dt Frame time step in seconds.
     * @returns {void}
     */
    update(particle: Particle, normalizedAge: number, dt: number): void;
}
