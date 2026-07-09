/**
 * @import { ModifierConfig } from './Modifier.js';
 */
/**
 * ScaleTween configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} ScaleTweenConfig
 * @property {number} [startScale=1.0] Scale multiplier at particle emission.
 * @property {number} [endScale=0.1] Scale multiplier at particle death.
 */
/**
 * Particle modifier that interpolates a particle's size over time, scaling it relative to its base size between two target scale multipliers.
 * @class
 * @extends Modifier
 */
export class ScaleTween extends Modifier {
    /**
     * Initializes a scale tween modifier with starting and ending scale multipliers.
     * @constructor
     * @param {ScaleTweenConfig} [config={}] ScaleTween configuration options.
     */
    constructor(config?: ScaleTweenConfig);
    /**
     * Scale multiplier at particle emission.
     * @type {number}
     */
    startScale: number;
    /**
     * Scale multiplier at particle death.
     * @type {number}
     */
    endScale: number;
}
/**
 * ScaleTween configuration options.
 * Includes all properties from {@link ModifierConfig}.
 */
export type ScaleTweenConfig = {
    /**
     * Scale multiplier at particle emission.
     */
    startScale?: number | undefined;
    /**
     * Scale multiplier at particle death.
     */
    endScale?: number | undefined;
};
import { Modifier } from './Modifier.js';
