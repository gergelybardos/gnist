import {
    ColorRamp,
    ElasticAnchor,
    EmissionSource,
    FlatParticleDataFormat,
    Gnist,
    LineEmitter,
    LinearDrag,
    LoopMode,
    OpacityFade,
    PointEmitter,
    RadialForce,
    RectEmitter,
    ScaleTween,
    Spin,
} from 'gnist';

/**
 * @class
 */
export class Sandbox {
    /** @type {string} */
    static get #MODE_CANVAS_2D() {
        return 'canvas';
    }

    /** @type {string} */
    static get #MODE_WEBGL2() {
        return 'webgl';
    }

    /** @type {number} */
    static get #CULLING_BOUNDS_MARGIN() {
        return 50;
    }

    // =========================================================================
    // CORE
    // =========================================================================

    /** @type {Array} */
    #avgGnistUpdateTimeSamplesMs;

    /** @type {number} */
    #performanceHistoryMaxSize;

    /** @type {Gnist|null} */
    #gnistEngine;

    /** @type {DOMHighResTimeStamp} */
    #previousTime;

    /** @type {boolean} */
    #useCullingBounds;

    /** @type {number} */
    #particleCountLimit;

    /** @type {number} */
    #sampleWindow;

    /** @type {number} */
    #warmupDurationS;

    /** @type {PointEmitter|null} */
    #mainEmitter;

    /** @type {RadialForce|null} */
    #repulsion;

    // =========================================================================
    // RENDERING
    // =========================================================================

    /** @type {string} */
    #renderMode;

    /** @type {HTMLCanvasElement|null} */
    #simulationCanvas;

    /** @type {HTMLCanvasElement|null} */
    #overlayCanvas;

    /** @type {CanvasRenderingContext2D|null} */
    #overlayCtx;

    /** @type {CanvasRenderingContext2D|null} */
    #canvas2dCtx;

    /** @type {WebGL2RenderingContext|null} */
    #webgl2Ctx;

    /** @type {Float32Array|null} */
    #glBufferData;

    /** @type {WebGLProgram|null} */
    #glProgram;

    /** @type {WebGLBuffer|null} */
    #glBuffer;

    /** @type {WebGLBuffer|null} */
    #glQuadBuffer;

    // =========================================================================
    // OPERATIONS
    // =========================================================================

    /** @type {boolean} */
    #displayPerformanceMetricsHud;

    /** @type {boolean} */
    #displayGrid;

    /** @type {boolean} */
    #takeScreenshotNextFrame;

    /** @type {boolean} */
    #getReportNextFrame;

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
    #troughAvgGnistUpdateTimeMs;

    /** @type {number} */
    #fps;

    /** @type {number} */
    #totalFrameTimeS;

    /** @type {number} */
    #totalSimulationTimeS;

    /** @type {string} */
    #userAgentInfo;

    /**
     * @constructor
     * @param {string} [mode='canvas']
     * @param {boolean} [useCullingBounds=true]
     */
    constructor(mode = Sandbox.#MODE_CANVAS_2D, useCullingBounds = true) {
        // Core
        this.#avgGnistUpdateTimeSamplesMs = [];
        this.#performanceHistoryMaxSize = 200;
        this.#gnistEngine = null;
        this.#previousTime = 0;
        this.#useCullingBounds = useCullingBounds;
        this.#particleCountLimit = 500000;
        this.#sampleWindow = 100;
        this.#warmupDurationS = 10;
        this.#mainEmitter = null;
        this.#repulsion = null;

        // Rendering
        this.#renderMode = mode;
        this.#simulationCanvas = null;
        this.#overlayCanvas = null;
        this.#overlayCtx = null;
        this.#canvas2dCtx = null;
        this.#webgl2Ctx = null;
        this.#glBufferData = null;
        this.#glProgram = null;
        this.#glBuffer = null;
        this.#glQuadBuffer = null;

        // Operations
        this.#displayPerformanceMetricsHud = true;
        this.#displayGrid = false;
        this.#takeScreenshotNextFrame = false;
        this.#getReportNextFrame = false;

        // Performance metrics
        this.#frameCount = 0;
        this.#totalExecutionTimeMs = 0;
        this.#avgGnistUpdateTimeMs = 0;
        this.#peakAvgGnistUpdateTimeMs = 0;
        this.#troughAvgGnistUpdateTimeMs = Infinity;
        this.#fps = 0;
        this.#totalFrameTimeS = 0;
        this.#totalSimulationTimeS = 0;
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
        this.#gnistEngine = new Gnist();
        this.#userAgentInfo = this.#getUserAgentInfo();

        this.#initCanvas();

        this.#initShowcaseSimulation();
        //this.#initBenchmarkSimulation();

        if (this.#renderMode === Sandbox.#MODE_WEBGL2) {
            this.#initWebGL();
        }

        this.#updateGnistCullingBounds();

        this.#simulationCanvas.addEventListener('mousemove', (event) => this.#handleMouseMove(event));

        window.addEventListener('resize', () => this.#handleResize());
        window.addEventListener('keydown', (event) => this.#handleKeyDown(event));
    }

    /**
     * @returns {void}
     * @throws {Error}
     */
    #initCanvas() {
        const container = document.createElement('div');
        container.id = 'container';

        this.#simulationCanvas = document.createElement('canvas');
        this.#simulationCanvas.id = 'simulation-canvas';

        this.#overlayCanvas = document.createElement('canvas');
        this.#overlayCanvas.id = 'overlay-canvas';

        container.appendChild(this.#simulationCanvas);
        container.appendChild(this.#overlayCanvas);
        document.body.appendChild(container);

        this.#overlayCtx = this.#getContext(this.#overlayCanvas, '2d');

        switch (this.#renderMode) {
            case Sandbox.#MODE_CANVAS_2D:
                this.#canvas2dCtx = this.#getContext(this.#simulationCanvas, '2d');
                break;
            case Sandbox.#MODE_WEBGL2:
                this.#webgl2Ctx = this.#getContext(this.#simulationCanvas, 'webgl2', {
                    alpha: false,
                    premultipliedAlpha: false,
                });
                break;
            default:
                throw new Error(`Unsupported render mode: ${this.#renderMode}`);
        }

        this.#resizeCanvasToViewport();
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {'2d'|'webgl2'} type
     * @param {object} [options={}]
     * @returns {CanvasRenderingContext2D|WebGL2RenderingContext}
     * @throws {Error}
     */
    #getContext(canvas, type, options = {}) {
        const ctx = canvas.getContext(type, options);

        if (!ctx) {
            const name = type === 'webgl2' ? 'WebGL2' : 'Canvas 2D';
            throw new Error(`Failed to initialize ${name} context.`);
        }

        return ctx;
    }

    /**
     * @returns {void}
     */
    #initWebGL() {
        const gl = this.#webgl2Ctx;

        if (!gl) {
            return;
        }

        const vertexShaderSource = `#version 300 es
            in vec2 a_quadVertex;

            in vec2 a_position;
            in float a_size;
            in float a_rotation;
            in vec3 a_color;
            in float a_opacity;

            out vec3 v_color;
            out float v_opacity;
            out vec2 v_texCoord;

            uniform vec2 u_resolution;

            void main() {
                float s = sin(a_rotation);
                float c = cos(a_rotation);

                vec2 localScaledVertex = a_quadVertex * a_size;

                vec2 localRotatedVertex = vec2(
                    localScaledVertex.x * c - localScaledVertex.y * s,
                    localScaledVertex.x * s + localScaledVertex.y * c
                );

                vec2 worldPosition = a_position + localRotatedVertex;

                vec2 zeroToOne = worldPosition / u_resolution;
                vec2 zeroToTwo = zeroToOne * 2.0;
                vec2 clipSpace = zeroToTwo - 1.0;

                gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);

                v_color = a_color;
                v_opacity = a_opacity;
                v_texCoord = a_quadVertex + 0.5;
            }
        `;

        const fragmentShaderSource = `#version 300 es
            precision highp float;

            in vec3 v_color;
            in float v_opacity;
            in vec2 v_texCoord;

            out vec4 outColor;

            void main() {
                outColor = vec4(v_color, v_opacity);
            }
        `;

        const createShader = (gl, type, source) => {
            const shader = gl.createShader(type);

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);

                return null;
            }

            return shader;
        };

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        this.#glProgram = gl.createProgram();

        gl.attachShader(this.#glProgram, vertexShader);
        gl.attachShader(this.#glProgram, fragmentShader);
        gl.linkProgram(this.#glProgram);

        if (!gl.getProgramParameter(this.#glProgram, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.#glProgram));
            return;
        }

        this.#glBuffer = gl.createBuffer();

        const quadVertices = new Float32Array([
            -0.5, -0.5,
            0.5, -0.5,
            -0.5,  0.5,
            -0.5,  0.5,
            0.5, -0.5,
            0.5,  0.5,
        ]);

        this.#glQuadBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.#glQuadBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

        this.#glBufferData = new Float32Array(this.#particleCountLimit * FlatParticleDataFormat.FLOATS_PER_PARTICLE);
    }

    /**
     * @returns {void}
     */
    #initShowcaseSimulation() {
        const gnistColorRamp = new ColorRamp({
            colors: [
                [0, 242, 254],
                [143, 0, 255],
                [255, 0, 127],
                [255, 102, 0],
            ],
        });

        const fadeOut = new OpacityFade({
            startOpacity: 1.0,
            endOpacity: 0.0,
        });

        const enlarge = new ScaleTween({
            startScale: 1,
            endScale: 5,
        });

        const spin = new Spin({});

        const anchor = new ElasticAnchor({
            damping: 0.9,
        });

        const friction = new LinearDrag({
            drag: 0.4,
        });

        this.#repulsion = new RadialForce({
            x: this.#simulationCanvas.width / 2,
            y: this.#simulationCanvas.height / 2,
            strength: -100000,
        });

        const webEmitter = new RectEmitter({
            x: Sandbox.#CULLING_BOUNDS_MARGIN + 10,
            y: Sandbox.#CULLING_BOUNDS_MARGIN + 10,
            width: this.#simulationCanvas.width - (Sandbox.#CULLING_BOUNDS_MARGIN - 20) * 2,
            height: this.#simulationCanvas.height - (Sandbox.#CULLING_BOUNDS_MARGIN - 20) * 2,
            particlesPerSecond: 1500,
            duration: 1,

            /** @type {ParticleBlueprint} */
            particleBlueprint: {
                color: {
                    r: 154,
                    g: 160,
                    b: 166,
                },
                size: [1, 2],
                lifespan: 5,
                loopLifecycle: true,
                loopMode: LoopMode.OSCILLATE,
                speed: [0.5, 1.5],
                direction: [0, Math.PI * 2],
            }
        });

        const subEmitter = new PointEmitter({
            enabled: false,
            x: this.#simulationCanvas.width / 2,
            y: this.#simulationCanvas.height / 2,
            particlesPerSecond: 10,
            particleBlueprint: {
                size: [1, 2],
                lifespan: [1, 2],
                speed: [50, 150],
                direction: [0, Math.PI * 2],
            }
        });

        this.#mainEmitter = new PointEmitter({
            x: this.#simulationCanvas.width / 2,
            y: this.#simulationCanvas.height / 2,
            particlesPerSecond: 50,
            particleBlueprint: {
                onDeath: (particle) => {
                    subEmitter.emit(10, { x: particle.x, y: particle.y });
                },
                angularVelocity: [1, 6],
                size: [1, 3],
                lifespan: [1, 2],
                speed: [10, 50],
                direction: [0, Math.PI * 2],
            }
        });

        this.#mainEmitter.addModifier(gnistColorRamp);
        this.#mainEmitter.addModifier(fadeOut);
        this.#mainEmitter.addModifier(enlarge);
        this.#mainEmitter.addModifier(spin);

        subEmitter.addModifier(gnistColorRamp);
        subEmitter.addModifier(fadeOut);

        webEmitter.addModifier(gnistColorRamp);
        webEmitter.addModifier(anchor);
        webEmitter.addScopedForce(this.#repulsion);

        this.#gnistEngine.addGlobalForce(friction);

        this.#gnistEngine.addEmitter(this.#mainEmitter);
        this.#gnistEngine.addEmitter(subEmitter);
        this.#gnistEngine.addEmitter(webEmitter);
    }

    /**
     * @returns {void}
     */
    #initBenchmarkSimulation() {
        const EMITTER_PRESETS = {
            1000:    [1000,   1.0, 200],
            10000:   [5000,   2.0, 150],
            50000:   [10000,  5.0, 120],
            100000:  [20000,  5.0, 180],
            500000:  [100000, 5.0, 200],
            1000000: [200000, 5.0, 200],
        };

        const TARGET_PARTICLE_COUNT = 1000;
        const [particlesPerSecond, lifespan, speed] = EMITTER_PRESETS[TARGET_PARTICLE_COUNT];

        this.#particleCountLimit = TARGET_PARTICLE_COUNT;
        this.#useCullingBounds = false;

        const lineEmitter = new LineEmitter({
            x1: 50,
            y1: 50,
            x2: this.#simulationCanvas.width - 50,
            y2: 50,
            particlesPerSecond: particlesPerSecond,
            emissionSource: EmissionSource.EDGE_OUT,
            particleBlueprint: {
                size: 1,
                lifespan: lifespan,
                speed: speed,
            }
        });
