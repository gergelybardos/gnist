import { Particle } from '../core/Particle.js';
import { ColorMode, EmissionSource } from '../shared/Constants.js';

import { Emitter } from './Emitter.js';


/**
 * @import { Color } from '../shared/Types.js'
 */

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
 * @property {number} [opacityThreshold=0] Minimum pixel opacity required for emission (0.0 to 1.0).
 * @property {Color} [ignoreColor] RGB color to exclude from particle emission.
 * @property {number} [ignoreColorTolerance=0] Allowed color difference when matching the ignored color (0 to 255).
 * @property {string} [colorMode] Color mode that determines how pixel colors are applied to particles by an ImageEmitter.
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
     * Minimum pixel opacity required for emission (0.0 to 1.0).
     * @type {number}
     */
    opacityThreshold;

    /**
     * RGB color to exclude from particle emission.
     * @type {Color}
     */
    ignoreColor;

    /**
     * Allowed color difference when matching the ignored color (0 to 255).
     * @type {number}
     */
    ignoreColorTolerance;

    /**
     * Color mode that determines how pixel colors are applied to particles by an ImageEmitter.
     * @type {string}
     */
    colorMode;

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
        this.opacityThreshold = config.opacityThreshold ?? 0;
        this.ignoreColor = config.ignoreColor;
        this.ignoreColorTolerance = config.ignoreColorTolerance ?? 0;
        this.colorMode = config.colorMode ?? ColorMode.IMAGE;

        this._overridableFields.push('x', 'y', 'width', 'height', 'opacityThreshold');
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

        const opacity = a / 255;

        if (opacity <= this.opacityThreshold) {
            return false;
        }

        if (this.ignoreColor) {
            const ignoreColor = this.ignoreColor;
            const ignoreTolerance = this.ignoreColorTolerance;

            if (
                Math.abs(r - ignoreColor.r) <= ignoreTolerance &&
                Math.abs(g - ignoreColor.g) <= ignoreTolerance &&
                Math.abs(b - ignoreColor.b) <= ignoreTolerance
            ) {
                return false;
            }
        }

        // Standard sRGB relative luminance coefficients based on the CIE 1931 colorimetric model.
        // Green contributes most to perceived brightness, followed by red and then blue.
        const brightness = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

        super._initParticle(particle, particleBlueprintOverrides);

        if (this.colorMode === ColorMode.COLORIZE) {
            particle.color.r *= brightness;
            particle.color.g *= brightness;
            particle.color.b *= brightness;
        } else {
            particle.color.r = r;
            particle.color.g = g;
            particle.color.b = b;
        }

        particle.opacity = opacity;
        particle.brightness = brightness;

        return true;
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
