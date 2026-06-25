/**
 * @import {Color} from '../shared/Types.js'
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
     * Current horizontal velocity component (pixels per second).
     * @type {number}
     */
    vx: number;
    /**
     * Current vertical velocity component (pixels per second).
     * @type {number}
     */
    vy: number;
    /**
     * Current orientation angle in radians.
     * @type {number}
     */
    rotation: number;
    /**
     * Angular rotation speed (radians per second).
     * @type {number}
     */
    angularVelocity: number;
    /**
     * The visual size or scale factor.
     * Interpreted by the renderer as pixels, radius, or a transform scale
     * @type {number}
     */
    size: number;
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
     * Gets the shared reference to the emitter's modifier array.
     * @returns {Array<Modifier>}
     */
    getModifiers(): Array<Modifier>;
    /**
     * Sets the shared reference to the emitter's modifier array.
     * @param {Array<Modifier>} modifiers The shared reference to the emitter's modifier array.
     * @returns {void}
     */
    setModifiers(modifiers: Array<Modifier>): void;
    /**
     * Gets the shared reference to the emitter's scoped emitter-specific force array.
     * @returns {Array<Force>}
     */
    getScopedForces(): Array<Force>;
    /**
     * Sets the shared reference to the emitter's scoped emitter-specific force array.
     * @param {Array<Force>} scopedForces The shared reference to the emitter's scoped emitter-specific force array.
     * @returns {void}
     */
    setScopedForces(scopedForces: Array<Force>): void;
    #private;
}
import type { Color } from '../shared/Types.js';
import { Modifier } from '../modifiers/Modifier.js';
import { Force } from '../forces/Force.js';
