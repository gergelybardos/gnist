/**
 * @import { ModifierCategoryValues, FlatParticleDataFormatConstants, SourceValues } from './Types.js'
 */

/**
 * Runtime constant mapping for modifier categories. For the list of available categories, see {@link ModifierCategoryValues}.
 * @ignore
 * @type {ModifierCategoryValues}
 */
export const ModifierCategory = Object.freeze({
    VISUAL: 'visual',
    PATH: 'path'
});

/**
 * Runtime constant mapping for emission source modes. For the list of available modes, see {@link EmissionSourceValues}.
 * @type {EmissionSourceValues}
 */
export const EmissionSource = Object.freeze({
    EDGE_OUT: 'edge-out',
    EDGE_IN: 'edge-in',
    EDGE_BOTH: 'edge-both',
    VOLUME: 'volume',
});

/**
 * Runtime constants describing the flat particle data format exported by {@link Gnist#fillFlatArray}.
 * @type {FlatParticleDataFormatConstants}
 */
export const FlatParticleDataFormat = Object.freeze({
    FLOATS_PER_PARTICLE: 8
});
