import { Particle } from '../core/Particle.js';
import {Source} from '../shared/Constants.js';

import { Emitter } from './Emitter.js';

/**
 * @import { EmitterConfig } from './Emitter.js'
 */

/**
 * RectEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {object} RectEmitterConfig
 * @property {number} [x=0] Horizontal coordinate of the top-left corner of the emission rectangle.
 * @property {number} [y=0] Vertical coordinate of the top-left corner of the emission rectangle.
 * @property {number} [width=100] Width of the emission rectangle.
 * @property {number} [height=100] Height of the emission rectangle.
 */

/**
 * Particle emitter that emits particles from a rectangular area.
 * @class
 * @extends Emitter
 */
export class RectEmitter extends Emitter {
    /**
     * Horizontal coordinate of the top-left corner of the emission rectangle.
     * @type {number}
     */
    x;

    /**
     * Vertical coordinate of the top-left corner of the emission rectangle.
     * @type {number}
     */
    y;

    /**
     * Width of the emission rectangle.
     * @type {number}
     */
    width;

    /**
     * Height of the emission rectangle.
     * @type {number}
     */
    height;

    /**
     * Initializes a rectangle emitter with a given top-left origin position, width, and height.
     * Particles are emitted randomly from the rectangular area using a uniform distribution.
     * @constructor
     * @param {RectEmitterConfig} [config={}] RectEmitter configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.width = config.width ?? 100;
        this.height = config.height ?? 100;
    }

    /**
     * Extends the base initialization by positioning the particle at a random point along or within the rectangle.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    initParticle(particle) {
        if (this.source === Source.VOLUME) {
            particle.x = this.x + Math.random() * this.width;
            particle.y = this.y + Math.random() * this.height;
        } else {
            const perimeter = (this.width * 2) + (this.height * 2);
            const edgePick = Math.random() * perimeter;

            if (edgePick < this.width) {
                // Top edge
                particle.x = this.x + edgePick;
                particle.y = this.y;
            } else if (edgePick < this.width + this.height) {
                // Right edge
                particle.x = this.x + this.width;
                particle.y = this.y + (edgePick - this.width);
            } else if (edgePick < (this.width * 2) + this.height) {
                // Bottom edge
                particle.x = this.x + (edgePick - this.width - this.height);
                particle.y = this.y + this.height;
            } else {
                // Left edge
                particle.x = this.x;
                particle.y = this.y + (edgePick - (this.width * 2) - this.height);
            }
        }

        super.initParticle(particle);
    }

    /**
     * Calculates the default emission direction angle based on the emitter geometry and source mode.
     * @override
     * @param {Particle} particle Particle instance used to calculate the direction from its spawn position.
     * @returns {number} The default direction angle (in radians).
     */
    _getDefaultDirection(particle) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;
        const outwardAngle = Math.atan2(particle.y - centerY, particle.x - centerX);

        switch (this.source) {
            case Source.EDGE_OUT:
            case Source.VOLUME:
                return outwardAngle;
            case Source.EDGE_IN:
                return outwardAngle + Math.PI;
            case Source.EDGE_BOTH:
                return Math.random() > 0.5 ? outwardAngle : outwardAngle + Math.PI;
            default:
                return outwardAngle;
        }
    }
}