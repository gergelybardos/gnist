/**
 * Particle emitter that emits particles from a single point.
 * @class
 * @extends Emitter
 */
export class PointEmitter extends Emitter {
    /**
     * Calculates the default emission direction angle based on the emitter geometry and source mode.
     * @override
     * @returns {number} The default emission direction angle (in radians).
     */
    override _getDefaultDirection(): number;
}
import { Emitter } from './Emitter.js';
