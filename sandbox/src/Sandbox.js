import { Gnist, PointEmitter, DirectionalForce, LinearDrag, ColorRamp, OpacityFade } from 'gnist';

/**
 * @class
 */
export class Sandbox {
    /** @type {HTMLCanvasElement|null} */
    #canvas;

    /** @type {CanvasRenderingContext2D|null} */
    #ctx;

    /** @type {Gnist|null} */
    #gnistEngine;

    /** @type {PointEmitter|null} */
    #pointEmitter;

    /** @type {DOMHighResTimeStamp} */
    #previousTime;

    /** @type {number} */
    #frameCounter;

    /** @type {number} */
    #totalExecutionTime;

    /** @type {number} */
    #avgFrameUpdateDurationMs;

    /**
     * @constructor
     */
    constructor() {
        this.#canvas = null;
        this.#ctx = null;
        this.#gnistEngine = null;
        this.#pointEmitter = null;
        this.#previousTime = 0;
        this.#frameCounter = 0;
        this.#totalExecutionTime = 0;
        this.#avgFrameUpdateDurationMs = 0;
    }

    /**
     * @returns {void}
     */
    start() {
        if (!this.#gnistEngine) {
            this.#init();
        }

        this.#previousTime = performance.now();

        requestAnimationFrame((time) => this.#loop(time));
    }

    /**
     * @returns {void}
     */
    #init() {
        this.#setupCanvas();

        this.#gnistEngine = new Gnist();

        const gravity = new DirectionalForce({ax:0, ay: 100});
        const friction = new LinearDrag({drag: 0.1});

        const fade = new OpacityFade(1.0, 0.0);
        const rainbowRamp = new ColorRamp([
            [0, 242, 254],
            [143, 0, 255],
            [255, 0, 127],
            [255, 102, 0],
        ]);

        this.#pointEmitter = new PointEmitter({
            x: this.#canvas.width / 2,
            y: this.#canvas.height / 2,
            particlesPerSecond: 500,
            spawnConfig: {
                size: [1, 8],
                lifespan: [1, 3],
                speed: [15, 150],
                rotation: [0, Math.PI * 2],
            }
        });

        this.#pointEmitter.addModifier(fade);
        this.#pointEmitter.addModifier(rainbowRamp);

        this.#gnistEngine.addGlobalForce(gravity);
        this.#gnistEngine.addGlobalForce(friction);
        this.#gnistEngine.addEmitter(this.#pointEmitter);

        this.#canvas.addEventListener('mousemove', (event) => this.#handleMouseMove(event));
        window.addEventListener('resize', () => this.#handleResize());
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
     * @param {DOMHighResTimeStamp} currentTime
     * @returns {void}
     */
    #loop(currentTime) {
        const dt = (currentTime - this.#previousTime) / 1000;
        this.#previousTime = currentTime;
        const safeDt = Math.min(dt, 0.1);

        const start = performance.now();
        this.#gnistEngine.update(safeDt);
        const end = performance.now();

        this.#totalExecutionTime += (end - start);
        this.#frameCounter++;
        if (this.#frameCounter >= 100) {
            this.#avgFrameUpdateDurationMs = this.#totalExecutionTime / 1000;
            this.#frameCounter = 0;
            this.#totalExecutionTime = 0;
        }

        this.#render();

        requestAnimationFrame((time) => this.#loop(time));
    }

    /**
     * @returns {void}
     */
    #render() {
        const width = this.#canvas.width;
        const height = this.#canvas.height;

        this.#ctx.fillStyle = '#111';
        this.#ctx.fillRect(0, 0, width, height);

        const particles = this.#gnistEngine.getParticles();

        if (particles.length === 0) {
            return;
        }

        const count = particles.length;

        for (let i = 0; i < count; i++) {
            const particle = particles[i];

            const { r, g, b } = particle.color;
            const a = particle.opacity;

            this.#ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

            const size = particle.size ?? 2;
            this.#ctx.fillRect(Math.floor(particle.x - size / 2), Math.floor(particle.y - size / 2), size, size);
        }

        this.#ctx.fillStyle = '#e1e1e1';
        this.#ctx.font = '14px monospace';
        this.#ctx.textAlign = 'left';
        this.#ctx.textBaseline = 'top';
        this.#ctx.fillText(`Particle count: ${count}`, 25, 25);
        this.#ctx.fillText(`Avg. update time: ${this.#avgFrameUpdateDurationMs} ms`, 25, 50);
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #handleMouseMove(event) {
        if (!this.#pointEmitter || !this.#canvas) {
            return;
        }

        const bounds = this.#canvas.getBoundingClientRect();

        this.#pointEmitter.x = event.clientX - bounds.left;
        this.#pointEmitter.y = event.clientY - bounds.top;
    }

    /**
     * @returns {void}
     */
    #handleResize() {
        this.#resizeCanvasToViewport();
    }

    /**
     * @returns {void}
     */
    #resizeCanvasToViewport() {
        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;
    }
}
