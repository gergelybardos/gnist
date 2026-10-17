import { Force } from '../forces/Force.js';
import { Modifier } from '../modifiers/Modifier.js';
import type { Color, ParticleLifecycleCallback } from '../shared/Types.js';
/**
 * @import { Color, LoopModeValues, ParticleLifecycleCallback } from '../shared/Types.js'
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
     * Brightness multiplier applied to the particle's color (0.0 to 1.0).
     * Typically derived from an image source and used internally by visual modifiers.
     * @ignore
     * @type {number}
     */
    brightness: number;
    /**
     * Time elapsed since the particle was emitted (in seconds).
     * @type {number}
     */
    age: number;
    /**
     * Maximum allowed lifespan baseline (in seconds). Must be a finite number.
     * @type {number}
     */
    lifespan: number;
    /**
     * Flag indicating whether the particle bypasses death at `lifespan`.
     * @type {boolean}
     */
    persistent: boolean;
    /**
     * Duration (in seconds) for age-based modifiers to complete one cycle.
     * @type {number}
     */
    loopDuration: number;
    /**
     * Determines how particle age is interpreted by modifiers when the particle loops.
     * For the list of available modes, see {@link LoopModeValues}.
     * @type {string}
     */
    loopMode: string;
    /**
     * Flag indicating whether the particle is still alive.
     * Dead particles are recycled by the pool.
     * @type {boolean}
     */
    alive: boolean;
    /**
     * Time interval between `onInterval` executions (in seconds).
     * @type {number}
     */
    interval: number;
    /**
     * Accumulator tracking time until the next `onInterval` execution (in seconds).
     * @ignore
     * @type {number}
     */
    intervalTimer: number;
    /**
     * Lifecycle callback executed at particle death.
     * @type {ParticleLifecycleCallback}
     */
    onDeath: ParticleLifecycleCallback;
    /**
     * Lifecycle callback executed periodically at particle update.
     * The interval is specified by the `interval` property.
     * @type {ParticleLifecycleCallback}
     */
    onInterval: ParticleLifecycleCallback;
    /**
     * Shared reference to the owner emitter's visual modifier array.
     * @type {Modifier[]|null}
     */
    visualModifiers: Modifier[] | null;
    /**
     * Shared reference to the owner emitter's path modifier array.
     * @type {Modifier[]|null}
     */
    pathModifiers: Modifier[] | null;
    /**
     * Shared reference to the owner emitter's scoped emitter-specific force array.
     * @type {Force[]|null}
     */
    scopedForces: Force[] | null;
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
     * Marks the particle as dead and eligible for pool recycling, triggers the `onDeath` hook.
     * @returns {void}
     */
    kill(): void;
}
