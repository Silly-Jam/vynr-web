import fs from 'fs'
import path from 'path'

/**
 * The weekly revisions record (SJAM-521).
 *
 * An EDITION is the machine-generated account of what changed between two published
 * reference-data epochs. It is produced in vynr-data and committed here as a generated
 * output — never edited in this repository, exactly like the atlas and education
 * artifacts under `lib/`.
 *
 * HIGHLIGHTS are the one editorial layer, and they are strictly ADDITIVE: a markdown
 * file per edition, written by a human after publication, rendered in its own section.
 * Nothing in this module lets a highlights file change, hide, or reorder a single
 * machine fact — which is what keeps an edition reproducible from its epoch pair after
 * a human has annotated it.
 *
 * "Revisions", not "status" or "journal", and the naming is load-bearing: a status page
 * implies uptime reporting this product does not do, and "Journal" is the name of a
 * shipped feature inside the app (ADR-0048). An atlas publishes revisions.
 */

const editionsDirectory = path.join(process.cwd(), 'content/revisions')
const highlightsDirectory = path.join(process.cwd(), 'content/revisions/highlights')

/**
 * Below this many changes, every change is shown expanded by default; at or above it,
 * the edition leads with per-category counts and keeps the full set one disclosure
 * away. A reader should never have to click to see a small week, and should never be
 * handed several hundred rows unasked.
 */
export const SHOW_ALL_THRESHOLD = 10

/** The only edition shape this renderer understands. */
export const SUPPORTED_SCHEMA_VERSION = 1

export type ChangeKind = 'added' | 'removed' | 'updated'

export interface EpochEndpoint {
  epoch: number
  commit: string
  committedAt: string
  registrySha256: string
}

export interface RevisionChange {
  category: string
  kind: ChangeKind
  id: string
  label: string
  datasets: string[]
  /** Present only on `updated`. Named public fields; see `otherFieldCount`. */
  fields?: string[]
  /** Refinements to fields the record deliberately does not name. */
  otherFieldCount?: number
}

export interface CategorySummary {
  category: string
  added: number
  updated: number
  removed: number
}

export interface Edition {
  schemaVersion: number
  editionId: string
  generatedAt: string
  from: EpochEndpoint
  to: EpochEndpoint
  changeCount: number
  categories: CategorySummary[]
  changes: RevisionChange[]
}

export class UnsupportedEditionError extends Error {}

/**
 * Parse and validate one edition.
 *
 * An edition whose schema this renderer does not know is REFUSED rather than rendered
 * partially: a future field could carry a distinction the current markup silently drops,
 * and a page that quietly shows less than the record contains is worse than a page that
 * says it cannot show it.
 */
export function parseEdition(raw: string, source: string): Edition {
  const parsed = JSON.parse(raw) as Partial<Edition>
  if (parsed.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    throw new UnsupportedEditionError(
      `${source}: schemaVersion ${String(parsed.schemaVersion)} is not ` +
        `${SUPPORTED_SCHEMA_VERSION}; this renderer would drop fields it does not know.`
    )
  }
  if (!parsed.editionId || !parsed.from || !parsed.to || !Array.isArray(parsed.changes)) {
    throw new UnsupportedEditionError(`${source}: missing required edition fields`)
  }
  return parsed as Edition
}

/** Every published edition, newest epoch first. */
export function getAllEditions(): Edition[] {
  if (!fs.existsSync(editionsDirectory)) return []
  return fs
    .readdirSync(editionsDirectory)
    .filter((name) => name.endsWith('.json'))
    .map((name) =>
      parseEdition(fs.readFileSync(path.join(editionsDirectory, name), 'utf8'), name)
    )
    .sort((a, b) => b.to.epoch - a.to.epoch)
}

export function getEdition(editionId: string): Edition | null {
  const file = path.join(editionsDirectory, `${editionId}.json`)
  if (!isInsideEditions(file) || !fs.existsSync(file)) return null
  return parseEdition(fs.readFileSync(file, 'utf8'), editionId)
}

/**
 * The human highlights for an edition, or null.
 *
 * Returned as raw markdown for the page to render. Absent is the normal case: most
 * editions never get one, and an edition without highlights is complete.
 */
export function getHighlights(editionId: string): string | null {
  // Highlights ANNOTATE an edition, so an id with no edition behind it has no
  // highlights by definition. Checked here rather than relying on the caller: the
  // directory also holds prose about itself, and without this a `README.md` beside the
  // notes would render as though it were one edition's editorial panel.
  const edition = path.join(editionsDirectory, `${editionId}.json`)
  if (!isInsideEditions(edition) || !fs.existsSync(edition)) return null

  const file = path.join(highlightsDirectory, `${editionId}.md`)
  if (!isInsideHighlights(file) || !fs.existsSync(file)) return null
  const body = fs.readFileSync(file, 'utf8').trim()
  return body.length > 0 ? body : null
}

/**
 * Refuse a path that escapes its directory.
 *
 * `editionId` reaches `getEdition` from a URL segment. Next.js decodes `%2f` before the
 * route parameter is handed over, so a crafted id could otherwise traverse out of
 * `content/` and read an arbitrary file from the deployment.
 */
function isInsideEditions(file: string): boolean {
  return path.resolve(file).startsWith(path.resolve(editionsDirectory) + path.sep)
}

function isInsideHighlights(file: string): boolean {
  return path.resolve(file).startsWith(path.resolve(highlightsDirectory) + path.sep)
}

/** Show every change expanded, rather than a summary with the detail folded away. */
export function showsEveryChangeByDefault(edition: Edition): boolean {
  return edition.changeCount < SHOW_ALL_THRESHOLD
}

/**
 * Changes grouped for rendering, preserving the order the generator emitted.
 *
 * Deliberately NOT re-sorted: the generator orders by declared category, then kind,
 * then label, and re-deriving that here would be a second ordering rule that could
 * disagree with the one the record was written in.
 */
export function groupByCategory(
  changes: RevisionChange[]
): { category: string; changes: RevisionChange[] }[] {
  const groups: { category: string; changes: RevisionChange[] }[] = []
  for (const change of changes) {
    const last = groups[groups.length - 1]
    if (last && last.category === change.category) last.changes.push(change)
    else groups.push({ category: change.category, changes: [change] })
  }
  return groups
}

/** `+2 · ~1` style counts for a category, omitting the zeroes. */
export function summaryParts(summary: CategorySummary): string[] {
  const parts: string[] = []
  if (summary.added) parts.push(`${summary.added} added`)
  if (summary.updated) parts.push(`${summary.updated} refined`)
  if (summary.removed) parts.push(`${summary.removed} removed`)
  return parts
}

/**
 * What an `updated` change says about itself.
 *
 * A refinement to fields the record does not name is still reported — as a count, with
 * no field names. The alternative, saying nothing, would make a real change invisible;
 * naming them would put this repository's internal curation vocabulary on a public page.
 */
export function describeUpdate(change: RevisionChange): string {
  const named = change.fields ?? []
  const other = change.otherFieldCount ?? 0
  if (named.length && other) {
    return `${named.join(', ')}, and ${other} further ${other === 1 ? 'detail' : 'details'}`
  }
  if (named.length) return named.join(', ')
  if (other) return `${other} ${other === 1 ? 'detail' : 'details'}`
  return 'refined'
}

export function formatEpochRange(edition: Edition): string {
  return `Epoch ${edition.from.epoch} → ${edition.to.epoch}`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
