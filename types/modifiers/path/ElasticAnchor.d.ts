import { Particle } from '../../core/Particle.js';
import { Modifier } from '../Modifier.js';
import type { ModifierConfig } from '../Modifier.js';
export type ElasticAnchorConfigSpecifics = {
    /**
     * Pull strength returning the particle toward its origin.
     */
    stiffness?: number | number[];
    /**
     * Velocity dampening factor (0.0 to 1.0) applied to smooth velocity and prevent infinite oscillation.
     */
    damping?: number;
    /**
     * Distance threshold in pixels under which particles snap to their origin.
     */
    threshold?: number;
};
export type ElasticAnchorConfig = ModifierConfig & ElasticAnchorConfigSpecifics;
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
 * ElasticAnchor configuration options. Includes all properties from {@link ModifierConfig}.
 * @typedef {ModifierConfig & ElasticAnchorConfigSpecifics} ElasticAnchorConfig
 */
/**
 * Path modifier that pulls particles back to their coordinates at emission time.
 * @class
 * @extends Modifier
 */
export declare class ElasticAnchor extends Modifier {
    /**
     * Gets the architectural category of the modifier.
     * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
     * @ignore
     * @type {string}
     * @returns {string}
     */
    static get category(): string;
    /**
     * Pull strength at particle emission.
     * @type {number}
     */
    startStiffness: number;
    /**
     * Pull strength at particle death.
     * @type {number}
     */
    endStiffness: number;
    /**
     * Velocity dampening factor (0.0 to 1.0) applied to smooth velocity and prevent infinite oscillation.
     * @type {number}
     */
    damping: number;
    /**
     * Distance threshold in pixels under which particles snap to their origin.
     * @type {number}
     */
    snapThreshold: number;
    /**
     * Initializes an ElasticAnchor path modifier.
     * @constructor
     * @param {ElasticAnchorConfig} [config={}] ElasticAnchor configuration options.
     */
    constructor(config?: ElasticAnchorConfig);
    /**
     * Accelerates the particle toward its emission position and applies damping to settle it.
     * @override
     * @param {Particle} particle Particle instance to affect.
     * @param {number} normalizedAge Normalized age of the particle (0.0 = emitted, 1.0 = dead).
     * @param {number} dt Frame time step in seconds.
     * @returns {void}
     */
    update(particle: Particle, normalizedAge: number, dt: number): void;
}
