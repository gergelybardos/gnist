import { Particle } from '../../core/Particle.js';
import { Modifier } from '../Modifier.js';
import type { ModifierConfig } from '../Modifier.js';
export type TurbulenceConfigSpecifics = {
    /**
     * Magnitude of displacement (in pixels per second) or a [start, end] range array interpolated over lifespan.
     */
    strength?: number | number[];
    /**
     * Noise scale factor. Smaller values produce smooth, sweeping currents; larger values produce tight, chaotic jitter.
     */
    scale?: number;
};
export type TurbulenceConfig = ModifierConfig & TurbulenceConfigSpecifics;
/**
 * @import { ModifierConfig } from '../Modifier.js';
 */
/**
 * Turbulence-specific configuration options.
 * @typedef {object} TurbulenceConfigSpecifics
 * @property {number|number[]} [strength=20] Magnitude of displacement (in pixels per second) or a [start, end] range array interpolated over lifespan.
 * @property {number} [scale=0.01] Noise scale factor. Smaller values produce smooth, sweeping currents; larger values produce tight, chaotic jitter.
 */
/**
 * Turbulence configuration options. Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & TurbulenceConfigSpecifics} TurbulenceConfig
 */
/**
 * Path modifier that applies pseudo-random, continuous displacement to particles over their lifespan.
 * @class
 * @extends Modifier
 */
export declare class Turbulence extends Modifier {
    #private;
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category(): string;
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
    /**
     * Initializes a turbulence path modifier.
     * @constructor
     * @param {TurbulenceConfig} [config={}] Turbulence configuration options.
     */
    constructor(config?: TurbulenceConfig);
    /**
     * Applies noise-based displacement to the particle's coordinates.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} dt Frame time step in seconds.
     * @returns {void}
     */
    update(particle: Particle, normalizedAge: number, dt: number): void;
}
