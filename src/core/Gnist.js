/**
 * @class
 */
export class Gnist {
    /** @type {Array<Object>} */
    #emitters;

    /** @type {Array<Object>} */
    #particles;

    /** @type {Array<Object>} */
    #forces;

    /** @type {Array<Object>} */
    #modifiers;

    /**
     * @constructor
     */
    constructor() {
        this.#emitters = [];
        this.#particles = [];
        this.#forces = [];
        this.#modifiers = [];
    }

    /**
     * @returns {Array<Object>}
     */
    get particles() {
        return this.#particles;
    }

    /**
     * @param {number} dt
     * @returns {void}
     */
    update(dt) {
        if (dt <= 0) {
            return;
        }
    }
}
