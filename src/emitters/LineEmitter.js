import { Particle } from '../core/Particle.js';
import { EmissionSource } from '../shared/Constants.js';

import { Emitter } from './Emitter.js';

/**
 * @import { EmitterConfig } from './Emitter.js'
 */

/**
 * LineEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {object} LineEmitterConfig
 * @property {number} [x1=0] Horizontal coordinate of the start point of the emission line segment.
 * @property {number} [y1=0] Vertical coordinate of the start point of the emission line segment.
 * @property {number} [x2=100] Horizontal coordinate of the end point of the emission line segment.
 * @property {number} [y2=0] Vertical coordinate of the end point of the emission line segment.
 */

/**
 * Particle emitter that emits particles randomly along a line segment, using a uniform distribution.
 * @class
 * @extends Emitter
 */
export class LineEmitter extends Emitter {
    /**
     * Horizontal coordinate of the start point of the emission line segment.
     * @type {number}
     */
    x1;

    /**
     * Vertical coordinate of the start point of the emission line segment.
     * @type {number}
     */
    y1;

    /**
     * Horizontal coordinate of the end point of the emission line segment.
     * @type {number}
     */
    x2;

    /**
     * Vertical coordinate of the end point of the emission line segment.
     * @type {number}
     */
    y2;

    /**
     * Initializes a line emitter with two endpoints defining a line segment.
     * Particles are emitted randomly along the segment using a uniform distribution.
     * @constructor
     * @param {LineEmitterConfig} [config={}] LineEmitter configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.x1 = config.x1 ?? 0;
        this.y1 = config.y1 ?? 0;
        this.x2 = config.x2 ?? 100;
        this.y2 = config.y2 ?? 0;
    }

    /**
     * Extends the base initialization by positioning the particle at a random point along the line segment.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    _initParticle(particle) {
        super._initParticle(particle);

        const t = Math.random();

        particle.x = this.x1 + (this.x2 - this.x1) * t;
        particle.y = this.y1 + (this.y2 - this.y1) * t;
    }

    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * @override
     * @returns {number} The default emission direction angle (in radians).
     */
    _getDefaultDirection() {
        const dx = this.x2 - this.x1;
        const dy = this.y2 - this.y1;
        const lineAngle = Math.atan2(dy, dx);
        const normalAngle = lineAngle + Math.PI / 2;
        const invertedNormalAngle = lineAngle - Math.PI / 2;

        switch (this.emissionSource) {
            case EmissionSource.EDGE_OUT:
                return normalAngle;
            case EmissionSource.EDGE_IN:
                return invertedNormalAngle;
            case EmissionSource.EDGE_BOTH:
            case EmissionSource.VOLUME:
            default:
                return Math.random() > 0.5 ? normalAngle : invertedNormalAngle;
        }
    }
}
