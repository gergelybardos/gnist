import { Particle } from '../../core/Particle.js';
import { Modifier } from '../Modifier.js';
import type { ModifierConfig } from '../Modifier.js';
export type ScaleTweenConfigSpecifics = {
    /**
     * Scale multiplier at particle emission.
     */
    startScale?: number;
    /**
     * Scale multiplier at particle death.
     */
    endScale?: number;
};
export type ScaleTweenConfig = ModifierConfig & ScaleTweenConfigSpecifics;
/**
 * @import { ModifierConfig } from '../Modifier.js';
 */
/**
 * ScaleTween-specific configuration options.
 * @typedef {object} ScaleTweenConfigSpecifics
 * @property {number} [startScale=1.0] Scale multiplier at particle emission.
 * @property {number} [endScale=0.1] Scale multiplier at particle death.
 */
/**
 * ScaleTween configuration options. Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & ScaleTweenConfigSpecifics} ScaleTweenConfig
 */
/**
 * Particle modifier that interpolates the size of particles over their lifespan, scaling them relative to their base size between two target scale multipliers.
 * @class
 * @extends Modifier
 */
export declare class ScaleTween extends Modifier {
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category(): string;
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
     * Initializes a scale tween modifier with starting and ending scale multipliers.
     * @constructor
     * @param {ScaleTweenConfig} [config={}] ScaleTween configuration options.
     */
    constructor(config?: ScaleTweenConfig);
    /**
     * Scales the particle relative to its base size based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(particle: Particle, normalizedAge: number, _dt: number): void;
}