/*
        const fadeOut = new OpacityFade({
            startOpacity: 1.0,
            endOpacity: 0.0,
        });

        const enlarge = new ScaleTween({
            startScale: 1,
            endScale: 5,
        });

        const colorRamp = new ColorRamp({
            colors: [
                [0, 242, 254],
                [143, 0, 255],
                [255, 0, 127],
                [255, 102, 0],
            ],
        });

        lineEmitter.addModifier(fadeOut);
        lineEmitter.addModifier(enlarge);
        lineEmitter.addModifier(colorRamp);
*/
        this.#gnistEngine.addEmitter(lineEmitter);
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

        this.#updatePerformanceMetrics(end, start, dt, safeDt);

        this.#render();

        if (this.#takeScreenshotNextFrame) {
            this.#takeScreenshotNextFrame = false;
            this.#downloadMergedSnapshot();
        }

        if (this.#getReportNextFrame) {
            this.#getReportNextFrame = false;
            this.#downloadPerformanceReport();
        }

        requestAnimationFrame((time) => this.#loop(time));
    }

    /**
     * @param {DOMHighResTimeStamp} end
     * @param {DOMHighResTimeStamp} start
     * @param {number} dt
     * @param {number} safeDt
     */
    #updatePerformanceMetrics(end, start, dt, safeDt) {
        this.#totalExecutionTimeMs += (end - start);
        this.#totalFrameTimeS += dt;
        this.#frameCount++;
        this.#totalSimulationTimeS += safeDt;

        if (this.#frameCount >= this.#sampleWindow) {
            this.#avgGnistUpdateTimeMs = this.#totalExecutionTimeMs / this.#sampleWindow;

            this.#avgGnistUpdateTimeSamplesMs.push(this.#avgGnistUpdateTimeMs);

            if (this.#avgGnistUpdateTimeSamplesMs.length > this.#performanceHistoryMaxSize) {
                this.#avgGnistUpdateTimeSamplesMs.shift();
            }

            this.#peakAvgGnistUpdateTimeMs = Math.max(this.#peakAvgGnistUpdateTimeMs, this.#avgGnistUpdateTimeMs);

            if (   this.#totalSimulationTimeS > this.#warmupDurationS
                && this.#troughAvgGnistUpdateTimeMs > 0
                && this.#avgGnistUpdateTimeMs > 0
            ) {
                this.#troughAvgGnistUpdateTimeMs = Math.min(this.#troughAvgGnistUpdateTimeMs, this.#avgGnistUpdateTimeMs);
            }

            this.#fps = Math.round(this.#sampleWindow / this.#totalFrameTimeS);
            this.#totalExecutionTimeMs = 0;
            this.#totalFrameTimeS = 0;
            this.#frameCount = 0;
        }
    }

    /**
     * @returns {void}
     */
    #render() {
        const width = this.#simulationCanvas.width;
        const height = this.#simulationCanvas.height;
        const particles = this.#gnistEngine.particles;
        const particleCount = particles.length;

        switch (this.#renderMode) {
            case Sandbox.#MODE_CANVAS_2D:
                this.#renderCanvas2D(particles, particleCount, width, height);
                break;
            case Sandbox.#MODE_WEBGL2:
                this.#renderWebGL(particles, particleCount, width, height);
                break;
        }

        this.#overlayCtx.clearRect(0, 0, this.#overlayCanvas.width, this.#overlayCanvas.height);

        this.#renderPerformanceMetricsHud(particleCount);
        this.#renderGrid();
    }

    /**
     * @param {number} [cellWidth=210]
     * @param {number} [cellHeight=160]
     * @param {boolean} [showCoordinates=true]
     * @returns {void}
     */
    #renderGrid(cellWidth = 210, cellHeight = 160, showCoordinates = true) {
        if (!this.#overlayCanvas || !this.#overlayCtx || !this.#displayGrid) {
            return;
        }

        this.#overlayCtx.font = '12px monospace';
        this.#overlayCtx.fillStyle = '#9AA0A6';
        this.#overlayCtx.strokeStyle = '#2A2F3A';
        this.#overlayCtx.lineWidth = 1;

        for (let x = 0; x <= this.#overlayCanvas.width; x += cellWidth) {
            this.#overlayCtx.beginPath();
            this.#overlayCtx.moveTo(x, 0);
            this.#overlayCtx.lineTo(x, this.#overlayCanvas.height);
            this.#overlayCtx.stroke();

            if (showCoordinates) {
                for (let y = 0; y <= this.#overlayCanvas.height; y += cellHeight) {
                    this.#overlayCtx.fillText(`(${x}, ${y})`, x + 4, y + 14);
                }
            }
        }

        for (let y = 0; y <= this.#overlayCanvas.height; y += cellHeight) {
            this.#overlayCtx.beginPath();
            this.#overlayCtx.moveTo(0, y);
            this.#overlayCtx.lineTo(this.#overlayCanvas.width, y);
            this.#overlayCtx.stroke();
        }
    }

    /**
     * @param {Array} particles
     * @param {number} particleCount
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    #renderCanvas2D(
        particles,
        particleCount,
        width,
        height
    ) {
        this.#canvas2dCtx.fillStyle = '#141419';
        this.#canvas2dCtx.fillRect(0, 0, width, height);

        for (let i = 0; i < particleCount; i++) {
            const particle = particles[i];
            const { r, g, b } = particle.color;
            const a = particle.opacity;
            const size = particle.size ?? 2;
            const rotation = particle.rotation ?? 0;

            const halfSize = size / 2;

            this.#canvas2dCtx.save();
            this.#canvas2dCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;

            this.#canvas2dCtx.translate(particle.x, particle.y);

            if (rotation !== 0) {
                this.#canvas2dCtx.rotate(rotation);
            }

            this.#canvas2dCtx.fillRect(-halfSize, -halfSize, size, size);
            this.#canvas2dCtx.restore();
        }
    }

    /**
     * @param {Array} particles
     * @param {number} particleCount
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
    #renderWebGL(
        particles,
        particleCount,
        width,
        height
    ) {
        const gl = this.#webgl2Ctx;

        if (!gl || !this.#glProgram || !this.#glBufferData) {
            return;
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.viewport(0, 0, width, height);
        gl.clearColor(0.0784, 0.0784, 0.0980, 1.0); // #141419
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (particleCount === 0) {
            return;
        }

        gl.useProgram(this.#glProgram);

        const resolutionUniformLocation = gl.getUniformLocation(this.#glProgram, 'u_resolution');
        gl.uniform2f(resolutionUniformLocation, width, height);

        const activeCount = this.#gnistEngine.fillFlatArray(this.#glBufferData);

        if (activeCount === 0) {
            return;
        }

        // Bind the standard quad vertices (vertex attributes)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#glQuadBuffer);
        const quadVertLoc = gl.getAttribLocation(this.#glProgram, 'a_quadVertex');
        gl.enableVertexAttribArray(quadVertLoc);
        gl.vertexAttribPointer(quadVertLoc, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(quadVertLoc, 0);

        // Bind dynamic particle data (instance attributes)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#glBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.#glBufferData.subarray(0, activeCount * FlatParticleDataFormat.FLOATS_PER_PARTICLE), gl.DYNAMIC_DRAW);

        // Stride is permanently 32 bytes (8 floats * 4 bytes per float)
        const stride = FlatParticleDataFormat.FLOATS_PER_PARTICLE * Float32Array.BYTES_PER_ELEMENT;

        // Position (Offset: 0)
        const posLoc = gl.getAttribLocation(this.#glProgram, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, 0);
        gl.vertexAttribDivisor(posLoc, 1);

        // Size (Offset: 2 floats * 4 bytes = 8)
        const sizeLoc = gl.getAttribLocation(this.#glProgram, 'a_size');
        gl.enableVertexAttribArray(sizeLoc);
        gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride, 8);
        gl.vertexAttribDivisor(sizeLoc, 1);

        // Rotation (Offset: 3 floats * 4 bytes = 12)
        const rotationLoc = gl.getAttribLocation(this.#glProgram, 'a_rotation');
        gl.enableVertexAttribArray(rotationLoc);
        gl.vertexAttribPointer(rotationLoc, 1, gl.FLOAT, false, stride, 12);
        gl.vertexAttribDivisor(rotationLoc, 1);

        // Color (Offset: 4 floats * 4 bytes = 16)
        const colorLoc = gl.getAttribLocation(this.#glProgram, 'a_color');
        gl.enableVertexAttribArray(colorLoc);
        gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, stride, 16);
        gl.vertexAttribDivisor(colorLoc, 1);

        // Opacity (Offset: 7 floats * 4 bytes = 28)
        const opacityLoc = gl.getAttribLocation(this.#glProgram, 'a_opacity');
        gl.enableVertexAttribArray(opacityLoc);
        gl.vertexAttribPointer(opacityLoc, 1, gl.FLOAT, false, stride, 28);
        gl.vertexAttribDivisor(opacityLoc, 1);

        // Draw particles as instanced quads (6 vertices per quad)
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, activeCount);

        // Clean up
        gl.vertexAttribDivisor(posLoc, 0);
        gl.vertexAttribDivisor(sizeLoc, 0);
        gl.vertexAttribDivisor(rotationLoc, 0);
        gl.vertexAttribDivisor(colorLoc, 0);
        gl.vertexAttribDivisor(opacityLoc, 0);
    }

    /**
     * @param {number} particleCount
     * @returns {void}
     */
    #renderPerformanceMetricsHud(particleCount) {
        if (!this.#overlayCanvas || !this.#overlayCtx || !this.#displayPerformanceMetricsHud) {
            return;
        }

        this.#overlayCtx.fillStyle = '#9AA0A6';
        this.#overlayCtx.strokeStyle = '#2A2F3A';
        this.#overlayCtx.lineWidth = 1;
        this.#overlayCtx.font = '14px monospace';
        this.#overlayCtx.textAlign = 'left';
        this.#overlayCtx.textBaseline = 'top';

        const hudRowHeight = 20;
        const hudPadding = 20;
        const renderMode = this.#getRenderMode();
        const troughAvgGnistUpdateTimeMs = this.#troughAvgGnistUpdateTimeMs !== Infinity
            ? this.#troughAvgGnistUpdateTimeMs.toFixed(4) + ' ms'
            : '-';

        const performanceMetricsHudRows = [
            '',
            `Gnist version:    ${Gnist.VERSION}`,
            `User agent:       ${this.#userAgentInfo}`,
            '',
            'Simulation:',
            `  Elapsed time:   ${Math.floor(this.#totalSimulationTimeS)} s`,
            `  Particle count: ${particleCount}`,
            '',
            'Measurement:',
            `  Warm-up:        ${this.#warmupDurationS} s`,
            `  Sample window:  ${this.#sampleWindow} frames`,
            `  Samples:        ${this.#avgGnistUpdateTimeSamplesMs.length}`,
            '',
            'Performance:',
            `  Avg. update:    ${this.#avgGnistUpdateTimeMs.toFixed(4)} ms`,
            `  Peak avg.:      ${this.#peakAvgGnistUpdateTimeMs.toFixed(4)} ms`,
            `  Trough avg.:    ${troughAvgGnistUpdateTimeMs}`,
            '',
            'Rendering:',
            `  Mode:           ${renderMode}`,
            `  FPS:            ${this.#fps}`,
        ];

        for (let i = 0; i < performanceMetricsHudRows.length; i++) {
            this.#overlayCtx.fillText(performanceMetricsHudRows[i], hudPadding, hudPadding + hudRowHeight + hudRowHeight * i);
        }

        const shortcutHintForSnapshot = '[CTRL+H] Toggle HUD   [CTRL+G] Toggle Grid   [CTRL+S] Take Snapshot   [CTRL+R] Generate Report';
        const shortcutHintForSnapshotWidth = this.#overlayCtx.measureText(shortcutHintForSnapshot).width;
        this.#overlayCtx.fillText(shortcutHintForSnapshot, (this.#overlayCanvas.width - shortcutHintForSnapshotWidth) / 2, hudPadding);
    }

    /**
     * @returns {string}
     */
    #getRenderMode() {
        return this.#renderMode === Sandbox.#MODE_CANVAS_2D ? 'Canvas 2D' : 'WebGL2';
    }

    /**
     * @returns {void}
     */
    #downloadMergedSnapshot() {
        if (!this.#simulationCanvas || !this.#overlayCanvas) {
            return;
        }

        const mergeCanvas = document.createElement('canvas');
        mergeCanvas.width = this.#simulationCanvas.width;
        mergeCanvas.height = this.#simulationCanvas.height;
        const mergeCtx = mergeCanvas.getContext('2d');

        if (!mergeCtx) {
            return;
        }

        mergeCtx.drawImage(this.#simulationCanvas, 0, 0);
        mergeCtx.drawImage(this.#overlayCanvas, 0, 0);

        const downloadLink = document.createElement('a');
        downloadLink.download = `gnist-snapshot-${Date.now()}.png`;
        downloadLink.href = mergeCanvas.toDataURL('image/png');

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    /**
     * @returns {void}
     */
    #downloadPerformanceReport() {
        const performanceReport = [
            `Gnist version:           ${Gnist.VERSION}`,
            `User agent:              ${this.#userAgentInfo}`,
            `Render mode:             ${this.#getRenderMode()}`,
            `Particles:               ${this.#gnistEngine.particles.length}`,
            `Sample window:           ${this.#sampleWindow} frames`,
            `Samples:                 ${this.#avgGnistUpdateTimeSamplesMs.length}`,
            `Median avg. update time: ${this.#median(this.#avgGnistUpdateTimeSamplesMs)} ms`,
        ].join('\n');

        const now = new Date();
        const dateTimeString = now.toISOString().replace('T', '_').replace(/\..*/, '');
        const millisString = String(now.getMilliseconds()).padStart(3, '0');
        const filenameSuffix = `${dateTimeString}-${millisString}`.replace(/:/g, '-');

        const blob = new Blob([performanceReport], { type: 'text/plain;charset=utf-8' });
        const downloadLink = document.createElement('a');

        downloadLink.download = `gnist-performance-report-${filenameSuffix}.txt`;
        downloadLink.href = URL.createObjectURL(blob);

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(downloadLink.href);
    }

    /**
     * @param {Array} values
     * @returns {number}
     */
    #median(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);

        return sorted.length % 2 === 0
            ? (sorted[middle - 1] + sorted[middle]) / 2
            : sorted[middle];
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #handleMouseMove(event) {
        if (!this.#mainEmitter || !this.#repulsion || !this.#simulationCanvas) {
            return;
        }

        const bounds = this.#simulationCanvas.getBoundingClientRect();

        this.#mainEmitter.x = event.clientX - bounds.left;
        this.#mainEmitter.y = event.clientY - bounds.top;

        this.#repulsion.x = event.clientX - bounds.left;
        this.#repulsion.y = event.clientY - bounds.top;
    }

    /**
     * @returns {void}
     */
    #handleResize() {
        this.#resizeCanvasToViewport();
        this.#updateGnistCullingBounds();
    }

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    #handleKeyDown(event) {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'h') {
            event.preventDefault();
            this.#displayPerformanceMetricsHud = !this.#displayPerformanceMetricsHud;
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'g') {
            event.preventDefault();
            this.#displayGrid = !this.#displayGrid;
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            this.#takeScreenshotNextFrame = true;
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'r') {
            event.preventDefault();
            this.#getReportNextFrame = true;
        }
    }

    /**
     * @returns {void}
     */
    #resizeCanvasToViewport() {
        if (this.#simulationCanvas) {
            this.#simulationCanvas.width = window.innerWidth;
            this.#simulationCanvas.height = window.innerHeight;
        }

        if (this.#overlayCanvas) {
            this.#overlayCanvas.width = window.innerWidth;
            this.#overlayCanvas.height = window.innerHeight;
        }
    }

    /**
     * @returns {void}
     */
    #updateGnistCullingBounds() {
        if (!this.#gnistEngine || !this.#simulationCanvas || !this.#useCullingBounds) {
            return;
        }

        this.#gnistEngine.cullingBounds = {
            xMin: Sandbox.#CULLING_BOUNDS_MARGIN,
            yMin: Sandbox.#CULLING_BOUNDS_MARGIN,
            xMax: this.#simulationCanvas.width - Sandbox.#CULLING_BOUNDS_MARGIN,
            yMax: this.#simulationCanvas.height - Sandbox.#CULLING_BOUNDS_MARGIN,
        };
    }

    /**
     * @returns {string}
     */
    #getUserAgentInfo() {
        const ua = navigator.userAgent;

        if (ua.includes('OPR/')) {
            return `Opera ${ua.split('OPR/')[1].split('.')[0]}`;
        }

        if (ua.includes('Edg/')) {
            return `Microsoft Edge ${ua.split('Edg/')[1].split('.')[0]}`;
        }

        if (ua.includes('Chrome/')) {
            return `Google Chrome ${ua.split('Chrome/')[1].split('.')[0]}`;
        }

        if (ua.includes('Firefox/')) {
            return `Mozilla Firefox ${ua.split('Firefox/')[1].split('.')[0]}`;
        }

        if (ua.includes('Safari/')) {
            return `Apple Safari ${ua.split('Version/')[1].split(' ')[0]}`;
        }

        return 'Unknown';
    }
}
