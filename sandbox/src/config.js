export const RenderModes = Object.freeze({
    CANVAS_2D: 'canvas',
    WEBGL2: 'webgl',
});

export const Features = Object.freeze({
    // Emitters
    ELLIPSE_EMITTER: 'Ellipse Emitter',
    IMAGE_EMITTER: 'Image Emitter',
    LINE_EMITTER: 'Line Emitter',
    POINT_EMITTER: 'Point Emitter',
    RECT_EMITTER: 'Rect Emitter',

    // Forces
    DIRECTIONAL_FORCE: 'Directional Force',
    LINEAR_DRAG: 'Linear Drag',
    RADIAL_FORCE: 'Radial Force',
    VORTEX: 'Vortex',
    ORBITAL_FORCE: 'Orbital Force',

    // Path Modifiers
    ELASTIC_ANCHOR: 'Elastic Anchor',
    SINE_WAVE: 'Sine Wave',
    TURBULENCE: 'Turbulence',

    // Visual Modifiers
    COLOR_RAMP: 'Color Ramp',
    OPACITY_FADE: 'Opacity Fade',
    ROTATION_TWEEN: 'Rotation Tween',
    SCALE_TWEEN: 'Scale Tween',
    SPIN: 'Spin',

    // Other
    LIFECYCLE_HOOKS: 'Lifecycle Hooks',
    SUB_EMITTERS: 'Sub-Emitters',
});

export const Demos = Object.freeze({
    ELASTIC_SKULL: {
        id: 'elastic-skull',
        name: 'Elastic Skull',
        public: true,
        useCullingBounds: false,
        particleCountLimit: 12000,
        features: [
            Features.IMAGE_EMITTER,
            Features.RADIAL_FORCE,
            Features.ELASTIC_ANCHOR,
            Features.SINE_WAVE,
        ],
    },
    FIREWORKS: {
        id: 'fireworks',
        name: 'Fireworks',
        public: true,
        useCullingBounds: false,
        particleCountLimit: 2000,
        features: [
            Features.LIFECYCLE_HOOKS,
            Features.SUB_EMITTERS,
        ],
    },
    PORTAL: {
        id: 'portal',
        name: 'Portal',
        public: true,
        useCullingBounds: false,
        particleCountLimit: 12000,
        features: [
            Features.ELLIPSE_EMITTER,
            Features.ORBITAL_FORCE,
        ],
    },
    BENCHMARK: {
        id: 'benchmark',
        name: 'Benchmark',
        public: false,
        useCullingBounds: false,
        particleCountLimit: 510000,
        forceRenderMode: RenderModes.WEBGL2,
        features: [],
    }
});
