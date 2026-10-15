import {
    ColorMode,
    ColorRamp,
    ElasticAnchor,
    EllipseEmitter,
    EmissionSource,
    FlatParticleDataFormat,
    Gnist,
    ImageEmitter,
    LineEmitter,
    LoopMode,
    OpacityFade,
    OrbitalForce,
    PointEmitter,
    RadialForce,
    ScaleTween,
    SineWave,
} from 'gnist';

import {
    Demos,
    RenderModes,
} from './config.js';

const CULLING_BOUNDS_MARGIN = 50;
const PERFORMANCE_HISTORY_MAX_SIZE = 50;
const SAMPLE_WINDOW = 100;
const WARMUP_DURATIONS = 10;

/**
 * @class
 */
export class Sandbox {
    // =========================================================================
    // CORE
    // =========================================================================

    /** @type {Gnist|null} */
    #gnistEngine;

    /** @type {DOMHighResTimeStamp} */
    #previousTime;

    // =========================================================================
    // SIMULATION
    // =========================================================================

    /** @type {object} */
    #selectedDemo;

    /** @type {object} */
    #activeDemoContext;

    /** @type {boolean} */
    #useCullingBounds;

    // =========================================================================
    // RENDERING
    // =========================================================================

    /** @type {string} */
    #renderMode;

    /** @type {boolean} */
    #useGradientBackground;

    /** @type {HTMLDivElement|null} */
    #shortcutsOverlay;

    /** @type {HTMLDivElement|null} */
    #footerOverlay;

    /** @type {HTMLCanvasElement|null} */
    #overlayCanvas;

    /** @type {HTMLCanvasElement|null} */
    #particleCanvas;

    /** @type {DOMRect} */
    #particleCanvasBounds;

    /** @type {CanvasRenderingContext2D|null} */
    #overlayCtx;

    /** @type {WebGL2RenderingContext|null} */
    #webgl2Ctx;

    /** @type {CanvasRenderingContext2D|null} */
    #canvas2dCtx;

    /** {object} */
    #webGlCache;

    /** @type {WebGLProgram|null} */
    #particleGlProgram;

    /** @type {WebGLProgram|null} */
    #backgroundGlProgram;

    /** @type {WebGLBuffer|null} */
    #glBuffer;

    /** @type {WebGLBuffer|null} */
    #glQuadBuffer;

    /** @type {Float32Array|null} */
    #glBufferData;

    // =========================================================================
    // OPERATIONS
    // =========================================================================

    /** @type {boolean} */
    #displayHud;

    /** @type {boolean} */
    #displayHudDefault;

    /** @type {boolean} */
    #displayGrid;

    /** @type {boolean} */
    #takeScreenshotNextFrame;

    /** @type {boolean} */
    #getReportNextFrame;

    // =========================================================================
    // PERFORMANCE METRICS
    // =========================================================================

    /** @type {Array} */
    #avgUpdateTimeSamples;

    /** @type {number} */
    #frameCount;

    /** @type {number} */
    #totalExecutionTimeMs;

    /** @type {number} */
    #avgUpdateTimeMs;

    /** @type {number} */
    #highestAvgUpdateTimeMs;

