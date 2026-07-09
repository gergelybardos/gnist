import { Particle } from '../core/Particle.js';
import { Source } from '../shared/Constants.js';

import { Emitter } from './Emitter.js';

/**
 * @import { EmitterConfig } from './Emitter.js'
 */

/**
 * EllipseEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {object} EllipseEmitterConfig
 * @property {number} [x=0] Horizontal coordinate of the emission ellipse center.
 * @property {number} [y=0] Vertical coordinate of the emission ellipse center.
 * @property {number} [radiusX=50] Horizontal radius of the emission ellipse.
 * @property {number} [radiusY=50] Vertical radius of the emission ellipse.
 */

/**
 * Particle emitter that emits particles randomly from an elliptical area, using a uniform distribution.
 * @class
 * @extends Emitter
 */
export class EllipseEmitter extends Emitter {
    /**
     * Horizontal coordinate of the emission ellipse center.
     * @type {number}
     */
    x;

    /**
     * Vertical coordinate of the emission ellipse center.
     * @type {number}
     */
    y;

    /**
     * Horizontal radius of the emission ellipse.
     * @type {number}
     */
    radiusX;

    /**
     * Vertical radius of the emission ellipse.
     * @type {number}
     */
    radiusY;

    /**
     * Initializes an ellipse emitter with a given position and radius.
     * Particles are emitted randomly from the elliptical area using a uniform distribution.
     * @constructor
     * @param {EllipseEmitterConfig} [config={}] EllipseEmitter configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.radiusX = config.radiusX ?? 50;
        this.radiusY = config.radiusY ?? 50;
    }

    /**
     * Extends the base initialization by positioning the particle at a random point along or within the ellipse.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    initParticle(particle) {
        const angle = Math.random() * Math.PI * 2;

        const factor = this.source === Source.VOLUME
            ? Math.sqrt(Math.random())
            : 1;

        particle.x = this.x + Math.cos(angle) * this.radiusX * factor;
        particle.y = this.y + Math.sin(angle) * this.radiusY * factor;

        super.initParticle(particle);
    }

    /**
     * Calculates the default emission direction angle.
     * @override
     * @param {Particle} particle Particle instance properties may be necessary for the calculation.
     * @returns {number} The fallback emission direction angle (in radians).
     */
    getDefaultDirection(particle) {
        const dy = particle.y - this.y;
        const dx = particle.x - this.x;

        // If a particle spawns at the center, fallback to a random direction
        const outwardAngle = (dx === 0 && dy === 0)
            ? Math.random() * Math.PI * 2
            : Math.atan2(dy, dx);

        switch (this.source) {
            case Source.EDGE_OUT:
                return outwardAngle;
            case Source.EDGE_IN:
                return outwardAngle + Math.PI;
            case Source.EDGE_BOTH:
                return Math.random() > 0.5 ? outwardAngle : outwardAngle + Math.PI;
            case Source.VOLUME:
            default:
                return outwardAngle;
        }
    }
}
