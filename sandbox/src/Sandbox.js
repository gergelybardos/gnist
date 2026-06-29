import { Gnist, PointEmitter, DirectionalForce, LinearDrag, ColorRamp, OpacityFade } from 'gnist';

/**
 * @class
 */
export class Sandbox {
    /** @type {number} */
    static #SIMULATION_AREA_BOUNDS_MARGIN = 50;

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

    // =========================================================================
    // PERFORMANCE METRICS
    // =========================================================================

    /** @type {number} */
    #frameCount;

    /** @type {number} */
    #totalExecutionTimeMs;

    /** @type {number} */
    #avgGnistUpdateTimeMs;

    /** @type {number} */
    #peakAvgGnistUpdateTimeMs;

    /** @type {number} */
    #fps;

    /** @type {number} */
    #totalFrameTimeS;

    /** @type {string} */
    #userAgentInfo;

    /**
     * @constructor
     */
    constructor() {
        this.#canvas = null;
        this.#ctx = null;
        this.#gnistEngine = null;
        this.#pointEmitter = null;
        this.#previousTime = 0;

        this.#frameCount = 0;
        this.#totalExecutionTimeMs = 0;
        this.#avgGnistUpdateTimeMs = 0;
        this.#peakAvgGnistUpdateTimeMs = 0;
        this.#fps = 0;
        this.#totalFrameTimeS = 0;
        this.#userAgentInfo = '';
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
        this.#userAgentInfo = this.#getUserAgentInfo();
        this.#gnistEngine = new Gnist();

        this.#initCanvas();
        this.#initSimulation();
        this.#updateGnistSimulationAreaBounds();

        this.#canvas.addEventListener('mousemove', (event) => this.#handleMouseMove(event));
        window.addEventListener('resize', () => this.#handleResize());
    }

    /**
     * @returns {void}
     */
    #initCanvas() {
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
    #initSimulation() {
        const gravity = new DirectionalForce({ax:0, ay: 200});
        const friction = new LinearDrag({drag: 0.4});

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

        this.#totalExecutionTimeMs += (end - start);
        this.#totalFrameTimeS += dt;
        this.#frameCount++;

        const sampleWindow = 100;

        if (this.#frameCount >= sampleWindow) {
            this.#avgGnistUpdateTimeMs = this.#totalExecutionTimeMs / sampleWindow;
            this.#peakAvgGnistUpdateTimeMs = Math.max(this.#peakAvgGnistUpdateTimeMs, this.#avgGnistUpdateTimeMs);
            this.#fps = Math.round(sampleWindow / this.#totalFrameTimeS);
            this.#frameCount = 0;
            this.#totalExecutionTimeMs = 0;
            this.#totalFrameTimeS = 0;
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

        this.#ctx.fillStyle = '#222';
        this.#ctx.fillRect(0, 0, width, height);

        const particles = this.#gnistEngine.getParticles();
        const particleCount = particles.length;

        if (particleCount === 0) {
            return;
        }

        for (let i = 0; i < particleCount; i++) {
            const particle = particles[i];
            const { r, g, b } = particle.color;
            const a = particle.opacity;

            this.#ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            const size = particle.size ?? 2;

            const halfSize = size / 2;
            let drawX = particle.x - halfSize;
            let drawY = particle.y - halfSize;

            this.#ctx.fillRect(drawX, drawY, size, size);
        }

        this.#renderPerformanceMetricsHud(particleCount);
    }

    /**
     * @param {number} particleCount
     * @returns {void}
     */
    #renderPerformanceMetricsHud(particleCount) {
        this.#ctx.fillStyle = '#CCC';
        this.#ctx.strokeStyle = this.#ctx.fillStyle;
        this.#ctx.lineWidth = 1;
        this.#ctx.font = '14px monospace';
        this.#ctx.textAlign = 'left';
        this.#ctx.textBaseline = 'top';

        const hudRowHeight = 20;
        const hudPadding = Sandbox.#SIMULATION_AREA_BOUNDS_MARGIN + 20;

        const performanceMetricsHudRows = [
            `Gnist version:  ${Gnist.VERSION}`,
            `User agent:     ${this.#userAgentInfo}`,
            '',
            '',
            `Particles:      ${particleCount}`,
            '',
            `Simulation:`,
            `  Avg. update:  ${this.#avgGnistUpdateTimeMs.toFixed(3)} ms`,
            `  Peak avg.:    ${this.#peakAvgGnistUpdateTimeMs.toFixed(3)} ms`,
            '',
            `Rendering:`,
            `  FPS:          ${this.#fps}`,
        ];

        for (let i = 0; i < performanceMetricsHudRows.length; i++) {
            this.#ctx.fillText(performanceMetricsHudRows[i], hudPadding, hudPadding + hudRowHeight * i);
        }

        this.#ctx.strokeRect(
            this.#gnistEngine.config.simulationAreaBounds.xMin,
            this.#gnistEngine.config.simulationAreaBounds.yMin,
            this.#gnistEngine.config.simulationAreaBounds.xMax - this.#gnistEngine.config.simulationAreaBounds.xMin,
            this.#gnistEngine.config.simulationAreaBounds.yMax - this.#gnistEngine.config.simulationAreaBounds.yMin,
        );
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
        this.#updateGnistSimulationAreaBounds();
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
    #updateGnistSimulationAreaBounds() {
        if (!this.#gnistEngine || !this.#canvas) {
            return;
        }

        this.#gnistEngine.config.simulationAreaBounds = {
            xMin: Sandbox.#SIMULATION_AREA_BOUNDS_MARGIN,
            yMin: Sandbox.#SIMULATION_AREA_BOUNDS_MARGIN,
            xMax: this.#canvas.width - Sandbox.#SIMULATION_AREA_BOUNDS_MARGIN,
            yMax: this.#canvas.height - Sandbox.#SIMULATION_AREA_BOUNDS_MARGIN,
        };
    }
    /**
     * @returns {string}
     */
    #getUserAgentInfo() {
        const ua = navigator.userAgent;

        if (ua.includes('OPR/')) return `Opera ${ua.split('OPR/')[1].split('.')[0]}`;
        if (ua.includes('Edg/')) return `Microsoft Edge ${ua.split('Edg/')[1].split('.')[0]}`;
        if (ua.includes('Chrome/')) return `Google Chrome ${ua.split('Chrome/')[1].split('.')[0]}`;
        if (ua.includes('Firefox/')) return `Mozilla Firefox ${ua.split('Firefox/')[1].split('.')[0]}`;
        if (ua.includes('Safari/')) return `Apple Safari ${ua.split('Version/')[1].split(' ')[0]}`;

        return 'Unknown Browser';
    }
}
