/**
 * Particle modifier that blends a particle's opacity over time between two target levels.
 * @class
 * @extends Modifier
 */
export class OpacityFade extends Modifier {
    /**
     * Initializes an opacity fade modifier with starting and ending opacity levels.
     * @constructor
     * @param {number} [startOpacity=1.0] Opacity at emission.
     * @param {number} [endOpacity=0.0] Opacity at death.
     */
    constructor(startOpacity?: number, endOpacity?: number);
    /**
     * Target opacity at particle emission.
     * @type {number}
     */
    startOpacity: number;
    /**
     * Target opacity at particle death.
     * @type {number}
     */
    endOpacity: number;
}
import { Modifier } from './Modifier.js';
