import { Gnist } from '../../src/index.js';

/**
 * @class
 */
export class Sandbox {
    /** @type {HTMLCanvasElement|null} */
    #canvas;

    /** @type {CanvasRenderingContext2D|null} */
    #ctx;

    /** @type {Gnist|null} */
    #particleEngine;

    /** @type {DOMHighResTimeStamp} */
    #lastTime;

    /**
     * @constructor
     */
    constructor() {
        this.#canvas = null;
        this.#ctx = null;
        this.#particleEngine = null;
        this.#lastTime = 0;
    }

    /**
     * @returns {void}
     */
    start() {
        if (!this.#particleEngine) {
            this.#init();
        }

        this.#lastTime = performance.now();

        requestAnimationFrame((time) => this.#loop(time));
    }

    /**
     * @returns {void}
     */
    #init() {
        this.#setupCanvas();

        this.#particleEngine = new Gnist();

        window.addEventListener('resize', () => this.#handleResize());
    }

    /**
     * @param {DOMHighResTimeStamp} currentTime
     * @returns {void}
     */
    #loop(currentTime) {
        const dt = (currentTime - this.#lastTime) / 1000;
        this.#lastTime = currentTime;

        this.#particleEngine.update(dt);

        this.#render();

        requestAnimationFrame((time) => this.#loop(time));
    }

    /**
     * @returns {void}
     */
    #render() {
        const width = this.#canvas.width;
        const height = this.#canvas.height;

        this.#ctx.fillStyle = '#000';
        this.#ctx.fillRect(0, 0, width, height);

        const particles = this.#particleEngine.particles;

        if (particles.length === 0) {
            this.#ctx.fillStyle = '#FFF';
            this.#ctx.font = '16px monospace';
            this.#ctx.textAlign = 'center';
            this.#ctx.textBaseline = 'middle';
            this.#ctx.fillText('Gnist Engine: 0 Particles Active', width / 2, height / 2);
        } else {
            // TODO: future 0.1.0 rendering loop goes here
        }
    }

    /**
     * @returns {void}
     */
    #setupCanvas() {
        let canvas = document.getElementById('canvas');

        if (!canvas) {
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
        }

        this.#canvas = canvas;
        this.#ctx = this.#canvas.getContext('2d');

        this.#resizeCanvasToViewport();
    }

    /**
     * @returns {void}
     */
    #resizeCanvasToViewport() {
        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;
    }

    /**
     * @returns {void}
     */
    #handleResize() {
        this.#resizeCanvasToViewport();

        if (this.#particleEngine && typeof this.#particleEngine.resize === 'function') {
            this.#particleEngine.resize();
        }
    }
}
