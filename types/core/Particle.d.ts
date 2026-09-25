import { Force } from '../forces/Force.js';
import { Modifier } from '../modifiers/Modifier.js';
import type { Color } from '../shared/Types.js';
import type { ParticleLifecycleCallback } from '../emitters/Emitter.js';
/**
 * @import { Color } from '../shared/Types.js'
 * @import { ParticleLifecycleCallback } from '../emitters/Emitter.js'
 */
/**
 * Represents a single particle within the simulation.
 * @class
 */
export declare class Particle {
    /**
     * Horizontal coordinate.
     * @type {number}
     */
    x: number;
    /**
     * Vertical coordinate.
     * @type {number}
     */
    y: number;
    /**
     * Horizontal coordinate at particle emission.
     * @type {number}
     */
    originX: number;
    /**
     * Vertical coordinate at particle emission.
     * @type {number}
     */
    originY: number;
    /**
     * Horizontal velocity component (in pixels per second).
     * @type {number}
     */
    vx: number;
    /**
     * Vertical velocity component (in pixels per second).
     * @type {number}
     */
    vy: number;
    /**
     * Orientation angle (in radians).
     * @type {number}
     */
    rotation: number;
    /**
     * Angular rotation speed (in radians per second).
     * @type {number}
     */
    angularVelocity: number;
    /**
     * The visual size or scale factor.
     * Interpreted by the renderer as pixels, radius, or a transform scale.
     * @type {number}
     */
    size: number;
    /**
     * The initial, unmodified birth size of the particle.
     * Used as the baseline reference for scale calculations over time.
     * @type {number}
     */
    baseSize: number;
    /** RGB color channels.
     * @type {Color}
     */
    color: Color;
    /**
     * Transparency (0.0 = fully transparent, 1.0 = fully opaque).
     * @type {number}
     */
    opacity: number;
    /**
     * Time elapsed since the particle was emitted (in seconds).
     * @type {number}
     */
    age: number;
    /**
     * Maximum allowed lifespan (in seconds).
     * @type {number}
     */
    lifespan: number;
    /**
     * Flag indicating whether the particle is still alive. Dead particles are automatically removed from the simulation.
     * @type {boolean}
     */
    alive: boolean;
    /**
     * Time interval between `onInterval` executions (in seconds).
     * @type {number}
     */
    interval: number;
    /**
     * Accumulator tracking the time towards the next `onInterval` execution (in seconds).
     * @type {number}
     */
    intervalTimer: number;
    /**
     * Shared reference to the owner emitter's visual modifier array.
     * @type {Array<Modifier>|null}
     */
    visualModifiers: Array<Modifier> | null;
    /**
     * Shared reference to the owner emitter's path modifier array.
     * @type {Array<Modifier>|null}
     */
    pathModifiers: Array<Modifier> | null;
    /**
     * Shared reference to the owner emitter's scoped emitter-specific force array.
     * @type {Array<Force>|null}
     */
    scopedForces: Array<Force> | null;
    /**
     * Lifecycle callback executed at particle death.
     * @type {ParticleLifecycleCallback}
     */
    onDeath: ParticleLifecycleCallback;
    /**
     * Lifecycle callback executed periodically at particle update. The interval is specified by the `interval` property.
     * @type {ParticleLifecycleCallback}
     */
    onInterval: ParticleLifecycleCallback;
    /**
     * Initializes a blank, inactive particle.
     * @constructor
     */
    constructor();
    /**
     * Resets the particle to its initial state.
     * @ignore
     * @returns {void}
     */
    reset(): void;
    /**
     * Periodically triggers the `onInterval` hook.
     * @ignore
     * @param {number} dt Time elapsed since the last frame (in seconds).
     * @returns {void}
     */
    update(dt: number): void;
    /**
     * Marks the particle as dead and eligible for pool recycling, triggers the `onDeath` hook.
     * @ignore
     * @returns {void}
     */
    kill(): void;
}
