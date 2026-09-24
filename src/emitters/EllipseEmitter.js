import { Particle } from '../core/Particle.js';
import { EmissionSource } from '../shared/Constants.js';

import { Emitter } from './Emitter.js';

/**
 * @import { EmitterConfig, ParticleBlueprint } from './Emitter.js'
 */

/**
 * EllipseEmitter-specific configuration options.
 * @typedef {object} EllipseEmitterConfigSpecifics
 * @property {number} [x=0] Horizontal coordinate of the emission ellipse center.
 * @property {number} [y=0] Vertical coordinate of the emission ellipse center.
 * @property {number} [radiusX=50] Horizontal radius of the emission ellipse.
 * @property {number} [radiusY=50] Vertical radius of the emission ellipse.
 */

/**
 * EllipseEmitter configuration options. Includes all properties from {@link EmitterConfig}.
 * @typedef {EmitterConfig & EllipseEmitterConfigSpecifics} EllipseEmitterConfig
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
     * Initializes an ellipse emitter with given coordinates and radius.
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

        this._overridableFields.push('x', 'y', 'radiusX', 'radiusY');
    }

    /**
     * Extends the base initialization by positioning the particle at a random point along or within the ellipse.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @param {ParticleBlueprint} [particleBlueprintOverrides] Temporary overrides for the particle blueprint.
     * @returns {void}
     */
    _initParticle(particle, particleBlueprintOverrides = {}) {
        const angle = Math.random() * Math.PI * 2;

        const factor = this.emissionSource === EmissionSource.VOLUME
            ? Math.sqrt(Math.random())
            : 1;

        particle.x = this.x + Math.cos(angle) * this.radiusX * factor;
        particle.y = this.y + Math.sin(angle) * this.radiusY * factor;

        super._initParticle(particle, particleBlueprintOverrides);
    }

    /**
     * Calculates the default emission direction angle based on the emitter geometry and emission source mode.
     * @override
     * @param {Particle} particle The newly emitted Particle instance providing coordinates for the direction calculation.
     * @returns {number} The default emission direction angle (in radians).
     */
    _getInitialParticleDirection(particle) {
        const dy = particle.y - this.y;
        const dx = particle.x - this.x;

        // If a particle is emitted at the center, fallback to a random direction
        const outwardAngle = (dx === 0 && dy === 0)
            ? Math.random() * Math.PI * 2
            : Math.atan2(dy, dx);

        switch (this.emissionSource) {
            case EmissionSource.EDGE_OUT:
                return outwardAngle;
            case EmissionSource.EDGE_IN:
                return outwardAngle + Math.PI;
            case EmissionSource.EDGE_BOTH:
                return Math.random() > 0.5 ? outwardAngle : outwardAngle + Math.PI;
            case EmissionSource.VOLUME:
            default:
                return outwardAngle;
        }
    }
}
