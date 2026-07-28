import { Particle } from '../../core/Particle.js';
import { ModifierCategory } from '../../shared/Constants.js';

import { Modifier } from '../Modifier.js';

/**
 * @import { ModifierConfig } from './Modifier.js';
 */

/**
 * Turbulence configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {object} TurbulenceConfig
 * @property {number|number[]} [strength=20] Magnitude of displacement (in pixels per second) or a [start, end] range array interpolated over lifespan.
 * @property {number} [scale=0.01] Noise scale factor. Smaller values produce smooth, sweeping currents; larger values produce tight, chaotic jitter.
 */

/**
 * Path modifier that applies pseudo-random, continuous displacement to particles over their lifespan.
 * @class
 * @extends Modifier
 */
export class Turbulence extends Modifier {
    // Skipped @override because it fails on static members in TypeScript
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @type {string}
     * @returns {string}
     */
    static get category() {
        return ModifierCategory.PATH;
    }

    /**
     * Magnitude of displacement (in pixels per second) at particle emission.
     * @type {number}
     */
    startStrength;

    /**
     * Magnitude of displacement (in pixels per second) at particle death.
     * @type {number}
     */
    endStrength;

    /**
     * Noise scale factor controlling the size of turbulence patterns. Smaller values produce smooth, sweeping currents; larger values produce tight, chaotic jitter.
     * @type {number}
     */
    scale;

    /**
     * Initializes a turbulence path modifier.
     * @constructor
     * @param {TurbulenceConfig} [config={}] Turbulence configuration options.
     */
    constructor(config = {}) {
        super(config);

        const strength = config.strength ?? 20;

        if (Array.isArray(strength)) {
            this.startStrength = strength[0];
            this.endStrength = strength[1];
        } else {
            this.startStrength = strength;
            this.endStrength = strength;
        }

        this.scale = config.scale ?? 0.01;
    }

    /**
     * Applies noise-based displacement to the particle's position.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} dt Frame time step in seconds.
     * @returns {void}
     */
    update(particle, normalizedAge, dt) {
        const strength = this.startStrength + (this.endStrength - this.startStrength) * normalizedAge;

        if (strength === 0) {
            return;
        }

        const nx = particle.x * this.scale;
        const ny = particle.y * this.scale;
        const time = particle.age;

        const forceX = this.#noise2D(nx, ny, time);
        const forceY = this.#noise2D(ny + 1000, nx + 1000, time);

        particle.x += forceX * strength * dt;
        particle.y += forceY * strength * dt;
    }

    /**
     * Calculates a continuous pseudo-random noise value (-1.0 to 1.0) based on coordinates and time.
     * @param {number} x X coordinate.
     * @param {number} y Y coordinate.
     * @param {number} t Time/age offset.
     * @returns {number} Value in range [-1.0, 1.0].
     */
    #noise2D(x, y, t) {
        // Lightweight trigonometric hash function simulating spatial noise vector fields
        const n = Math.sin(x * 12.9898 + y * 78.233 + t * 43758.5453);

        return (n - Math.floor(n)) * 2 - 1;
    }
}
