import { Gnist } from '../../src/index.js';

export class Sandbox {
    #canvas;
    #ctx;
    #engine;

    constructor() {
        this.#canvas = null;
        this.#ctx = null;
        this.#engine = null;
    }

    start() {
        if (!this.#engine) {
            this.#init();
        }

        this.#engine.start();
    }

    #init() {
        this.#setupCanvas();

        this.#engine = new Gnist(this.#canvas, this.#ctx);

        window.addEventListener('resize', () => this.#handleResize());
    }

    #setupCanvas() {
        let canvas = document.getElementById('canvas');

        if (!canvas) {
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
        }

        this.#canvas = canvas;
        this.#ctx = canvas.getContext('2d');

        this.#resizeCanvasToViewport();
    }

    #resizeCanvasToViewport() {
        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;
    }

    #handleResize() {
        this.#resizeCanvasToViewport();

        if (this.#engine && typeof this.#engine.resize === 'function') {
            this.#engine.resize();
        }
    }
}
