/**
 * @import { ModifierCategoryType, SourceType } from './Types.js'
 */

/**
 * @type {ModifierCategoryType}
 */
export const ModifierCategory = Object.freeze({
    VISUAL: 'visual',
    PATH: 'path'
});

/**
 * @type {SourceType}
 */
export const Source = Object.freeze({
    EDGE_OUT: 'edge-out',
    EDGE_IN: 'edge-in',
    EDGE_BOTH: 'edge-both',
    VOLUME: 'volume',
});
