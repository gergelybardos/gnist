/**
 * @import { ModifierConfig } from './Modifier.js';
 */
/**
 * RotationTween configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} RotationTweenConfig
 * @property {number} [startRotation=0] RotationTween angle (in radians) at particle emission.
 * @property {number} [endRotation=6.283185] RotationTween angle (in radians) at particle death.
 */
/**
 * Particle modifier that interpolates the rotation angle of particles over their lifespan between two target values.
 * @class
 * @extends Modifier
 */
export class RotationTween extends Modifier {
    /**
     * Initializes a rotation tween modifier with starting and ending rotation angles.
     * @constructor
     * @param {RotationTweenConfig} [config={}] RotationTween configuration options.
     */
    constructor(config?: RotationTweenConfig);
    /**
     * RotationTween angle (in radians) at particle emission.
     * @type {number}
     */
    startRotation: number;
    /**
     * RotationTween angle (in radians) at particle death.
     * @type {number}
     */
    endRotation: number;
    /**
     * Interpolates a particle's rotation based on its normalized age.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @returns {void}
     */
    override update(particle: Particle, normalizedAge: number): void;
}
/**
 * RotationTween configuration options.
 * Includes all properties from {@link ModifierConfig}.
 */
export type RotationTweenConfig = {
    /**
     * RotationTween angle (in radians) at particle emission.
     */
    startRotation?: number | undefined;
    /**
     * RotationTween angle (in radians) at particle death.
     */
    endRotation?: number | undefined;
};
import { Modifier } from '../Modifier.js';
import { Particle } from '../../core/Particle.js';
