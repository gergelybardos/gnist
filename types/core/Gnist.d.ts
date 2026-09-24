import { Emitter } from '../emitters/Emitter.js';
import { Force } from '../forces/Force.js';
import { Particle } from './Particle.js';
export type EngineConfig = {
    /**
     * Optional region used for particle culling.
     */
    cullingBounds?: CullingBounds | null;
};
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
/**
 * Engine configuration options.
 * @typedef {object} EngineConfig
 * @property {CullingBounds|null} [cullingBounds=null] Optional region used for particle culling.
 */
/**
 * Defines a region beyond which particles are considered outside the simulation and are marked dead.
 * A safety margin is applied per particle based on its coordinates and size, preventing early removal while it is still
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
export declare class Gnist {
    #private;
    /**
     * The semantic version of the Gnist particle engine.
     * @type {string}
     * @returns {string}
     */
    static get VERSION(): string;
    /**
     * Initializes an empty simulation pipeline.
     * @constructor
     * @param {EngineConfig} [config={}] Engine configuration options.
     */
    constructor(config?: EngineConfig);
    /**
     * Registered emitters emitting active particles.
     * @type {Array<Emitter>}
     */
    get emitters(): Array<Emitter>;
    /**
     * Registered global environmental forces affecting all active particles.
     * @type {Array<Force>}
     */
    get globalForces(): Array<Force>;
    /**
     * Common pool of active particles.
     * @type {Array<Particle>}
     */
    get particles(): Array<Particle>;
    /**
     * Optional region used for particle culling.
     * @type {CullingBounds|null}
     */
    get cullingBounds(): CullingBounds | null;
    /**
     * Sets the optional region used for particle culling.
     * @param {CullingBounds|null} cullingBounds The new region or null to disable culling.
     * @throws {Error}
     */
    set cullingBounds(cullingBounds: CullingBounds | null);
    /**
     * Finds a registered emitter by its unique identifier.
     * @param {string} id The unique identifier of the target emitter.
     * @returns {Emitter|null} The emitter instance if found, null otherwise.
     */
    getEmitter(id: string): Emitter | null;
    /**
     * Registers an emitter with the simulation pipeline.
     * @param {Emitter} emitter The emitter instance to register.
     * @returns {this} The Gnist engine instance for method chaining.
     */
    addEmitter(emitter: Emitter): this;
    /**
     * Removes an emitter from the simulation pipeline.
     * @param {Emitter} emitter The emitter instance to remove.
     * @returns {boolean} True if found and removed, false otherwise.
     */
    removeEmitter(emitter: Emitter): boolean;
    /**
     * Finds a registered global environmental force by its unique identifier.
     * @param {string} id The unique identifier of the target force.
     * @returns {Force|null} The force instance if found, null otherwise.
     */
    getGlobalForce(id: string): Force | null;
    /**
     * Registers a global environmental force with the simulation pipeline.
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
     * Steps the simulation pipeline forward by a given time delta.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(dt: number): void;
    /**
     * Fills a provided TypedArray with particle data for WebGL.
     * @param {Float32Array} targetArray - The array to write data into.
     * @returns {number} The number of particles written.
     */
    fillFlatArray(targetArray: Float32Array): number;
}
