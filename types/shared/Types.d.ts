/**
 * @import { Particle } from '../core/Particle.js'
 */
import type { Particle } from '../core/Particle.js';
export type Color = {
    /**
     * Red color channel value (0 to 255).
     */
    r?: number;
    /**
     * Green color channel value (0 to 255).
     */
    g?: number;
    /**
     * Blue color channel value (0 to 255).
     */
    b?: number;
};
export type ModifierCategoryValues = {
    /**
     * Modifiers that manipulate visual appearance (e.g., color, opacity, scale).
     */
    VISUAL: string;
    /**
     * Modifiers that manipulate trajectories (e.g., turbulence).
     */
    PATH: string;
};
export type EmissionSourceValues = {
    /**
     * Emit from the shape's boundary, directing particles outward.
     */
    EDGE_OUT: string;
    /**
     * Emit from the shape's boundary, directing particles inward.
     */
    EDGE_IN: string;
    /**
     * Emit from the shape's boundary, directing particles randomly inward or outward.
     */
    EDGE_BOTH: string;
    /**
     * Emit uniformly from the shape's entire area.
     */
    VOLUME: string;
};
export type FlatParticleDataFormatConstants = {
    /**
     * Number of consecutive entries used to represent a single particle in a flat `Float32Array`.
     */
    FLOATS_PER_PARTICLE: number;
};
export type LoopModeValues = {
    /**
     * - Resets modifier progress to the beginning when the particle loops.
     */
    REPEAT: string;
    /**
     * - Alternates modifier progress between forward and reverse when the particle loops.
     */
    OSCILLATE: string;
    /**
     * - Holds modifier progress at the end when the particle first loops.
     */
    HOLD: string;
};
export type ParticleLifecycleCallback = (particle: Particle) => void;
/**
 * Represents the color state of a particle. RGB color channels are stored independently for efficient interpolation.
 * @typedef {object} Color
 * @property {number} [r=255] Red color channel value (0 to 255).
 * @property {number} [g=255] Green color channel value (0 to 255).
 * @property {number} [b=255] Blue color channel value (0 to 255).
 */
/**
 * Architectural categories for particle modifiers.
 * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
 * @ignore
 * @typedef {object} ModifierCategoryValues
 * @property {string} VISUAL Modifiers that manipulate visual appearance (e.g., color, opacity, scale).
 * @property {string} PATH Modifiers that manipulate trajectories (e.g., turbulence).
 */
/**
 * Available emission source modes used for `EmitterConfig.emissionSource` to define the geometric distribution and initial direction of emitted particles.
 * The default direction depends on both the emission source mode and the emitter type and can be overridden by specifying `particleBlueprint.direction` in the emitter config.
 * @typedef {object} EmissionSourceValues
 * @property {string} EDGE_OUT Emit from the shape's boundary, directing particles outward.
 * @property {string} EDGE_IN Emit from the shape's boundary, directing particles inward.
 * @property {string} EDGE_BOTH Emit from the shape's boundary, directing particles randomly inward or outward.
 * @property {string} VOLUME Emit uniformly from the shape's entire area.
 */
/**
 * Various characteristics of the flat particle data format returned by {@link Gnist#fillFlatArray}.
 * @typedef {object} FlatParticleDataFormatConstants
 * @property {number} FLOATS_PER_PARTICLE Number of consecutive entries used to represent a single particle in a flat `Float32Array`.
 */
/**
 * Available particle loop modes that determine how particle age is interpreted by modifiers.
 * @typedef {object} LoopModeValues
 * @property {string} REPEAT - Resets modifier progress to the beginning when the particle loops.
 * @property {string} OSCILLATE - Alternates modifier progress between forward and reverse when the particle loops.
 * @property {string} HOLD - Holds modifier progress at the end when the particle first loops.
 */
/**
 * Callback executed during particle lifecycle events.
 * @ignore
 * @callback ParticleLifecycleCallback
 * @param {Particle} particle The particle instance.
 * @returns {void}
 */
export {};
