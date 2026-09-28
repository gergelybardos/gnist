/**
 * @import {
 *    ModifierCategoryValues,
 *    FlatParticleDataFormatConstants,
 *    EmissionSourceValues,
 *    LoopDirectionValues,
 *    LoopModeValues,
 * } from './Types.js'
 */

/**
 * Constant mapping for modifier categories.
 * For the list of available categories, see {@link ModifierCategoryValues}.
 * @ignore
 * @type {ModifierCategoryValues}
 */
export const ModifierCategory = Object.freeze({
    VISUAL: 'visual',
    PATH: 'path'
});

/**
 * Constant mapping for emission source modes.
 * For the list of available modes, see {@link EmissionSourceValues}.
 * @type {EmissionSourceValues}
 */
export const EmissionSource = Object.freeze({
    EDGE_OUT: 'edge-out',
    EDGE_IN: 'edge-in',
    EDGE_BOTH: 'edge-both',
    VOLUME: 'volume',
});

/**
 * Constants describing the flat particle data format returned by {@link Gnist#fillFlatArray}.
 * @type {FlatParticleDataFormatConstants}
 */
export const FlatParticleDataFormat = Object.freeze({
    FLOATS_PER_PARTICLE: 8
});

/**
 * Constant mapping for tracking particle loop directions.
 * For the list of available directions, see {@link LoopDirectionValues}.
 * @ignore
 * @type {LoopDirectionValues}
 */
export const LoopDirection = Object.freeze({
    FORWARD: 1,
    REVERSE: -1,
});

/**
 * Constant mapping for particle loop modes.
 * For the list of available loop modes, see {@link LoopModeValues}.
 * @type {LoopModeValues}
 */
export const LoopMode = Object.freeze({
    REPEAT: 'repeat',
    OSCILLATE: 'oscillate',
    HOLD: 'hold',
});
