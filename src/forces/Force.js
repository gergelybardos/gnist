/**
 * Abstract base class for environmental forces. Forces affect the motion of particles.
 * @abstract
 * @class
 */
export class Force {
    /**
     * Unique identifier. Defaults to an auto-generated UUID if none is provided.
     * @type {string}
     */
    id;

    /**
     * Initializes an environmental force.
     * @constructor
     * @param {Object} [config={}] Configuration parameters.
     * @throws {TypeError}
     */
    constructor(config = {}) {
        if (new.target === Force) {
            throw new TypeError('Cannot instantiate abstract class Force directly.');
        }

        this.id = config?.id || crypto.randomUUID();
    }

    /**
     * Applies acceleration to a particle's velocity.
     * @abstract
     * @param {Particle} particle Particle instance to affect.
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     * @throws {Error}
     */
    apply(particle, dt) {
        throw new Error('Method apply() must be implemented by subclass.');
    }
}
