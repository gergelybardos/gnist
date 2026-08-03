/**
 * @import { ModifierConfig } from './Modifier.js';
 */
/**
 * Spin configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} SpinConfig
 * @property {number} [angularVelocity] Optional spin rate in radians per second. If omitted, the particle's own angularVelocity value is used.
 */
/**
 * Particle modifier that continuously updates the orientation of the particles based on their angular velocity.
 * @class
 * @extends Modifier
 */
export class Spin extends Modifier {
    /**
     * Initializes a spin modifier with an optional fixed angular velocity rate.
     * @constructor
     * @param {SpinConfig} [config={}] Spin configuration options.
     */
    constructor(config?: SpinConfig);
    /**
     * Explicit spin rate override (in radians per second).
     * @type {number|null}
     */
    angularVelocity: number | null;
}
/**
 * Spin configuration options.
 * Includes all properties from {@link ModifierConfig}.
 */
export type SpinConfig = {
    /**
     * Optional spin rate in radians per second. If omitted, the particle's own angularVelocity value is used.
     */
    angularVelocity?: number | undefined;
};
import { Modifier } from '../Modifier.js';
