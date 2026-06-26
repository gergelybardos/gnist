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
     * Initializes an empty Gnist simulation pipeline.
     * @constructor
     * @param {object} [config={}] Configuration parameters.
     */
    constructor(config?: object);
    /** Optional simulation boundaries. If set, particles traveling completely outside these limits
     * (including a safety padding based on particle size) will be culled.
     * @type {object|null}
     */
    cullingBounds: object | null;
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
import { Emitter } from '../emitters/Emitter.js';
import { Force } from '../forces/Force.js';
import { Particle } from './Particle.js';
