import { Particle } from '../core/Particle.js';
import {Source} from '../shared/Constants.js';

import { Emitter } from './Emitter.js';

/**
 * @import { EmitterConfig } from './Emitter.js'
 */

/**
 * CircleEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {object} CircleEmitterConfig
 * @property {number} [x=0] Horizontal coordinate of the emission circle center.
 * @property {number} [y=0] Vertical coordinate of the emission circle center.
 * @property {number} [radius=50] Radius of the emission circle.
 */

/**
 * Particle emitter that emits particles randomly from a circular area, using a uniform distribution.
 * @class
 * @extends Emitter
 */
export class CircleEmitter extends Emitter {
    /**
     * Horizontal coordinate of the emission circle center.
     * @type {number}
     */
    x;

    /**
     * Vertical coordinate of the emission circle center.
     * @type {number}
     */
    y;

    /**
     * Radius of the emission circle.
     * @type {number}
     */
    radius;

    /**
     * Initializes a circle emitter with a given position and radius.
     * Particles are emitted randomly from the circular area using a uniform distribution.
     * @constructor
     * @param {CircleEmitterConfig} [config={}] CircleEmitter configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.radius = config.radius ?? 50;
    }

    /**
     * Extends the base initialization by positioning the particle at a random point along or within the circle.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    initParticle(particle) {
        const angle = Math.random() * Math.PI * 2;

        const r = this.source === Source.VOLUME
            ? Math.sqrt(Math.random()) * this.radius
            : this.radius;

        particle.x = this.x + Math.cos(angle) * r;
        particle.y = this.y + Math.sin(angle) * r;

        super.initParticle(particle);
    }

    /**
     * Calculates the default emission direction angle.
     * @override
     * @param {Particle} particle - Particle instance properties may be necessary for the calculation.
     * @returns {number} The fallback emission direction angle (in radians).
     */
    getDefaultDirection(particle) {
        const outwardAngle = Math.atan2(particle.y - this.y, particle.x - this.x);

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
