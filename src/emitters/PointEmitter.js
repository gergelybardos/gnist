import { Particle } from '../core/Particle.js';

import { Emitter } from './Emitter.js';

/**
 * @import { EmitterConfig, ParticleBlueprint } from './Emitter.js'
 */

/**
 * PointEmitter configuration options.
 * Includes all properties from {@link EmitterConfig}.
 * @typedef {object} PointEmitterConfig
 * @property {number} [x=0] Horizontal coordinate of the emission point.
 * @property {number} [y=0] Vertical coordinate of the emission point.
 */

/**
 * Particle emitter that emits particles from a single point.
 * @class
 * @extends Emitter
 */
export class PointEmitter extends Emitter {
    /**
     * Horizontal coordinate of the emission point.
     * @type {number}
     */
    x;

    /**
     * Vertical coordinate of the emission point.
     * @type {number}
     */
    y;

    /**
     * Initializes a point emitter with given coordinates.
     * Particles are emitted from the point at the specified coordinates.
     * @constructor
     * @param {PointEmitterConfig} [config={}] PointEmitter configuration options.
     */
    constructor(config = {}) {
        super(config);

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;

        this._overridableFields.push('x', 'y');
    }

    /**
     * Extends the base initialization by positioning the particle at the coordinates of the emitter origin.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @param {ParticleBlueprint|null} [particleBlueprintOverrides=null] Optional particle blueprint overrides.
     * @returns {void}
     */
    _initParticle(particle, particleBlueprintOverrides = null) {
        particle.x = this.x;
        particle.y = this.y;

        super._initParticle(particle, particleBlueprintOverrides);
    }

    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * @override
     * @returns {number} The default emission direction angle (in radians).
     */
    _getDefaultDirection() {
        return 0;
    }
}