    /** @type {number} */
    #lowestAvgUpdateTimeMs;

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
     * @param {string} [renderMode='webgl']
     * @param {string} [selectedDemoId='elastic-skull']
     */
    constructor(
        renderMode = RenderModes.WEBGL2,
        selectedDemoId = Demos.ELASTIC_SKULL.id
    ) {
        // Core
        this.#gnistEngine = null;
        this.#previousTime = 0;

        // Simulation
        this.#selectedDemo = Object.values(Demos).find(demo => demo.id === selectedDemoId);
        this.#activeDemoContext = {};
        this.#useCullingBounds = false;

        // Rendering
        this.#renderMode = renderMode;
        this.#useGradientBackground = true;
        this.#shortcutsOverlay = null;
        this.#footerOverlay = null;
        this.#overlayCanvas = null;
        this.#particleCanvas = null;
        this.#particleCanvasBounds = null;
        this.#overlayCtx = null;
        this.#webgl2Ctx = null;
        this.#canvas2dCtx = null;
        this.#webGlCache = {};
        this.#particleGlProgram = null;
        this.#backgroundGlProgram = null;
        this.#glBuffer = null;
        this.#glQuadBuffer = null;
        this.#glBufferData = null;

        // Operations
        this.#displayHud = false;
        this.#displayHudDefault = false;
        this.#displayGrid = false;
        this.#takeScreenshotNextFrame = false;
        this.#getReportNextFrame = false;

        // Performance metrics
        this.#avgUpdateTimeSamples = [];
        this.#frameCount = 0;
        this.#totalExecutionTimeMs = 0;
        this.#avgUpdateTimeMs = 0;
        this.#highestAvgUpdateTimeMs = 0;
        this.#lowestAvgUpdateTimeMs = Infinity;
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
        this.#useCullingBounds = this.#selectedDemo.useCullingBounds;

        this.#initCanvas();

        switch(this.#selectedDemo.id) {
            case Demos.ELASTIC_SKULL.id:
                this.#initElasticSkullDemo();
                break;
            case Demos.FIREWORKS.id:
                this.#initFireworksDemo();
                break;
            case Demos.PORTAL.id:
                this.#initPortalDemo();
                break;
            case Demos.BENCHMARK.id:
                this.#initBenchmarkDemo();
                break;
        }

        if (this.#renderMode === RenderModes.WEBGL2) {
            this.#initWebGL();
        }

        this.#updateGnistCullingBounds();

        this.#particleCanvas.addEventListener('mousemove', (event) => this.#handleMouseMove(event));

        window.addEventListener('resize', () => this.#handleResize());
        window.addEventListener('keydown', (event) => this.#handleKeyDown(event));
    }

    /**
     * @returns {void}
     * @throws {Error}
     */
    #initCanvas() {
        this.#shortcutsOverlay = document.getElementById('shortcuts-overlay');
        this.#footerOverlay = document.getElementById('footer-overlay');

        this.#overlayCanvas = document.getElementById('overlay-canvas');
        this.#particleCanvas = document.getElementById('particle-canvas');

        this.#overlayCtx = this.#getContext(this.#overlayCanvas, '2d');

        switch (this.#renderMode) {
            case RenderModes.WEBGL2:
                this.#webgl2Ctx = this.#getContext(this.#particleCanvas, 'webgl2', {
                    alpha: false,
                    premultipliedAlpha: false,
                });
                break;
            case RenderModes.CANVAS_2D:
                this.#canvas2dCtx = this.#getContext(this.#particleCanvas, '2d');
                break;
            default:
                throw new Error(`Unsupported render mode: ${this.#renderMode}`);
        }

        this.#resizeCanvases();
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

        const particleVertexShaderSource = `#version 300 es
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

        const particleFragmentShaderSource = `#version 300 es
            precision highp float;

            in vec3 v_color;
            in float v_opacity;
            in vec2 v_texCoord;

            out vec4 outColor;

            void main() {
                outColor = vec4(v_color, v_opacity);
            }
        `;

        const backgroundVertexShaderSource = `#version 300 es
            in vec2 a_quadVertex;
        
            out vec2 v_uv;
        
            void main() {
                v_uv = a_quadVertex + 0.5;
                gl_Position = vec4(a_quadVertex * 2.0, 0.0, 1.0);
            }
        `;

        const backgroundFragmentShaderSource = `#version 300 es
            precision highp float;
        
            in vec2 v_uv;
        
            out vec4 outColor;
        
