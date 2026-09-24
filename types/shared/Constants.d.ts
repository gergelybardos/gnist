/**
 * @import { ModifierCategoryValues, FlatParticleDataFormatConstants, EmissionSourceValues } from './Types.js'
 */
import type { ModifierCategoryValues, FlatParticleDataFormatConstants, EmissionSourceValues } from './Types.js';
/**
 * Runtime constant mapping for modifier categories. For the list of available categories, see {@link ModifierCategoryValues}.
 * @ignore
 * @type {ModifierCategoryValues}
 */
export declare const ModifierCategory: ModifierCategoryValues;
/**
 * Runtime constant mapping for emission source modes. For the list of available modes, see {@link EmissionSourceValues}.
 * @type {EmissionSourceValues}
 */
export declare const EmissionSource: EmissionSourceValues;
/**
 * Runtime constants describing the flat particle data format exported by {@link Gnist#fillFlatArray}.
 * @type {FlatParticleDataFormatConstants}
 */
export declare const FlatParticleDataFormat: FlatParticleDataFormatConstants;
