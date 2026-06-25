/**
 * Represents the color state of a particle. RGB color channels are stored independently for efficient interpolation.
 */
type Color = {
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
