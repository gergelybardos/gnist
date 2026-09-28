import { Particle } from '../../core/Particle.js';
import { ModifierCategory } from '../../shared/Constants.js';

import { Modifier } from '../Modifier.js';

/**
 * @import { ModifierConfig } from '../Modifier.js';
 */

/**
 * ElasticAnchor-specific configuration options.
 * @typedef {object} ElasticAnchorConfigSpecifics
 * @property {number|number[]} [stiffness=8] Pull strength returning the particle toward its origin.
 * @property {number} [damping=0.85] Velocity dampening factor (0.0 to 1.0) applied to smooth velocity and prevent infinite oscillation.
 * @property {number} [threshold=0] Distance threshold in pixels under which particles snap to their origin.
 */

/**
 * ElasticAnchor configuration options.
 * Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & ElasticAnchorConfigSpecifics} ElasticAnchorConfig
 */

/**
 * Path modifier that pulls particles back to their coordinates at emission time.
 * @class
 * @extends Modifier
 */
export class ElasticAnchor extends Modifier {
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
     * Pull strength at particle emission.
     * @type {number}
     */
    startStiffness;

    /**
     * Pull strength at particle death.
     * @type {number}
     */
    endStiffness;

    /**
     * Velocity dampening factor (0.0 to 1.0) applied to smooth velocity and prevent infinite oscillation.
     * @type {number}
     */
    damping;

    /**
     * Distance threshold in pixels under which particles snap to their origin.
     * @type {number}
     */
    snapThreshold;

    /**
     * Initializes an ElasticAnchor path modifier.
     * @constructor
     * @param {ElasticAnchorConfig} [config={}] ElasticAnchor configuration options.
     */
    constructor(config = {}) {
        super(config);

        const stiffness = config.stiffness ?? 8;

        if (Array.isArray(stiffness)) {
            this.startStiffness = stiffness[0];
            this.endStiffness = stiffness[1];
        } else {
            this.startStiffness = stiffness;
            this.endStiffness = stiffness;
        }

        this.damping = config.damping ?? 0.85;
        this.snapThreshold = config.threshold ?? 0;
    }

    /**
     * Accelerates the particle toward its emission position and applies damping to settle it.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedProgress Normalized lifecycle progress (0.0 = start, 1.0 = end).
     * @param {number} dt Frame time step in seconds.
     * @returns {void}
     */
    update(particle, normalizedProgress, dt) {
        const stiffness = this.startStiffness + (this.endStiffness - this.startStiffness) * normalizedProgress;

        if (stiffness === 0) {
            return;
        }

        const dx = particle.originX - particle.x;
        const dy = particle.originY - particle.y;
        const distSq = dx * dx + dy * dy;

        // Snap to origin if within snapThreshold
        if (this.snapThreshold !== 0 && distSq <= this.snapThreshold * this.snapThreshold) {
            particle.x = particle.originX;
            particle.y = particle.originY;
            particle.vx *= (1 - this.damping);
            particle.vy *= (1 - this.damping);

            return;
        }

        // Apply restoring acceleration proportional to displacement distance
        particle.vx += dx * stiffness * dt;
        particle.vy += dy * stiffness * dt;

        // Apply frame-rate-independent damping
        const dampFactor = Math.pow(this.damping, dt * 60);
        particle.vx *= dampFactor;
        particle.vy *= dampFactor;
    }
}
