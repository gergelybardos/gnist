import { Force } from '../forces/Force.js';
import { Modifier } from '../modifiers/Modifier.js';

import '../shared/Types.js';

/**
 * @import { Color } from '../shared/Types.js'
 */

/**
 * Represents a single particle within the simulation.
 * @class
 */
export class Particle {
    // =========================================================================
    // KINEMATICS
    // =========================================================================

    /**
     * Current horizontal coordinate.
     * @type {number}
     */
    x;

    /**
     * Current vertical coordinate.
     * @type {number}
     */
    y;

    /**
     * Current horizontal velocity component (in pixels per second).
     * @type {number}
     */
    vx;

    /**
     * Current vertical velocity component (in pixels per second).
     * @type {number}
     */
    vy;

    /**
     * Current orientation angle (in radians).
     * @type {number}
     */
    rotation;

    /**
     * Angular rotation speed (in radians per second).
     * @type {number}
     */
    angularVelocity;

    // =========================================================================
    // VISUALS
    // =========================================================================

    /**
     * The visual size or scale factor.
     * Interpreted by the renderer as pixels, radius, or a transform scale.
     * @type {number}
     */
    size;

    /** Current RGB color channels.
     * @type {Color}
     */
    color;

    /**
     * Current transparency (0.0 = fully transparent, 1.0 = fully opaque).
     * @type {number}
     */
    opacity;

    // =========================================================================
    // LIFECYCLE STATE
    // =========================================================================

    /**
     * Time elapsed since the particle was emitted (in seconds).
     * @type {number}
     */
    age;

    /**
     * Maximum allowed lifespan (in seconds).
     * @type {number}
     */
    lifespan;

    /**
     * Flag indicating whether the particle is still alive. Dead particles are automatically removed from the simulation.
     * @type {boolean}
     */
    alive;

    // =========================================================================
    // PIPELINE TRACKING REFERENCES
    // =========================================================================

    /**
     * Shared reference to the owner emitter's modifier array.
     * @type {Array<Modifier>}
     */
    #modifiers;

    /**
     * Shared reference to the owner emitter's scoped emitter-specific force array.
     * @type {Array<Force>}
     */
    #scopedForces;

    /**
     * Initializes a blank, inactive particle.
     * @constructor
     */
    constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        this.angularVelocity = 0;

        this.size = 1;
        this.color = {
            r: 255,
            g: 255,
            b: 255,
        };
        this.opacity = 1.0;

        this.age = 0;
        this.lifespan = 0;
        this.alive = false;

        this.#modifiers = [];
        this.#scopedForces = [];
    }

    /**
     * Gets the shared reference to the emitter's modifier array.
     * @returns {Array<Modifier>}
     */
    getModifiers() {
        return this.#modifiers;
    }

    /**
     * Sets the shared reference to the emitter's modifier array.
     * @param {Array<Modifier>} modifiers The shared reference to the emitter's modifier array.
     * @returns {void}
     */
    setModifiers(modifiers) {
        this.#modifiers = modifiers;
    }

    /**
     * Gets the shared reference to the emitter's scoped emitter-specific force array.
     * @returns {Array<Force>}
     */
    getScopedForces() {
        return this.#scopedForces;
    }

    /**
     * Sets the shared reference to the emitter's scoped emitter-specific force array.
     * @param {Array<Force>} scopedForces The shared reference to the emitter's scoped emitter-specific force array.
     * @returns {void}
     */
    setScopedForces(scopedForces) {
        this.#scopedForces = scopedForces;
    }
}
