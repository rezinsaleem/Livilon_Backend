export const MATERIAL_CATEGORIES = [
  'Plywood',
  'MDF',
  'PU foam sheet',
  'EP sheet',
  'Pins',
  'Screws',
  'Show beedings',
  'Legs',
] as const;

export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];
