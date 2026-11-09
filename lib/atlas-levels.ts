// Kept apart from lib/atlas.ts so client components can use it without
// bundling the atlas dataset.

/** Plural of every childLevelHint in the atlas dataset, keyed by the hint. */
const LEVEL_PLURALS: Readonly<Record<string, string>> = {
  Continent: 'continents',
  Country: 'countries',
  Region: 'regions',
  'Sub-region': 'sub-regions',
  Appellation: 'appellations',
  Commune: 'communes',
};

/** The hint used when a node carries none, as the Atlas pages always have. */
export const DEFAULT_CHILD_LEVEL = 'Region';

/**
 * "1 country", "23 countries": a count of a node's children, named by level.
 * Throws on a level the table does not know, so new atlas data cannot ship a
 * misspelt plural.
 */
export function formatLevelCount(count: number, levelHint: string): string {
  const plural = LEVEL_PLURALS[levelHint];
  if (plural === undefined) {
    throw new Error(`No plural for atlas level "${levelHint}"; add it to LEVEL_PLURALS in lib/atlas-levels.ts`);
  }
  return `${count} ${count === 1 ? levelHint.toLowerCase() : plural}`;
}
