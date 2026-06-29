/**
 * Engine configuration options.
 * @typedef {object} EngineConfig
 * @property {CullingBounds|null} [cullingBounds=null] Optional region used for particle culling.
 */
/**
 * Defines a region beyond which particles are considered outside the simulation and are marked dead.
 * A safety margin is applied per particle based on its position and size, preventing early removal while it is still
 * partially inside the region.
 * @typedef {object} CullingBounds
 * @property {number} xMin Left boundary of the region.
 * @property {number} yMin Top boundary of the region.
 * @property {number} xMax Right boundary of the region.
 * @property {number} yMax Bottom boundary of the region.
 */
/**
 * The core particle engine that manages the simulation pipeline and particle lifecycle.
 * @class
 */
export class Gnist {
    /**
     * The current semantic version of the Gnist particle engine.
     * @returns {string}
     */
    static get VERSION(): string;
    /**
     * Constant value representing an infinite particle lifespan.
     * @type {number}
     */
    static get INFINITE_DURATION(): number;
    /**
     * Initializes an empty simulation pipeline.
     * @constructor
     * @param {EngineConfig} [config={}] Engine configuration options.
     */
    constructor(config?: EngineConfig);
    /**
     * Engine configuration options.
     * @type {EngineConfig}
     */
    config: EngineConfig;
    /**
     * Gets the current list of registered emitters.
     * @returns {Array<Emitter>}
     */
    getEmitters(): Array<Emitter>;
    /**
     * Finds a registered emitter by its unique identifier.
     * @param {string} id The unique identifier of the target emitter.
     * @returns {Emitter|null} The emitter instance if found, null otherwise.
     */
    getEmitter(id: string): Emitter | null;
    /**
     * Registers an emitter into the simulation pipeline.
     * @param {Emitter} emitter The emitter instance to register.
     * @returns {this} The Gnist engine instance for method chaining.
     */
    addEmitter(emitter: Emitter): this;
    /**
     * Removes an emitter from the simulation pipeline by its unique identifier.
     * @param {string} id The unique identifier of the target emitter.
     * @returns {boolean} True if found and successfully removed, false otherwise.
     */
    removeEmitter(id: string): boolean;
    /**
     * Gets the current list of registered global environmental forces.
     * @returns {Array<Force>}
     */
    getGlobalForces(): Array<Force>;
    /**
     * Finds a registered global environmental force by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {Force|null} The force instance if found, null otherwise.
     */
    getGlobalForce(id: string): Force | null;
    /**
     * Registers a global environmental force into the simulation pipeline.
     * @param {Force} force The force instance to register.
     * @returns {this} The Gnist engine instance for method chaining.
     */
    addGlobalForce(force: Force): this;
    /**
     * Removes a global environmental force from the simulation pipeline by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {boolean} True if found and successfully removed, false otherwise.
     */
    removeGlobalForce(id: string): boolean;
    /**
     * Gets the current list of active particles of the common particle pool.
     * @returns {Array<Particle>}
     */
    getParticles(): Array<Particle>;
    /**
     * Steps the simulation pipeline forward by a given time delta.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(dt: number): void;
    /**
     * Iterates through registered emitters to emit new particles.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    emitParticles(dt: number): void;
    /**
     * Updates particle lifecycles, applies global and scoped emitter-specific forces, moves particles, and
     * applies modifiers.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    tickParticles(dt: number): void;
    #private;
}
/**
 * Engine configuration options.
 */
export type EngineConfig = {
    /**
     * Optional region used for particle culling.
     */
    cullingBounds?: CullingBounds | null | undefined;
};
/**
 * Defines a region beyond which particles are considered outside the simulation and are marked dead.
 * A safety margin is applied per particle based on its position and size, preventing early removal while it is still
 * partially inside the region.
 */
export type CullingBounds = {
    /**
     * Left boundary of the region.
     */
    xMin: number;
    /**
     * Top boundary of the region.
     */
    yMin: number;
    /**
     * Right boundary of the region.
     */
    xMax: number;
    /**
     * Bottom boundary of the region.
     */
    yMax: number;
};
import { Emitter } from '../emitters/Emitter.js';
import { Force } from '../forces/Force.js';
import { Particle } from './Particle.js';
