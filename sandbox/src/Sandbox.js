import {
    Gnist,
    PointEmitter,
    DirectionalForce,
    LinearDrag,
    ScaleTween,
    ColorRamp,
    OpacityFade,
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

    /** @type {Gnist|null} */
    #gnistEngine;

    /** @type {DOMHighResTimeStamp} */
    #previousTime;

    /** @type {PointEmitter|null} */
    #pointEmitter;

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
    #canvas2dCtx;

    /** @type {WebGL2RenderingContext|null} */
    #webgl2Ctx;

    /** @type {CanvasRenderingContext2D|null} */
    #overlayCtx;

    /** @type {Float32Array|null} */
    #glBufferData;

    /** @type {WebGLProgram|null} */
    #glProgram;

    /** @type {WebGLBuffer|null} */
    #glBuffer;

    /** @type {WebGLBuffer|null} */
    #glQuadBuffer;

    /** @type {boolean} */
    #takeScreenshotNextFrame;

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
     * @param {string} [mode='canvas']
     */
    constructor(mode = Sandbox.#MODE_CANVAS_2D) {
        this.#gnistEngine = null;
        this.#pointEmitter = null;
        this.#previousTime = 0;

        this.#renderMode = mode;
        this.#simulationCanvas = null;
        this.#overlayCanvas = null;
        this.#canvas2dCtx = null;
        this.#overlayCtx = null;
        this.#webgl2Ctx = null;
        this.#glBufferData = null;
        this.#glProgram = null;
        this.#glBuffer = null;
        this.#glQuadBuffer = null;
        this.#takeScreenshotNextFrame = false;

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
        this.#gnistEngine = new Gnist();
        this.#userAgentInfo = this.#getUserAgentInfo();

        this.#initCanvas();
        this.#initSimulation();
        this.#updateGnistCullingBounds();

        this.#simulationCanvas.addEventListener('mousemove', (event) => this.#handleMouseMove(event));
        window.addEventListener('resize', () => this.#handleResize());
        window.addEventListener('keydown', (event) => this.#handleKeyDown(event));
    }

    /**
     * @returns {void}
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

                this.#initWebGL();

                break;
            default:
                throw new Error(`Unsupported render mode: ${this.#renderMode}`);
        }

        this.#resizeCanvasToViewport();
    }

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {'2d'|'webgl2'} type
     * @param {object} [options]
     * @returns {CanvasRenderingContext2D|WebGL2RenderingContext}
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

        this.#glBufferData = new Float32Array(50000 * 8);
    }

    /**
     * @returns {void}
     */
    #initSimulation() {
        const gravity = new DirectionalForce({ax:0, ay: 200});
        const friction = new LinearDrag({drag: 0.4});

        const enlarge = new ScaleTween({
            startScale: 1,
            endScale: 5,
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

        this.#pointEmitter = new PointEmitter({
            x: this.#simulationCanvas.width / 2,
            y: this.#simulationCanvas.height / 2,
            particlesPerSecond: 500,
            particleBlueprint: {
                size: [1, 5],
                lifespan: [1, 3],
                speed: [15, 150],
                direction: [0, Math.PI * 2],
            }
        });

        this.#pointEmitter.addModifier(enlarge);
        this.#pointEmitter.addModifier(fadeOut);
        this.#pointEmitter.addModifier(gnistColorRamp);

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

        if (this.#takeScreenshotNextFrame) {
            this.#takeScreenshotNextFrame = false;
            this.#downloadMergedSnapshot();
        }

        requestAnimationFrame((time) => this.#loop(time));
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

        this.#renderPerformanceMetricsHud(particleCount);
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
        this.#canvas2dCtx.fillStyle = '#222';
        this.#canvas2dCtx.fillRect(0, 0, width, height);

        for (let i = 0; i < particleCount; i++) {
            const particle = particles[i];
            const { r, g, b } = particle.color;
            const a = particle.opacity;

            this.#canvas2dCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            const size = particle.size ?? 2;

            const halfSize = size / 2;
            const drawX = particle.x - halfSize;
            const drawY = particle.y - halfSize;

            this.#canvas2dCtx.fillRect(drawX, drawY, size, size);
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
        gl.clearColor(0.133, 0.133, 0.133, 1.0); // #222 in normalized RGB
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

        const floatsPerParticle = 8;
        const totalFloatsWritten = activeCount * floatsPerParticle;

        // Bind the standard quad vertices (vertex attributes)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#glQuadBuffer);
        const quadVertLoc = gl.getAttribLocation(this.#glProgram, 'a_quadVertex');
        gl.enableVertexAttribArray(quadVertLoc);
        gl.vertexAttribPointer(quadVertLoc, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(quadVertLoc, 0);

        // Bind dynamic particle data (instance attributes)
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#glBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.#glBufferData.subarray(0, totalFloatsWritten), gl.DYNAMIC_DRAW);

        // Stride is permanently 32 bytes (8 floats * 4 bytes per float)
        const stride = 32;

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
        if (!this.#overlayCtx) {
            return;
        }

        this.#overlayCtx.clearRect(0, 0, this.#overlayCanvas.width, this.#overlayCanvas.height);

        this.#overlayCtx.fillStyle = '#CCC';
        this.#overlayCtx.strokeStyle = this.#overlayCtx.fillStyle;
        this.#overlayCtx.lineWidth = 1;
        this.#overlayCtx.font = '14px monospace';
        this.#overlayCtx.textAlign = 'left';
        this.#overlayCtx.textBaseline = 'top';

        const hudRowHeight = 20;
        const hudPadding = Sandbox.#CULLING_BOUNDS_MARGIN + 20;
        const renderMode = this.#renderMode === Sandbox.#MODE_CANVAS_2D ? 'Canvas 2D' : 'WebGL2';

        const performanceMetricsHudRows = [
            `Gnist version:  ${Gnist.VERSION}`,
            `Render mode:    ${renderMode}`,
            `User agent:     ${this.#userAgentInfo}`,
            '',
            `Particles:      ${particleCount}`,
            '',
            'Simulation:',
            `  Avg. update:  ${this.#avgGnistUpdateTimeMs.toFixed(3)} ms`,
            `  Peak avg.:    ${this.#peakAvgGnistUpdateTimeMs.toFixed(3)} ms`,
            '',
            'Rendering:',
            `  FPS:          ${this.#fps}`,
        ];

        for (let i = 0; i < performanceMetricsHudRows.length; i++) {
            this.#overlayCtx.fillText(performanceMetricsHudRows[i], hudPadding, hudPadding + hudRowHeight + hudRowHeight * i);
        }

        const shortcutHint = 'Press [CTRL] + [S] to take a snapshot.';
        const shortcutHintWidth = this.#overlayCtx.measureText(shortcutHint).width;
        this.#overlayCtx.fillText(shortcutHint, (this.#overlayCanvas.width - shortcutHintWidth) / 2, hudPadding);

        if (this.#gnistEngine.cullingBounds !== null) {
            this.#overlayCtx.strokeRect(
                this.#gnistEngine.cullingBounds.xMin,
                this.#gnistEngine.cullingBounds.yMin,
                this.#gnistEngine.cullingBounds.xMax - this.#gnistEngine.cullingBounds.xMin,
                this.#gnistEngine.cullingBounds.yMax - this.#gnistEngine.cullingBounds.yMin,
            );
        }
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
     * @param {MouseEvent} event
     * @returns {void}
     */
    #handleMouseMove(event) {
        if (!this.#pointEmitter || !this.#simulationCanvas) {
            return;
        }

        const bounds = this.#simulationCanvas.getBoundingClientRect();

        this.#pointEmitter.x = event.clientX - bounds.left;
        this.#pointEmitter.y = event.clientY - bounds.top;
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
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
            event.preventDefault();
            this.#takeScreenshotNextFrame = true;
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
        if (!this.#gnistEngine || !this.#simulationCanvas) {
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
