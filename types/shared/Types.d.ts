/**
 * Represents the color state of a particle. RGB color channels are stored independently for efficient interpolation.
 */
export type Color = {
    /**
     * Red color channel value (0 to 255).
     */
    r?: number | undefined;
    /**
     * Green color channel value (0 to 255).
     */
    g?: number | undefined;
    /**
     * Blue color channel value (0 to 255).
     */
    b?: number | undefined;
};
/**
 * Architectural categories for particle modifiers.
 * Used by emitters to sort modifiers into specialized update loops (e.g., visual vs. path).
 */
export type ModifierCategoryValues = {
    /**
     * Modifiers that manipulate visual appearance (e.g., color, opacity, scale).
     */
    VISUAL: string;
    /**
     * Modifiers that manipulate trajectories (e.g., zig-zag, orbit).
     */
    PATH: string;
};
/**
 * Available emission source modes used in emitter configurations (specifically for `EmitterConfig.source`)
 * to define the geometric distribution and initial direction of emitted particles.
 * The default direction depends on both the source mode and the emitter type and can be overridden by specifying
 * `particleBlueprint.direction` in the emitter config.
 */
export type SourceValues = {
    /**
     * Emit from the shape's boundary, directing particles outward.
     */
    EDGE_OUT: string;
    /**
     * Emit from the shape's boundary, directing particles inward.
     */
    EDGE_IN: string;
    /**
     * Emit from the shape's boundary, directing particles randomly inward or outward.
     */
    EDGE_BOTH: string;
    /**
     * Emit uniformly from the shape's entire area.
     */
    VOLUME: string;
};
