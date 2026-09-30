import { Force } from '../forces/Force.js';
import { Modifier } from '../modifiers/Modifier.js';
import { LoopMode } from '../shared/Constants.js';

/**
 * @import { Color, LoopModeValues } from '../shared/Types.js'
 * @import { ParticleLifecycleCallback } from '../emitters/Emitter.js'
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
     * Horizontal coordinate.
     * @type {number}
     */
    x;

    /**
     * Vertical coordinate.
     * @type {number}
     */
    y;

    /**
     * Horizontal coordinate at particle emission.
     * @type {number}
     */
    originX;

    /**
     * Vertical coordinate at particle emission.
     * @type {number}
     */
    originY;

    /**
     * Horizontal velocity component (in pixels per second).
     * @type {number}
     */
    vx;

    /**
     * Vertical velocity component (in pixels per second).
     * @type {number}
     */
    vy;

    /**
     * Orientation angle (in radians).
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

    /** RGB color channels.
     * @type {Color}
     */
    color;

    /**
     * Transparency (0.0 = fully transparent, 1.0 = fully opaque).
     * @type {number}
     */
    opacity;

    // =========================================================================
    // LIFECYCLE STATE & MODIFIER TIMING STATE
    // =========================================================================

    /**
     * Time elapsed since the particle was emitted (in seconds).
     * @type {number}
     */
    age;

    /**
     * Maximum allowed lifespan baseline (in seconds). Must be a finite number.
     * @type {number}
     */
    lifespan;

    /**
     * Flag indicating whether the particle bypasses death at `lifespan`.
     * @type {boolean}
     */
    persistent;

    /**
     * Duration (in seconds) for age-based modifiers to complete one cycle.
     * @type {number}
     */
    loopDuration;

    /**
     * Determines how particle age is interpreted by modifiers when the particle loops.
     * For the list of available modes, see {@link LoopModeValues}.
     * @type {string}
     */
    loopMode;

    /**
     * Flag indicating whether the particle is still alive.
     * Dead particles are recycled by the pool.
     * @type {boolean}
     */
    alive;

    /**
     * Time interval between `onInterval` executions (in seconds).
     * @type {number}
     */
    interval;

    // =========================================================================
    // LIFECYCLE HOOKS
    // =========================================================================

    /**
     * Lifecycle callback executed at particle death.
     * @type {ParticleLifecycleCallback}
     */
    onDeath;

    /**
     * Lifecycle callback executed periodically at particle update.
     * The interval is specified by the `interval` property.
     * @type {ParticleLifecycleCallback}
     */
    onInterval;

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

    // =========================================================================
    // INTERNALS
    // =========================================================================

    /**
     * Accumulator tracking time until the next `onInterval` execution (in seconds).
     * @type {number}
     */
    #intervalTimer;

    /**
     * Initializes a blank, inactive particle.
     * @constructor
     */
    constructor() {
        this.reset();
    }

    /**
     * Resets the particle to its initial state.
     * @ignore
     * @returns {void}
     */
    reset() {
        this.x = 0;
        this.y = 0;
        this.originX = 0;
        this.originY = 0;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        this.angularVelocity = 0;

        this.size = 1;
        this.baseSize = 1;
        this.color ??= {};
        this.color.r = 255;
        this.color.g = 255;
        this.color.b = 255;
        this.opacity = 1.0;

        this.age = 0;
        this.lifespan = 0;
        this.persistent = false;
        this.loopDuration = 0;
        this.loopMode = LoopMode.HOLD;
        this.alive = false;
        this.interval = 0;

        this.onDeath = null;
        this.onInterval = null;

        this.visualModifiers = null;
        this.pathModifiers = null;
        this.scopedForces = null;

        this.#intervalTimer = 0;
    }

    /**
     * Periodically triggers the `onInterval` hook.
     * @ignore
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(dt) {
        if (!this.alive || this.onInterval === null || this.interval <= 0) {
            return;
        }

        this.#intervalTimer += dt;

        while (this.#intervalTimer >= this.interval) {
            this.#intervalTimer -= this.interval;
            this.onInterval(this);
        }
    }

    /**
     * Marks the particle as dead and eligible for pool recycling, triggers the `onDeath` hook.
     * @ignore
     * @returns {void}
     */
    kill() {
        if (!this.alive) {
            return;
        }

        if (this.onDeath) {
            this.onDeath(this);
        }

        this.alive = false;
    }
}
