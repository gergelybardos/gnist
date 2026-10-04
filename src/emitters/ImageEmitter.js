import { Particle } from '../core/Particle.js';
import { EmissionSource } from '../shared/Constants.js';

import { Emitter } from './Emitter.js';

/**
 * @import { EmitterConfig, ParticleBlueprint } from './Emitter.js'
 */

/**
 * @typedef {object} ImageData
 * @property {number} width Width of the image in pixels.
 * @property {number} height Height of the image in pixels.
 * @property {Uint8ClampedArray} data RGBA pixel data stored in row-major order, with 4 consecutive 0–255 values per pixel.
 */

/**
 * ImageEmitter-specific configuration options.
 * @typedef {object} ImageEmitterConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the top-left corner of the emission rectangle.
 * @property {number} [y=0] Vertical coordinate of the top-left corner of the emission rectangle.
 * @property {number} [width=100] Width of the emission rectangle.
 * @property {number} [height=100] Height of the emission rectangle.
 * @property {ImageData} imageData Image data used to determine particle properties.
 */

/**
 * ImageEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * ImageEmitter always uses {@link EmissionSource.VOLUME} as `emissionSource`.
 * @typedef {EmitterConfig & ImageEmitterConfigSpecifics} ImageEmitterConfig
 */

/**
 * Particle emitter that emits particles from a rectangular area, using image pixel data to determine particle properties.
 * @class
 * @extends Emitter
 */
export class ImageEmitter extends Emitter {
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
     * Image data used to determine particle properties.
     * @type {ImageData}
     */
    imageData;

    /**
     * Initializes an image-based emitter.
     * Particles are emitted randomly from the rectangular area using a uniform distribution.
     * ImageEmitter always uses {@link EmissionSource.VOLUME} as `emissionSource`.
     * @constructor
     * @param {ImageEmitterConfig} [config={}] ImageEmitter configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.emissionSource = EmissionSource.VOLUME;

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.width = config.width ?? 100;
        this.height = config.height ?? 100;
        this.imageData = config.imageData;

        this._overridableFields.push('x', 'y', 'width', 'height');
    }

    /**
     * Extends the base initialization by positioning the particle at a random point along or within the rectangle.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @param {ParticleBlueprint} [particleBlueprintOverrides = {}] Temporary overrides for the particle blueprint.
     * @returns {boolean}
     */
    _initParticle(particle, particleBlueprintOverrides = {}) {
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;

        particle.x = this.x + x;
        particle.y = this.y + y;

        const imageX = Math.floor(x / this.width * this.imageData.width);
        const imageY = Math.floor(y / this.height * this.imageData.height);

        const index = (imageY * this.imageData.width + imageX) * 4;
        const data = this.imageData.data;

        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        particle.color.r = r;
        particle.color.g = g;
        particle.color.b = b;

        particle.opacity = a / 255;

        const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        particle.size = brightness;

        // TODO: return early and skip init if particle should be rejected due to opacity or color filtering

        return super._initParticle(particle, particleBlueprintOverrides);
    }

    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * @override
     * @param {Particle} particle The newly emitted Particle instance providing coordinates for the direction calculation.
     * @returns {number} The default emission direction angle (in radians).
     */
    _getInitialParticleDirection(particle) {
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        return Math.atan2(particle.y - centerY, particle.x - centerX);
    }
}
