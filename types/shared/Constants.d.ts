/**
 * @import {
 *    ModifierCategoryValues,
 *    FlatParticleDataFormatConstants,
 *    EmissionSourceValues,
 *    LoopModeValues,
 * } from './Types.js'
 */
import type { ModifierCategoryValues, FlatParticleDataFormatConstants, EmissionSourceValues, LoopModeValues } from './Types.js';
/**
 * Constant mapping for modifier categories.
 * For the list of available categories, see {@link ModifierCategoryValues}.
 * @ignore
 * @type {ModifierCategoryValues}
 */
export declare const ModifierCategory: ModifierCategoryValues;
/**
 * Constant mapping for emission source modes.
 * For the list of available modes, see {@link EmissionSourceValues}.
 * @type {EmissionSourceValues}
 */
export declare const EmissionSource: EmissionSourceValues;
/**
 * Constants describing the flat particle data format returned by {@link Gnist#fillFlatArray}.
 * @type {FlatParticleDataFormatConstants}
 */
export declare const FlatParticleDataFormat: FlatParticleDataFormatConstants;
/**
 * Constant mapping for particle loop modes.
 * For the list of available loop modes, see {@link LoopModeValues}.
 * @type {LoopModeValues}
 */
export declare const LoopMode: LoopModeValues;
