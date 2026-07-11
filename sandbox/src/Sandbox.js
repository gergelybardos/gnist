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
        return 'canvas2d';
    }

    /** @type {string} */
    static get #MODE_WEBGL() {
        return 'webgl';
    }

    /** @type {number} */
    static get #CULLING_BOUNDS_MARGIN() {
        return 50;
    }

    // =========================================================================
    // Basics
    // =========================================================================

    /** @type {Gnist|null} */
    #gnistEngine;

    /** @type {PointEmitter|null} */
    #pointEmitter;

    /** @type {DOMHighResTimeStamp} */
    #previousTime;

    // =========================================================================
    // RENDERING
    // =========================================================================

    /** @type {string} */
    #renderMode;

    /** @type {HTMLCanvasElement|null} */
    #canvas;

    /** @type {HTMLCanvasElement|null} */
    #hudCanvas;

    /** @type {CanvasRenderingContext2D|null} */
    #ctx;

    /** @type {CanvasRenderingContext2D|null} */
    #hudCtx;

    /** @type {WebGL2RenderingContext|null} */
    #gl;

    /** @type {Float32Array|null} */
    #webglBufferData;

    /** @type {WebGLProgram|null} */
    #glProgram;

    /** @type {WebGLBuffer|null} */
    #glBuffer;

    // Add this right here:
    /** @type {WebGLBuffer|null} */
    #quadBuffer;

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
     * @param {string} [mode='canvas2d']
     */
    constructor(mode = Sandbox.#MODE_CANVAS_2D) {
        this.#gnistEngine = null;
        this.#pointEmitter = null;
        this.#previousTime = 0;

        this.#renderMode = mode;
        this.#canvas = null;
        this.#hudCanvas = null;
        this.#ctx = null;
        this.#hudCtx = null;
        this.#gl = null;
        this.#webglBufferData = null;
        this.#glProgram = null;
        this.#glBuffer = null;
        this.#quadBuffer = null;
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
        this.#userAgentInfo = this.#getUserAgentInfo();
        this.#gnistEngine = new Gnist();

        this.#initCanvas();
        this.#initSimulation();
        this.#updateGnistCullingBounds();

        this.#canvas.addEventListener('mousemove', (event) => this.#handleMouseMove(event));

        window.addEventListener('resize', () => this.#handleResize());

        window.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                this.#takeScreenshotNextFrame = true;
            }
        });
    }

    /**
     * @returns {void}
     */
    #initCanvas() {
        const container = document.createElement('div');
        container.id = 'container';

        this.#canvas = document.createElement('canvas');
        this.#canvas.id = 'simulation-canvas';

        this.#hudCanvas = document.createElement('canvas');
        this.#hudCanvas.id = 'overlay-canvas';

        container.appendChild(this.#canvas);
        container.appendChild(this.#hudCanvas);
        document.body.appendChild(container);

        this.#hudCtx = this.#hudCanvas.getContext('2d');

        switch (this.#renderMode) {
            case Sandbox.#MODE_CANVAS_2D:
                this.#ctx = this.#canvas.getContext('2d');
                break;
            case Sandbox.#MODE_WEBGL:
                const glOptions = {
                    alpha: false,
                    premultipliedAlpha: false,
                };

                this.#gl = this.#canvas.getContext('webgl2', glOptions);

                if (this.#gl) {
                    this.#initWebGL();
                } else {
                    console.warn('WebGL not supported, falling back to Canvas 2D.');
                    this.#renderMode = Sandbox.#MODE_CANVAS_2D;
                    this.#ctx = this.#canvas.getContext('2d');
                }
                break;
            default:
                throw new Error(`Unsupported render mode: ${this.#renderMode}`);
        }

        this.#resizeCanvasToViewport();
    }

    /**
     * @returns {void}
     */
    /**
     * @returns {void}
     */
    #initWebGL() {
        const gl = this.#gl;

        if (!gl) {
            return;
        }

        // Dynamic WebGL 1 fallback polyfill for instanced arrays
        if (!gl.vertexAttribDivisor) {
            const ext = gl.getExtension('ANGLE_instanced_arrays');
            if (ext) {
                gl.vertexAttribDivisor = (index, divisor) => ext.vertexAttribDivisorANGLE(index, divisor);
                gl.drawArraysInstanced = (mode, first, count, instanceCount) => ext.drawArraysInstancedANGLE(mode, first, count, instanceCount);
            } else {
                console.error('Instanced arrays are completely unsupported on this environment.');
            }
        }

        const vertexShaderSource = `#version 300 es
            // Vertex attributes (constant for every single quad mesh)
            in vec2 a_quadVertex;
        
            // Instance attributes (unique per particle, streamed out of your flat array)
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
                // 1. Calculate the rotated local vertex position
                float s = sin(a_rotation);
                float c = cos(a_rotation);
                
                vec2 localScaledVertex = a_quadVertex * a_size;
                
                vec2 localRotatedVertex = vec2(
                    localScaledVertex.x * c - localScaledVertex.y * s,
                    localScaledVertex.x * s + localScaledVertex.y * c
                );
        
                // 2. Translate to world/screen space position
                vec2 worldPosition = a_position + localRotatedVertex;
        
                // 3. Convert to clip space
                vec2 zeroToOne = worldPosition / u_resolution;
                vec2 zeroToTwo = zeroToOne * 2.0;
                vec2 clipSpace = zeroToTwo - 1.0;
        
                gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
                
                // Pass properties cleanly to fragment processing
                v_color = a_color;
                v_opacity = a_opacity;
                v_texCoord = a_quadVertex + 0.5; // Maps (-0.5, 0.5) to a clean (0.0, 1.0) space
            }
        `;

        const fragmentShaderSource = `#version 300 es
            precision highp float;
            
            in vec3 v_color;
            in float v_opacity;
            in vec2 v_texCoord;
            
            out vec4 outColor;
        
            void main() {
                // Perfect, un-clipped instanced geometry output
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

        // Allocate dynamic stream buffer for ongoing particle state updates
        this.#glBuffer = gl.createBuffer();

        // Create and stage coordinates for a standard unit quad centered at (0, 0)
        const quadVertices = new Float32Array([
            -0.5, -0.5,
            0.5, -0.5,
            -0.5,  0.5,
            -0.5,  0.5,
            0.5, -0.5,
            0.5,  0.5,
        ]);

        this.#quadBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#quadBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

        // Pre-allocate the local flat float array (max 50,000 particles, 8 floats each)
        this.#webglBufferData = new Float32Array(50000 * 8);
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
            x: this.#canvas.width / 2,
            y: this.#canvas.height / 2,
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
        const width = this.#canvas.width;
        const height = this.#canvas.height;
        const particles = this.#gnistEngine.particles;
        const particleCount = particles.length;

        if (this.#hudCtx) {
            this.#hudCtx.clearRect(0, 0, this.#hudCanvas.width, this.#hudCanvas.height);
        }

        switch (this.#renderMode) {
            case Sandbox.#MODE_CANVAS_2D:
                this.#renderCanvas2D(particles, particleCount, width, height);
                break;
            case Sandbox.#MODE_WEBGL:
                this.#renderWebGL(particles, particleCount, width, height);
                break;
        }

        this.#renderPerformanceMetricsHud(particleCount);
    }

    /**
     * @param {number} particleCount
     * @returns {void}
     */
    #renderPerformanceMetricsHud(particleCount) {
        this.#hudCtx.fillStyle = '#CCC';
        this.#hudCtx.strokeStyle = this.#hudCtx.fillStyle;
        this.#hudCtx.lineWidth = 1;
        this.#hudCtx.font = '14px monospace';
        this.#hudCtx.textAlign = 'left';
        this.#hudCtx.textBaseline = 'top';

        const hudRowHeight = 20;
        const hudPadding = Sandbox.#CULLING_BOUNDS_MARGIN + 20;

        const performanceMetricsHudRows = [
            `Gnist version:  ${Gnist.VERSION}`,
            `Render mode:    ${this.#renderMode}`,
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
            this.#hudCtx.fillText(performanceMetricsHudRows[i], hudPadding, hudPadding + hudRowHeight + hudRowHeight * i);
        }

        const shortcutHint = 'Press [CTRL] + [S] to take a snapshot.';
        const shortcutHintWidth = this.#hudCtx.measureText(shortcutHint).width;
        this.#hudCtx.fillText(shortcutHint, (this.#hudCanvas.width - shortcutHintWidth) / 2, hudPadding);

        if (this.#gnistEngine.cullingBounds !== null) {
            this.#hudCtx.strokeRect(
                this.#gnistEngine.cullingBounds.xMin,
                this.#gnistEngine.cullingBounds.yMin,
                this.#gnistEngine.cullingBounds.xMax - this.#gnistEngine.cullingBounds.xMin,
                this.#gnistEngine.cullingBounds.yMax - this.#gnistEngine.cullingBounds.yMin,
            );
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
        this.#ctx.fillStyle = '#222';
        this.#ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < particleCount; i++) {
            const particle = particles[i];
            const { r, g, b } = particle.color;
            const a = particle.opacity;

            this.#ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
            const size = particle.size ?? 2;

            const halfSize = size / 2;
            const drawX = particle.x - halfSize;
            const drawY = particle.y - halfSize;

            this.#ctx.fillRect(drawX, drawY, size, size);
        }
    }

    /**
     * @param {Array} particles
     * @param {number} particleCount
     * @param {number} width
     * @param {number} height
     * @returns {void}
     */
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
        const gl = this.#gl;

        if (!gl || !this.#glProgram || !this.#webglBufferData) {
            return;
        }

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Clear the screen
        gl.viewport(0, 0, width, height);
        gl.clearColor(0.133, 0.133, 0.133, 1.0); // #222 in normalized RGB
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (particleCount === 0) {
            return;
        }

        // Use compiled shader program
        gl.useProgram(this.#glProgram);

        // Set the canvas resolution uniform
        const resolutionUniformLocation = gl.getUniformLocation(this.#glProgram, 'u_resolution');
        gl.uniform2f(resolutionUniformLocation, width, height);

        // Call Gnist export function
        const activeCount = this.#gnistEngine.fillFlatArray(this.#webglBufferData);

        if (activeCount === 0) {
            return;
        }

        const floatsPerParticle = 8;
        const totalFloatsWritten = activeCount * floatsPerParticle;

        // --- 1. BIND THE STANDARD QUAD VERTICES (Vertex Attribute) ---
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#quadBuffer);
        const quadVertLoc = gl.getAttribLocation(this.#glProgram, 'a_quadVertex');
        gl.enableVertexAttribArray(quadVertLoc);
        gl.vertexAttribPointer(quadVertLoc, 2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribDivisor(quadVertLoc, 0); // Advances per vertex, not per instance

        // --- 2. BIND YOUR DYNAMIC PARTICLE DATA (Instance Attributes) ---
        gl.bindBuffer(gl.ARRAY_BUFFER, this.#glBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.#webglBufferData.subarray(0, totalFloatsWritten), gl.DYNAMIC_DRAW);

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

        // Draw active particles as instanced quads (6 vertices per quad)
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, activeCount);

        // Clean up state changes so they don't break external hooks or state changes
        gl.vertexAttribDivisor(posLoc, 0);
        gl.vertexAttribDivisor(sizeLoc, 0);
        gl.vertexAttribDivisor(rotationLoc, 0);
        gl.vertexAttribDivisor(colorLoc, 0);
        gl.vertexAttribDivisor(opacityLoc, 0);
    }

    /**
     * @returns {void}
     */
    #downloadMergedSnapshot() {
        if (!this.#canvas || !this.#hudCanvas) {
            return;
        }

        const mergeCanvas = document.createElement('canvas');
        mergeCanvas.width = this.#canvas.width;
        mergeCanvas.height = this.#canvas.height;
        const mergeCtx = mergeCanvas.getContext('2d');

        if (!mergeCtx) {
            return;
        }

        mergeCtx.drawImage(this.#canvas, 0, 0);
        mergeCtx.drawImage(this.#hudCanvas, 0, 0);

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
        this.#updateGnistCullingBounds();
    }

    /**
     * @returns {void}
     */
    #resizeCanvasToViewport() {
        if (this.#canvas) {
            this.#canvas.width = window.innerWidth;
            this.#canvas.height = window.innerHeight;
        }
        if (this.#hudCanvas) {
            this.#hudCanvas.width = window.innerWidth;
            this.#hudCanvas.height = window.innerHeight;
        }
    }

    /**
     * @returns {void}
     */
    #updateGnistCullingBounds() {
        if (!this.#gnistEngine || !this.#canvas) {
            return;
        }

        this.#gnistEngine.cullingBounds = {
            xMin: Sandbox.#CULLING_BOUNDS_MARGIN,
            yMin: Sandbox.#CULLING_BOUNDS_MARGIN,
            xMax: this.#canvas.width - Sandbox.#CULLING_BOUNDS_MARGIN,
            yMax: this.#canvas.height - Sandbox.#CULLING_BOUNDS_MARGIN,
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
