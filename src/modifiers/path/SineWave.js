import { Particle } from '../../core/Particle.js';
import { ModifierCategory } from '../../shared/Constants.js';

import { Modifier } from '../Modifier.js';

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
    // Skipped @override because it fails on static members in TypeScript
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category() {
        return ModifierCategory.PATH;
    }

    /**
     * Magnitude of displacement (in pixels) at particle emission.
     * @type {number}
     */
    startAmplitude;

    /**
     * Magnitude of displacement (in pixels) at particle death.
     * @type {number}
     */
    endAmplitude;

    /**
     * Cycles per second (Hz) at particle emission.
     * @type {number}
     */
    startFrequency;

    /**
     * Cycles per second (Hz) at particle death.
     * @type {number}
     */
    endFrequency;

    /**
     * Initializes a sine wave path modifier.
     * @constructor
     * @param {SineWaveConfig} [config={}] SineWave configuration options.
     */
    constructor(config = {}) {
        super(config);

        const amplitude = config.amplitude ?? 10;

        if (Array.isArray(amplitude)) {
            this.startAmplitude = amplitude[0];
            this.endAmplitude = amplitude[1];
        } else {
            this.startAmplitude = amplitude;
            this.endAmplitude = amplitude;
        }

        const frequency = config.frequency ?? 2;

        if (Array.isArray(frequency)) {
            this.startFrequency = frequency[0];
            this.endFrequency = frequency[1];
        } else {
            this.startFrequency = frequency;
            this.endFrequency = frequency;
        }
    }

    /**
     * Offsets the particle's position along a wave axis perpendicular to the particle's current movement direction.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} dt Frame time step in seconds.
     * @returns {void}
     */
    update(particle, normalizedAge, dt) {
        if (particle.vx === 0 && particle.vy === 0) {
            return;
        }

        const amplitude = this.startAmplitude + (this.endAmplitude - this.startAmplitude) * normalizedAge;
        const frequency = this.startFrequency + (this.endFrequency - this.startFrequency) * normalizedAge;

        if (amplitude === 0 || frequency === 0) {
            return;
        }

        const movementAngle = Math.atan2(particle.vy, particle.vx);
        const perpendicularAngle = movementAngle + (Math.PI / 2);
        const currentPhase = particle.age * frequency * Math.PI * 2;
        const waveValue = Math.cos(currentPhase) * (amplitude * frequency * Math.PI * 2);

        particle.x += Math.cos(perpendicularAngle) * waveValue * dt;
        particle.y += Math.sin(perpendicularAngle) * waveValue * dt;
    }
}
