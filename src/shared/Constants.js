/**
 * Available emission source modes used in emitter configurations (specifically for `EmitterConfig.source`)
 * to define the geometric distribution and initial direction of emitted particles.
 * The default direction depends on both the source mode and the emitter type and can be overridden by specifying
 * `particleBlueprint.direction` in the emitter config.
 * @typedef {object} Source
 * @property {string} EDGE_OUT Emit from the shape's boundary, directing particles outward.
 * @property {string} EDGE_IN Emit from the shape's boundary, directing particles inward.
 * @property {string} EDGE_BOTH Emit from the shape's boundary, directing particles randomly inward or outward.
 * @property {string} VOLUME Emit uniformly from the shape's entire area.
 */

/**
 * @type {Source}
 */
export const Source = Object.freeze({
    EDGE_OUT: 'edge-out',
    EDGE_IN: 'edge-in',
    EDGE_BOTH: 'edge-both',
    VOLUME: 'volume',
});

/**
 * Architectural categories for particle modifiers.
 * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
 * @typedef {object} ModifierCategory
 * @property {string} VISUAL Modifiers that manipulate visual appearance (e.g., color, opacity, scale).
 * @property {string} PATH Modifiers that manipulate trajectories (e.g., zig-zag, orbit).
 */

/**
 * @type {ModifierCategory}
 */
export const ModifierCategory = Object.freeze({
    VISUAL: 'visual',
    PATH: 'path'
});
