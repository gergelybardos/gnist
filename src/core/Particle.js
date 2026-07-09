import { Force } from '../forces/Force.js';
import { Modifier } from '../modifiers/Modifier.js';

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

    /**
     * The initial, unmodified birth size of the particle.
     * Used as the baseline reference for scale calculations over time.
     * @type {number}
     */
    baseSize;

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
     * Shared reference to the owner emitter's visual modifier array.
     * @type {Array<Modifier>|null}
     */
    visualModifiers;

    /**
     * Shared reference to the owner emitter's path modifier array.
     * @type {Array<Modifier>|null}
     */
    pathModifiers;

    /**
     * Shared reference to the owner emitter's scoped emitter-specific force array.
     * @type {Array<Force>|null}
     */
    scopedForces;

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
        this.baseSize = 1;
        this.color = {
            r: 255,
            g: 255,
            b: 255,
        };
        this.opacity = 1.0;

        this.age = 0;
        this.lifespan = 0;
        this.alive = false;

        // Emitter classes will initialize these immediately. No need to allocate empty arrays here.
        this.visualModifiers = null;
        this.pathModifiers = null;
        this.scopedForces = null;
    }
}