            void main() {
                float distance = length(v_uv - vec2(0.5, 0.25));
                float t = smoothstep(0.0, 1.0, distance);
        
                vec3 center = vec3(0.1176, 0.1412, 0.1961); // #1e2432
                vec3 edge = vec3(0.0353, 0.0392, 0.0549);   // #090a0e
        
                vec3 color = mix(center, edge, t);
        
                float noise = fract(sin(dot(v_uv, vec2(12.9898, 78.233))) * 43758.5453);
                color += (noise - 0.5) / 255.0;
        
                outColor = vec4(color, 1.0);
            }
        `;

        const particleVertexShader = this.#createShader(gl, gl.VERTEX_SHADER, particleVertexShaderSource);
        const particleFragmentShader = this.#createShader(gl, gl.FRAGMENT_SHADER, particleFragmentShaderSource);

        this.#particleGlProgram = gl.createProgram();

        gl.attachShader(this.#particleGlProgram, particleVertexShader);
        gl.attachShader(this.#particleGlProgram, particleFragmentShader);
        gl.linkProgram(this.#particleGlProgram);

        if (!gl.getProgramParameter(this.#particleGlProgram, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.#particleGlProgram));
            return;
        }

        const backgroundVertexShader = this.#createShader(gl, gl.VERTEX_SHADER, backgroundVertexShaderSource);
        const backgroundFragmentShader = this.#createShader(gl, gl.FRAGMENT_SHADER, backgroundFragmentShaderSource);

        this.#backgroundGlProgram = gl.createProgram();

        gl.attachShader(this.#backgroundGlProgram, backgroundVertexShader);
        gl.attachShader(this.#backgroundGlProgram, backgroundFragmentShader);
        gl.linkProgram(this.#backgroundGlProgram);

        if (!gl.getProgramParameter(this.#backgroundGlProgram, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(this.#backgroundGlProgram));
            return;
        }

        this.#webGlCache = {
            bgQuadVertexLocation: gl.getAttribLocation(this.#backgroundGlProgram, 'a_quadVertex'),
            particleQuadVertexLocation: gl.getAttribLocation(this.#particleGlProgram, 'a_quadVertex'),
            particlePositionLocation: gl.getAttribLocation(this.#particleGlProgram, 'a_position'),
            particleSizeLocation: gl.getAttribLocation(this.#particleGlProgram, 'a_size'),
            particleRotationLocation: gl.getAttribLocation(this.#particleGlProgram, 'a_rotation'),
            particleColorLocation: gl.getAttribLocation(this.#particleGlProgram, 'a_color'),
            particleOpacityLocation: gl.getAttribLocation(this.#particleGlProgram, 'a_opacity'),
            particleResolutionUniformLocation: gl.getUniformLocation(this.#particleGlProgram, 'u_resolution'),
        };

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

        this.#glBufferData = new Float32Array(this.#selectedDemo.particleCountLimit * FlatParticleDataFormat.FLOATS_PER_PARTICLE);
    }

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {number} type
     * @param {string} source
     * @returns {WebGLShader|null}
     */
    #createShader(gl, type, source) {
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

    /**
     * @returns {void}
     */
    #initElasticSkullDemo() {
        const skullImage = new Image();

        skullImage.src = new URL('./assets/skull.png', import.meta.url).href;

        skullImage.onload = () => {
            const skullWidth = 600;
            const skullHeight = 600;

            const skullEmitter = new ImageEmitter({
                x: this.#particleCanvas.width / 2 - skullWidth / 2,
                y: this.#particleCanvas.height / 2 - skullHeight / 2,
                width: skullWidth,
                height: skullHeight,
                imageData: this.#getImageData(skullImage),
                colorMode: ColorMode.IMAGE,
                particlesPerSecond: 20000,
                duration: 1,
                particleBlueprint: {
                    persistent: true,
                    size: 3,
                    lifespan: 2,
                    loopMode: LoopMode.OSCILLATE,
                    speed: 0,
                    direction: [0, Math.PI * 2],
                }
            });

            const wave = new SineWave({
                amplitude: 5,
                frequency: 0.5,
            });

            const anchor = new ElasticAnchor({
                damping: 0.9,
            });

            const repulsionForce = new RadialForce({
                x: -100,
                y: -100,
                strength: -50000,
            });

            skullEmitter.addModifier(wave);
            skullEmitter.addModifier(anchor);
            skullEmitter.addScopedForce(repulsionForce);

            this.#gnistEngine.addEmitter(skullEmitter);

            this.#activeDemoContext = {
                repulsionForce,
            };
        };
    }

    /**
     * @returns {void}
     */
    #initFireworksDemo() {
        const fadeOut = new OpacityFade({
            startOpacity: 1.0,
            endOpacity: 0.0,
        });

        const gnistColorRamp = new ColorRamp({
            colors: [
                [0, 242, 254],
                [143, 0, 255],
                [255, 0, 127],
                [255, 102, 0],
            ],
        });

        const acidColorRamp = new ColorRamp({
            colors: [
                [180, 255, 0],
                [57, 255, 20],
                [0, 255, 170],
                [220, 255, 0],
            ],
        });

        const goldColorRamp = new ColorRamp({
            colors: [
                [255, 40, 0],
                [255, 140, 0],
                [255, 220, 0],
                [255, 255, 190],
            ],
        });

        const colorModifiers = [
            gnistColorRamp,
            acidColorRamp,
            goldColorRamp,
        ];

        const wobble = new SineWave({
            amplitude: 2,
            frequency: 2,
        });

        const sparkEmitter = new PointEmitter({
            enabled: false,
            particleBlueprint: {
                size: 1,
                lifespan: 1,
                speed: [10, 20],
                direction: [0, Math.PI * 2],
            }
        });

        const burstEmitter = new PointEmitter({
            enabled: false,
            particleBlueprint: {
                size: [1, 3],
                lifespan: [1, 2],
                speed: [50, 150],
                direction: [0, Math.PI * 2],
            }
        });

        const rocketEmitter = new PointEmitter({
            x: this.#particleCanvas.width / 2,
            y: this.#particleCanvas.height - this.#particleCanvas.height / 6,
            particlesPerSecond: 3,
            particleBlueprint: {
                interval: 0.01,
                onInterval: (particle) => {
                    sparkEmitter.emit(1, { x: particle.x, y: particle.y });
                },
                onDeath: (particle) => {
                    colorModifiers.forEach(modifier => burstEmitter.removeModifier(modifier.id));
                    burstEmitter.addModifier(colorModifiers[Math.floor(Math.random() * colorModifiers.length)]);
                    burstEmitter.emit(50, { x: particle.x, y: particle.y });
                },
                size: 3,
                lifespan: [1, 2],
                speed: [250, 300],
                direction: [Math.PI * 1.25, Math.PI * 1.75],
            }
        });

        sparkEmitter.addModifier(fadeOut);

        burstEmitter.addModifier(fadeOut);
        burstEmitter.addModifier(gnistColorRamp);

        rocketEmitter.addModifier(fadeOut);
        rocketEmitter.addModifier(wobble);

        this.#gnistEngine.addEmitter(sparkEmitter);
        this.#gnistEngine.addEmitter(burstEmitter);
        this.#gnistEngine.addEmitter(rocketEmitter);

        this.#activeDemoContext = {
            rocketEmitter,
        };
    }

    /**
     * @returns {void}
     */
    #initPortalDemo() {
        const centerX = this.#particleCanvas.width / 2;
        const centerY = this.#particleCanvas.height / 2;

        const portalEmitter = new EllipseEmitter({
            x: centerX,
            y: centerY,
            radiusX: 200,
            radiusY: 250,
            particlesPerSecond: 1000,
            emissionSource: EmissionSource.EDGE_IN,
            particleBlueprint: {
                size: [1, 3],
                lifespan: [1, 3],
                speed: [15, 30],
                direction: [0, Math.PI * 2],
            }
        });

        const portalEdgeEmitter = new EllipseEmitter({
            x: centerX,
            y: centerY,
            radiusX: 200,
            radiusY: 250,
            particlesPerSecond: 3000,
            emissionSource: EmissionSource.EDGE_IN,
            particleBlueprint: {
                size: [1, 3],
                lifespan: [1, 4],
                speed: [15, 30],
                direction: [0, Math.PI * 2],
            }
        });

        const orbit = new OrbitalForce({
            x: centerX,
            y: centerY,
            tangentialSpeed: 100,
            radialSpeed: -75,
            radius: 250,
        });

        const fadeOut = new OpacityFade({
            startOpacity: 1.0,
            endOpacity: 0.0,
        });

        const gnistColorRamp = new ColorRamp({
            colors: [
                [0, 242, 254],
                [143, 0, 255],
                [255, 0, 127],
                [255, 102, 0],
            ],
        });

        const wave = new SineWave({
            amplitude: 3,
            frequency: 1.5,
        });

        portalEmitter.addScopedForce(orbit);
        portalEmitter.addModifier(fadeOut);
        portalEmitter.addModifier(gnistColorRamp);

        portalEdgeEmitter.addModifier(fadeOut);
        portalEdgeEmitter.addModifier(gnistColorRamp);
        portalEdgeEmitter.addModifier(wave);

        this.#gnistEngine.addEmitter(portalEmitter);
        this.#gnistEngine.addEmitter(portalEdgeEmitter);

        this.#activeDemoContext = {
            portalEmitter,
            portalEdgeEmitter,
            orbit,
        };
    }

    /**
     * param {string}
     * param {boolean}
     * @returns {void}
     */
    #initBenchmarkDemo(preset = 'preset_1000', applyModifiers = false) {
        const presets = {
            preset_1000:   [1000,   1.0, 200],
            preset_10000:  [5000,   2.0, 150],
            preset_50000:  [10000,  5.0, 120],
            preset_100000: [20000,  5.0, 180],
            preset_500000: [100000, 5.0, 200],
        };

        const [particlesPerSecond, lifespan, speed] = presets[preset];

        const lineEmitter = new LineEmitter({
            x1: 50,
            y1: 50,
            x2: this.#particleCanvas.width - 50,
            y2: 50,
            particlesPerSecond: particlesPerSecond,
            emissionSource: EmissionSource.EDGE_OUT,
            particleBlueprint: {
                size: 1,
                lifespan: lifespan,
                speed: speed,
            }
        });

        if (applyModifiers) {
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
        }

        this.#gnistEngine.addEmitter(lineEmitter);
    }

    /**
     * @param {HTMLImageElement} image
     * @returns {ImageData}
     */
    #getImageData(image) {
        const canvas = document.createElement('canvas');

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        const context = canvas.getContext('2d');

        context.drawImage(image, 0, 0);

        return {
            width: canvas.width,
            height: canvas.height,
            data: context.getImageData(0, 0, canvas.width, canvas.height).data,
        };
    }

    /**
     * @param {MouseEvent} event
     * @returns {void}
     */
    #handleMouseMove(event) {
        if (!this.#particleCanvas || !this.#particleCanvasBounds) {
            return;
        }

        const activeDemo = this.#activeDemoContext;

        if (activeDemo.repulsionForce) {
            activeDemo.repulsionForce.x = event.clientX - this.#particleCanvasBounds.left;
            activeDemo.repulsionForce.y = event.clientY - this.#particleCanvasBounds.top;
        }
    }

    /**
     * @returns {void}
     */
    #handleResize() {
        this.#resizeCanvases();
        this.#updateGnistCullingBounds();

        const activeDemo = this.#activeDemoContext;

        if (activeDemo.rocketEmitter) {
            activeDemo.rocketEmitter.x = this.#particleCanvas.width / 2;
            activeDemo.rocketEmitter.y = this.#particleCanvas.height - this.#particleCanvas.height / 6;
        }

        if (activeDemo.portalEmitter && activeDemo.portalEdgeEmitter && activeDemo.orbit) {
            const centerX = this.#particleCanvas.width / 2;
            const centerY = this.#particleCanvas.height / 2;

            activeDemo.portalEmitter.x = centerX;
            activeDemo.portalEmitter.y = centerY;
            activeDemo.portalEdgeEmitter.x = centerX;
            activeDemo.portalEdgeEmitter.y = centerY;
            activeDemo.orbit.x = centerX;
            activeDemo.orbit.y = centerY;
        }
    }

    /**
     * @param {KeyboardEvent} event
     * @returns {void}
     */
    #handleKeyDown(event) {
        if ((event.shiftKey || event.metaKey) && event.key.toLowerCase() === 'h') {
            event.preventDefault();
            if (!this.#displayGrid) {
                this.#displayHud = !this.#displayHud;
                this.#displayHudDefault = this.#displayHud;
            }
        }

        if ((event.shiftKey || event.metaKey) && event.key.toLowerCase() === 'g') {
            event.preventDefault();
            this.#shortcutsOverlay.classList.toggle('hidden');
            this.#footerOverlay.classList.toggle('hidden');
            this.#displayGrid = !this.#displayGrid;
            this.#displayHud = this.#displayHudDefault && !this.#displayGrid;
        }

        if ((event.shiftKey || event.metaKey) && event.key.toLowerCase() === 'b') {
            event.preventDefault();
            this.#useGradientBackground = !this.#useGradientBackground;
        }

        if ((event.shiftKey || event.metaKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            this.#takeScreenshotNextFrame = true;
        }

        if ((event.shiftKey || event.metaKey) && event.key.toLowerCase() === 'r') {
            event.preventDefault();
            this.#getReportNextFrame = true;
        }
    }

    /**
     * @returns {void}
     */
    #resizeCanvases() {
        for (const canvas of [this.#particleCanvas, this.#overlayCanvas]) {
            if (!canvas) {
                continue;
            }

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        this.#particleCanvasBounds = this.#particleCanvas.getBoundingClientRect();
    }

    /**
     * @returns {void}
     */
    #updateGnistCullingBounds() {
        if (!this.#gnistEngine || !this.#particleCanvas || !this.#useCullingBounds) {
            return;
        }

        this.#gnistEngine.cullingBounds = {
            xMin: CULLING_BOUNDS_MARGIN,
            yMin: CULLING_BOUNDS_MARGIN,
            xMax: this.#particleCanvas.width - CULLING_BOUNDS_MARGIN,
            yMax: this.#particleCanvas.height - CULLING_BOUNDS_MARGIN,
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

        this.#updatePerformanceMetrics(start, end, dt, safeDt);

        this.#render();

        if (this.#takeScreenshotNextFrame) {
            this.#takeScreenshotNextFrame = false;
            this.#downloadSnapshot();
        }

        if (this.#getReportNextFrame) {
            this.#getReportNextFrame = false;
            this.#downloadPerformanceReport();
        }

        requestAnimationFrame((time) => this.#loop(time));
    }

    /**
     * @param {DOMHighResTimeStamp} start
     * @param {DOMHighResTimeStamp} end
     * @param {number} dt
     * @param {number} safeDt
     */
    #updatePerformanceMetrics(start, end, dt, safeDt) {
        this.#totalExecutionTimeMs += (end - start);
        this.#totalFrameTimeS += dt;
        this.#frameCount++;
        this.#totalSimulationTimeS += safeDt;

        if (this.#frameCount >= SAMPLE_WINDOW) {
            this.#avgUpdateTimeMs = this.#totalExecutionTimeMs / SAMPLE_WINDOW;

            if (Math.floor(this.#totalSimulationTimeS) > WARMUP_DURATIONS) {
                this.#avgUpdateTimeSamples.push(this.#avgUpdateTimeMs);

                if (this.#avgUpdateTimeSamples.length > PERFORMANCE_HISTORY_MAX_SIZE) {
                    this.#avgUpdateTimeSamples.shift();
                }
            }

            this.#highestAvgUpdateTimeMs = Math.max(this.#highestAvgUpdateTimeMs, this.#avgUpdateTimeMs);

            if (   this.#totalSimulationTimeS > WARMUP_DURATIONS
                && this.#lowestAvgUpdateTimeMs > 0
                && this.#avgUpdateTimeMs > 0
            ) {
                this.#lowestAvgUpdateTimeMs = Math.min(this.#lowestAvgUpdateTimeMs, this.#avgUpdateTimeMs);
            }

            this.#fps = Math.round(SAMPLE_WINDOW / this.#totalFrameTimeS);
            this.#totalExecutionTimeMs = 0;
            this.#totalFrameTimeS = 0;
            this.#frameCount = 0;
        }
    }

    /**
     * @returns {void}
     */
    #render() {
        const particles = this.#gnistEngine.particles;
        const particleCount = particles.length;
        const width = this.#particleCanvas.width;
        const height = this.#particleCanvas.height;

        switch (this.#renderMode) {
            case RenderModes.WEBGL2:
                this.#renderWebGL(particles, particleCount, width, height);
                break;
            case RenderModes.CANVAS_2D:
                this.#renderCanvas2D(particles, particleCount, width, height);
                break;
        }

        this.#overlayCtx.clearRect(0, 0, this.#overlayCanvas.width, this.#overlayCanvas.height);

        this.#renderHud(particleCount);
        this.#renderGrid();
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

        if (!gl || !this.#particleGlProgram || !this.#backgroundGlProgram || !this.#glBufferData) {
            return;
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.viewport(0, 0, width, height);
        gl.clearColor(0.0784, 0.0784, 0.0980, 1.0); // #141419
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (this.#useGradientBackground) {
            gl.useProgram(this.#backgroundGlProgram);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.#glQuadBuffer);

            const backgroundQuadVertLoc = this.#webGlCache.bgQuadVertexLocation;

            gl.enableVertexAttribArray(backgroundQuadVertLoc);
            gl.vertexAttribPointer(
                backgroundQuadVertLoc,
                2,
                gl.FLOAT,
                false,
                0,
                0
            );

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        if (particleCount === 0) {
            return;
        }

        gl.useProgram(this.#particleGlProgram);

        const resolutionUniformLocation = this.#webGlCache.particleResolutionUniformLocation;
        gl.uniform2f(resolutionUniformLocation, width, height);

        const activeCount = this.#gnistEngine.fillFlatArray(this.#glBufferData);

        if (activeCount === 0) {
            return;
        }

        // Bind the standard quad vertices (vertex attributes)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#glQuadBuffer);
        const quadVertLoc = this.#webGlCache.particleQuadVertexLocation;
        gl.enableVertexAttribArray(quadVertLoc);
        gl.vertexAttribPointer(quadVertLoc, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(quadVertLoc, 0);

        // Bind dynamic particle data (instance attributes)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#glBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.#glBufferData.subarray(0, activeCount * FlatParticleDataFormat.FLOATS_PER_PARTICLE), gl.DYNAMIC_DRAW);

        // Stride is permanently 32 bytes (8 floats * 4 bytes per float)
        const stride = FlatParticleDataFormat.FLOATS_PER_PARTICLE * Float32Array.BYTES_PER_ELEMENT;

        // Position (Offset: 0)
        const posLoc = this.#webGlCache.particlePositionLocation;
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, stride, 0);
        gl.vertexAttribDivisor(posLoc, 1);

        // Size (Offset: 2 floats * 4 bytes = 8)
        const sizeLoc = this.#webGlCache.particleSizeLocation;
        gl.enableVertexAttribArray(sizeLoc);
        gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride, 8);
        gl.vertexAttribDivisor(sizeLoc, 1);

        // Rotation (Offset: 3 floats * 4 bytes = 12)
        const rotationLoc = this.#webGlCache.particleRotationLocation;
        gl.enableVertexAttribArray(rotationLoc);
        gl.vertexAttribPointer(rotationLoc, 1, gl.FLOAT, false, stride, 12);
        gl.vertexAttribDivisor(rotationLoc, 1);

        // Color (Offset: 4 floats * 4 bytes = 16)
        const colorLoc = this.#webGlCache.particleColorLocation;
        gl.enableVertexAttribArray(colorLoc);
        gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, stride, 16);
        gl.vertexAttribDivisor(colorLoc, 1);

        // Opacity (Offset: 7 floats * 4 bytes = 28)
        const opacityLoc = this.#webGlCache.particleOpacityLocation;
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
        if (this.#useGradientBackground) {
            const gradient = this.#canvas2dCtx.createRadialGradient(
                width / 2,
                height / 4,
                0,
                width / 2,
                height / 4,
                Math.max(width, height)
            );

            gradient.addColorStop(0, '#1e2432');
            gradient.addColorStop(1, '#090a0e');

            this.#canvas2dCtx.fillStyle = gradient;
        } else {
            this.#canvas2dCtx.fillStyle = '#141419';
        }

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
     * @param {number} particleCount
     * @returns {void}
     */
    #renderHud(particleCount) {
        if (!this.#overlayCanvas || !this.#overlayCtx || !this.#displayHud) {
            return;
        }

        this.#overlayCtx.globalAlpha = 0.8;
        this.#overlayCtx.fillStyle = '#9AA0A6';
        this.#overlayCtx.font = '15px monospace';
        this.#overlayCtx.textAlign = 'left';
        this.#overlayCtx.textBaseline = 'middle';

        const rowHeight = 22;
        const marginLeft = 16;
        const marginTop = 80;

        const renderMode = this.#getRenderMode();

        const lowestAvgUpdateTimeMs = this.#lowestAvgUpdateTimeMs !== Infinity
            ? this.#lowestAvgUpdateTimeMs.toFixed(4) + ' ms'
            : '-';

        const rows = [
            `Gnist version:    ${Gnist.VERSION}`,
            `User agent:       ${this.#userAgentInfo}`,
            '',
            'Simulation:',
            `  Elapsed time:   ${Math.floor(this.#totalSimulationTimeS)} s`,
            `  Particles:      ${particleCount}`,
            '',
            'Measurement:',
            `  Warm-up:        ${WARMUP_DURATIONS} s`,
            `  Sample window:  ${SAMPLE_WINDOW} frames`,
            `  Samples:        ${this.#avgUpdateTimeSamples.length}`,
            '',
            'Performance:',
            `  Avg. update:    ${this.#avgUpdateTimeMs.toFixed(4)} ms`,
            `  Highest avg.:   ${this.#highestAvgUpdateTimeMs.toFixed(4)} ms`,
            `  Lowest avg.:    ${lowestAvgUpdateTimeMs}`,
            '',
            'Rendering:',
            `  Mode:           ${renderMode}`,
            `  FPS:            ${this.#fps}`,
        ];

