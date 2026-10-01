import { Particle } from '../../core/Particle.js';
import { Modifier } from '../Modifier.js';
import type { ModifierConfig } from '../Modifier.js';
export type RotationTweenConfigSpecifics = {
    /**
     * Rotation angle (in radians) at particle emission.
     */
    startRotation?: number;
    /**
     * Rotation angle (in radians) at particle death.
     */
    endRotation?: number;
};
export type RotationTweenConfig = ModifierConfig & RotationTweenConfigSpecifics;
/**
 * @import { ModifierConfig } from '../Modifier.js';
 */
/**
 * RotationTween-specific configuration options.
 * @typedef {object} RotationTweenConfigSpecifics
 * @property {number} [startRotation=0] Rotation angle (in radians) at particle emission.
 * @property {number} [endRotation=6.283185] Rotation angle (in radians) at particle death.
 */
/**
 * RotationTween configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & RotationTweenConfigSpecifics} RotationTweenConfig
 */
/**
 * Particle modifier that interpolates the rotation angle of particles over their lifespan between two target values.
 * @class
 * @extends Modifier
 */
export declare class RotationTween extends Modifier {
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category(): string;
    /**
     * Rotation angle (in radians) at particle emission.
     * @type {number}
     */
    startRotation: number;
    /**
     * Rotation angle (in radians) at particle death.
     * @type {number}
     */
    endRotation: number;
    /**
     * Initializes a rotation tween modifier with starting and ending rotation angles.
     * @constructor
     * @param {RotationTweenConfig} [config={}] RotationTween configuration options.
     */
    constructor(config?: RotationTweenConfig);
    /**
     * Interpolates a particle's rotation based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedProgress Normalized lifecycle progress (0.0 = start, 1.0 = end).
     * @param {number} _dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(particle: Particle, normalizedProgress: number, _dt: number): void;
}
