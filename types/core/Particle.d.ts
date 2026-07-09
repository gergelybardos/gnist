/**
 * @import { Color } from '../shared/Types.js'
 */
/**
 * Represents a single particle within the simulation.
 * @class
 */
export class Particle {
    /**
     * Current horizontal coordinate.
     * @type {number}
     */
    x: number;
    /**
     * Current vertical coordinate.
     * @type {number}
     */
    y: number;
    /**
     * Current horizontal velocity component (in pixels per second).
     * @type {number}
     */
    vx: number;
    /**
     * Current vertical velocity component (in pixels per second).
     * @type {number}
     */
    vy: number;
    /**
     * Current orientation angle (in radians).
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
    /** Current RGB color channels.
     * @type {Color}
     */
    color: Color;
    /**
     * Current transparency (0.0 = fully transparent, 1.0 = fully opaque).
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
}
import type { Color } from '../shared/Types.js';
import { Modifier } from '../modifiers/Modifier.js';
import { Force } from '../forces/Force.js';
