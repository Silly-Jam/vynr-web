import { createHash } from 'crypto'
import fs from 'fs'
import path from 'path'

// The Guide to vynr is written once, in vynr's guide/chapters (SJAM-1041). vynr's
// scripts/build_guide.py writes the generated bundle this module reads:
// content/guide/guide.json and public/guide/*.jpg. Neither is ever edited here
// (ADR-WEB-0001 ADDENDUM-002). The bundle is verified on load, so a hand edit, a stale frame
// or a stamp that disagrees with its release fails the build instead of reaching the site.
// Spec: vynr docs/superpowers/specs/2026-10-21-guide-single-source-design.md §6–§7.
const BUNDLE_PATH = path.join(process.cwd(), 'content/guide/guide.json')
const FRAMES_DIR = path.join(process.cwd(), 'public/guide')
const NAME = 'content/guide/guide.json'

/** The /guide index groups, in index order (spec §6). A group with no chapters is not shown. */
export const GROUPS = [
  { id: 'getting-around', heading: 'Getting around' },
  { id: 'your-wines', heading: 'Your wines' },
  { id: 'time-and-memory', heading: 'Time and memory' },
  { id: 'your-data', heading: 'Your data' },
] as const

const TAG = /^v(\d+\.\d+(?:\.\d+)?)-build\d+-source$/
const SHA = /^[0-9a-f]{40}$/
const DIGEST = /^[0-9a-f]{64}$/

export interface Trace {
  fingers: 1 | 2
  from: [number, number]
  to: [number, number]
  hold: boolean
  motion: 'parallel' | 'spread' | 'pinch' | 'hold'
}

export interface Callout {
  number: number
  text: string
  /** x, y, width, height, normalised to the shot. */
  target: [number, number, number, number]
  badge: [number, number]
  trace: Trace | null
}

export interface Shot {
  file: string
  alt: string
  callouts: Callout[]
}

/** A tour page exactly as the app's FeatureTourCatalog.pages holds it (spec §7 projection). */
export interface Tour {
  id: string
  title: string
  message: string
  shots: Shot[]
}

export interface Chapter {
  id: string
  title: string
  group: string
  summary: string | null
  tour: Tour | null
  /** Raw Markdown: the web-only depth. */
  body: string
}

export interface GuideBundle {
  guideSourceCommit: string
  appSourceCommit: string
  describes: string
  appVersion: string
  bootstrapEqualityDigest: string | null
  contentHash: string
  chapters: Chapter[]
  images: Record<string, string>
}

/** RFC 8785 canonical JSON: keys sorted by UTF-16 code unit, no whitespace, ES number form. */
export function jcsBytes(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error(`canonical bytes: non-finite number ${value}`)
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) return `[${value.map(jcsBytes).join(',')}]`
  if (typeof value === 'object') {
    const entries = Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${jcsBytes((value as Record<string, unknown>)[key])}`)
    return `{${entries.join(',')}}`
  }
  throw new Error(`canonical bytes: unsupported value ${String(value)}`)
}

export function sha256Hex(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex')
}

/** The digest that proves the bundle's tour equals the described build's tour (spec §7). */
export function tourProjectionDigest(bundle: GuideBundle): string {
  return sha256Hex(jcsBytes(bundle.chapters.flatMap(c => (c.tour ? [c.tour] : []))))
}

/** Every rule the bundle must meet; throws naming the field. */
export function verifyBundle(bundle: GuideBundle, framesDir: string): void {
  const fail = (field: string, problem: string): never => {
    throw new Error(`${NAME}: ${field}: ${problem}`)
  }
  if (!SHA.test(bundle.guideSourceCommit)) fail('guideSourceCommit', 'not a 40-hex commit')
  if (!SHA.test(bundle.appSourceCommit)) fail('appSourceCommit', 'not a 40-hex commit')
  const tag = bundle.describes.match(TAG)
  if (!tag) return fail('describes', `${bundle.describes} is not a v<version>-build<N>-source tag`)
  if (bundle.appVersion !== tag[1]) fail('appVersion', `${bundle.appVersion} disagrees with ${bundle.describes}`)

  const groups: readonly string[] = GROUPS.map(g => g.id)
  const ids = new Set<string>()
  for (const chapter of bundle.chapters) {
    if (ids.has(chapter.id)) fail('chapters', `duplicate id ${chapter.id}`)
    ids.add(chapter.id)
    if (!groups.includes(chapter.group)) fail(`${chapter.id}.group`, `unknown group ${chapter.group}`)
    if (chapter.tour === null && !chapter.summary) fail(`${chapter.id}.summary`, 'a chapter without a tour needs a summary')
    if (chapter.tour !== null && chapter.tour.id !== chapter.id) fail(`${chapter.id}.tour.id`, 'differs from the chapter id')
  }

  const used = new Set(bundle.chapters.flatMap(c => c.tour?.shots.map(s => s.file) ?? []))
  for (const name of used) if (!(name in bundle.images)) fail('images', `${name} is used by a tour but not listed`)
  for (const [name, hash] of Object.entries(bundle.images)) {
    if (!used.has(name)) fail('images', `${name} is listed but no tour uses it`)
    const file = path.join(framesDir, name)
    if (!fs.existsSync(file)) fail('images', `${name} is missing from public/guide`)
    if (sha256Hex(fs.readFileSync(file)) !== hash) fail('images', `${name} does not match its sha256`)
  }

  const content = sha256Hex(jcsBytes({ chapters: bundle.chapters, images: bundle.images }))
  if (content !== bundle.contentHash) fail('contentHash', `does not reproduce (computed ${content})`)

  const bootstrapped = bundle.guideSourceCommit !== bundle.appSourceCommit
  if (!bootstrapped && bundle.bootstrapEqualityDigest !== null) {
    fail('bootstrapEqualityDigest', 'must be null when the guide and app commits are the same')
  }
  if (bootstrapped) {
    if (bundle.bootstrapEqualityDigest === null || !DIGEST.test(bundle.bootstrapEqualityDigest)) {
      fail('bootstrapEqualityDigest', 'required when the guide and app commits differ')
    }
    if (bundle.bootstrapEqualityDigest !== tourProjectionDigest(bundle)) {
      fail('bootstrapEqualityDigest', 'is not the tour projection digest of this bundle')
    }
  }
}

let cached: GuideBundle | undefined

/** The verified bundle; a bad bundle throws, so `next build` fails rather than render it. */
export function getGuide(): GuideBundle {
  if (!cached) {
    const bundle = JSON.parse(fs.readFileSync(BUNDLE_PATH, 'utf8')) as GuideBundle
    verifyBundle(bundle, FRAMES_DIR)
    cached = bundle
  }
  return cached
}

export function getChapter(id: string): Chapter | undefined {
  return getGuide().chapters.find(c => c.id === id)
}

/** The previous and next chapters in source order. */
export function neighbours(id: string): { previous?: Chapter; next?: Chapter } {
  const chapters = getGuide().chapters
  const index = chapters.findIndex(c => c.id === id)
  return { previous: chapters[index - 1], next: index >= 0 ? chapters[index + 1] : undefined }
}

/** The chapter's one line on the index and in its meta description: the tour message or the summary. */
export function chapterLine(chapter: Chapter): string {
  return chapter.tour?.message ?? chapter.summary ?? ''
}

export function versionStamp(bundle: GuideBundle): string {
  return `Guide for vynr ${bundle.appVersion}`
}