        this.#overlayCtx.fillText(this.#selectedDemo.name, marginLeft, marginTop);

        this.#overlayCtx.globalAlpha = 0.6;
        this.#overlayCtx.font = '12px monospace';

        this.#overlayCtx.fillText(this.#selectedDemo.features.join(' · '), marginLeft, marginTop + rowHeight);

        this.#overlayCtx.globalAlpha = 0.8;
        this.#overlayCtx.font = '15px monospace';

        for (let i = 0; i < rows.length; i++) {
            this.#overlayCtx.fillText(rows[i], marginLeft, marginTop + rowHeight * 3 + rowHeight * i);
        }

        this.#overlayCtx.globalAlpha = 1.0;
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
        this.#overlayCtx.globalAlpha = 0.8;

        for (let x = 0; x <= this.#overlayCanvas.width; x += cellWidth) {
            this.#overlayCtx.beginPath();
            this.#overlayCtx.moveTo(x, 0);
            this.#overlayCtx.lineTo(x, this.#overlayCanvas.height);
            this.#overlayCtx.stroke();

            if (showCoordinates) {
                for (let y = 0; y <= this.#overlayCanvas.height; y += cellHeight) {
                    this.#overlayCtx.fillText(`${x}, ${y}`, x + 4, y + 14);
                }
            }
        }

