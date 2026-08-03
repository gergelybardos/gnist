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
 * Particle modifier that interpolates the size of particles over their lifespan, scaling them relative to their base size between two target scale multipliers.
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
    /**
     * Scales the particle relative to its base size based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @returns {void}
     */
    override update(particle: Particle, normalizedAge: number): void;
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
import { Modifier } from '../Modifier.js';
import { Particle } from '../../core/Particle.js';
