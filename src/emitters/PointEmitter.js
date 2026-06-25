import { Particle } from '../core/Particle.js';

import { Emitter } from './Emitter.js';

/**
 * Particle emitter that emits particles from a single point.
 * @class
 * @extends Emitter
 */
export class PointEmitter extends Emitter {
    /**
     * Extends the base initialization by positioning the particle at the coordinates of the emitter origin.
     * @override
     * @param {Particle} particle Particle instance to initialize.
     * @returns {void}
     */
    initParticle(particle) {
        super.initParticle(particle);

        particle.x = this.x;
        particle.y = this.y;
    }
}