        for (let y = 0; y <= this.#overlayCanvas.height; y += cellHeight) {
            this.#overlayCtx.beginPath();
            this.#overlayCtx.moveTo(0, y);
            this.#overlayCtx.lineTo(this.#overlayCanvas.width, y);
            this.#overlayCtx.stroke();
        }

        this.#overlayCtx.globalAlpha = 1.0;
    }

    /**
     * @returns {void}
     */
    #downloadSnapshot() {
        const dataUrl = this.#createCompositeSnapshot();

        if (!dataUrl) {
            return;
        }

        const downloadLink = document.createElement('a');

        downloadLink.download = `gnist-snapshot-${Date.now()}.png`;
        downloadLink.href = dataUrl;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    /**
     * @returns {string|null}
     */
    #createCompositeSnapshot() {
        if (!this.#particleCanvas || !this.#overlayCanvas) {
            return null;
        }

        const compositeCanvas = document.createElement('canvas');

        compositeCanvas.width = this.#particleCanvas.width;
        compositeCanvas.height = this.#particleCanvas.height;

        const compositeCtx = compositeCanvas.getContext('2d');

        if (!compositeCtx) {
            return null;
        }

        compositeCtx.drawImage(this.#particleCanvas, 0, 0);
        compositeCtx.drawImage(this.#overlayCanvas, 0, 0);

        return compositeCanvas.toDataURL('image/png');
    }

    /**
     * @returns {void}
     */
    #downloadPerformanceReport() {
        const report = this.#createPerformanceReport();

        const now = new Date();
        const dateTimeString = now.toISOString().replace('T', '_').replace(/\..*/, '');
        const millisString = String(now.getMilliseconds()).padStart(3, '0');
        const filenameSuffix = `${dateTimeString}-${millisString}`.replace(/:/g, '-');

        const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
        const downloadLink = document.createElement('a');

        downloadLink.download = `gnist-performance-report-${filenameSuffix}.txt`;
        downloadLink.href = URL.createObjectURL(blob);

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(downloadLink.href);
    }

    /**
     * @returns {string}
     */
    #createPerformanceReport() {
        const medianOfAvgUpdateTimes = this.#median(this.#avgUpdateTimeSamples);
        const formattedMedianUpdateTime = Number.isNaN(medianOfAvgUpdateTimes)
            ? '-'
            : `${medianOfAvgUpdateTimes.toFixed(4)} ms`;

        const rows = [
            'Gnist Performance Report',
            '========================',
            '',
            `Gnist version:                   ${Gnist.VERSION}`,
            `User agent:                      ${this.#userAgentInfo}`,
            `Render mode:                     ${this.#getRenderMode()}`,
            `Particle count:                  ${this.#gnistEngine.particles.length}`,
            `Sample window:                   ${SAMPLE_WINDOW} frames`,
            `Number of samples:               ${this.#avgUpdateTimeSamples.length}`,
            `Median of average update times:  ${formattedMedianUpdateTime}`,
            '',
            'Note: Update times cover Gnist\'s simulation only; rendering time is excluded.',
        ];

        return rows.join('\n');
    }

    /**
     * @param {Array} values
     * @returns {number}
     */
    #median(values) {
        if (values.length === 0) {
            return NaN;
        }

        const sorted = [...values].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);

        return sorted.length % 2 === 0
            ? (sorted[middle - 1] + sorted[middle]) / 2
            : sorted[middle];
    }

    /**
     * @returns {string}
     */
    #getRenderMode() {
        return this.#renderMode === RenderModes.WEBGL2 ? 'WebGL2' : 'Canvas 2D';
    }
}
