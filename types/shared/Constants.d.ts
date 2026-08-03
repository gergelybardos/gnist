/**
 * @import { ModifierCategoryValues, ParticleFormatConstants, SourceValues } from './Types.js'
 */
/**
 * Runtime constant mapping for modifier categories. For the list of available categories, see {@link ModifierCategoryValues}.
 * @ignore
 * @type {ModifierCategoryValues}
 */
export const ModifierCategory: ModifierCategoryValues;
/**
 * Runtime constant mapping for emission source modes. For the list of available modes, see {@link SourceValues}.
 * @type {SourceValues}
 */
export const Source: SourceValues;
/**
 * Runtime constants describing the flat particle data format exported by {@link Gnist#fillFlatArray}.
 * @type {ParticleFormatConstants}
 */
export const ParticleFormat: ParticleFormatConstants;
import type { ModifierCategoryValues } from './Types.js';
import type { SourceValues } from './Types.js';
import type { ParticleFormatConstants } from './Types.js';
