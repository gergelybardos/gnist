/**
 * @import { ModifierCategoryValues, SourceValues } from './Types.js'
 */

/**
 * Runtime constant mapping for modifier categories. For the list of available categories, see {@link ModifierCategoryValues}.
 * @type {ModifierCategoryValues}
 */
export const ModifierCategory = Object.freeze({
    VISUAL: 'visual',
    PATH: 'path'
});

/**
 * Runtime constant mapping for emission source modes. For the list of available modes, see {@link SourceValues}.
 * @type {SourceValues}
 */
export const Source = Object.freeze({
    EDGE_OUT: 'edge-out',
    EDGE_IN: 'edge-in',
    EDGE_BOTH: 'edge-both',
    VOLUME: 'volume',
});
