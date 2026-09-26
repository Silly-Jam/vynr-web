import fs from 'fs'
import path from 'path'
import { assertUniqueIds, readSource, render, slug, splitAt } from './markdown-source'

// ROADMAP.md at the repository root is the single public source for /roadmap: GitHub renders
// it as-is, and this module projects the same file into the page's structure. The page never
// carries a second copy of the copy.
const ROADMAP_PATH = path.join(process.cwd(), 'ROADMAP.md')
const NAME = 'ROADMAP.md'

export const COMMITMENTS = ['Launch', 'Planned next', 'Directional later'] as const
export type Commitment = (typeof COMMITMENTS)[number]

export interface RoadmapRelease {
  id: string
  /** App Store version, e.g. "1.3"; absent for unversioned bands such as "Under consideration". */
  version?: string
  theme: string
  commitment: Commitment
  /** The one-line customer promise, when the release has one. */
  promise?: string
  html: string
}

export interface RoadmapSection {
  id: string
  title: string
  html: string
  releases: RoadmapRelease[]
}

export interface Roadmap {
  title: string
  /** The first paragraph of the intro as plain text, for the page's meta description. */
  summary: string
  introHtml: string
  sections: RoadmapSection[]
}

// "**Planned next** · *Remember every tasting.*" — the first line of every release band.
const META_LINE = /^\*\*(.+?)\*\*(?: · \*(.+)\*)?$/
const VERSION_SEPARATOR = ' — '
// "1.2", "1.2.1", "1.2.x": an App Store version, never free text.
const VERSION_SHAPE = /^\d+(?:\.(?:\d+|x))+$/
function parseRelease(heading: string, body: string, section: string): RoadmapRelease {
  const lines = body.trim().split('\n')
  const meta = lines[0]?.match(META_LINE)
  if (!meta) {
    throw new Error(`${NAME}: release "${heading}" must open with "**<commitment>** · *<promise>*"`)
  }
  const commitment = meta[1] as Commitment
  if (!COMMITMENTS.includes(commitment)) {
    throw new Error(`${NAME}: release "${heading}" has unknown commitment "${meta[1]}"`)
  }
  if (commitment !== section) {
    throw new Error(`${NAME}: release "${heading}" is "${commitment}" but sits under "${section}"`)
  }
  const separator = heading.indexOf(VERSION_SEPARATOR)
  const version = separator === -1 ? undefined : heading.slice(0, separator)
  if (version !== undefined && !VERSION_SHAPE.test(version)) {
    throw new Error(`${NAME}: "${heading}" — text before " — " must be a version such as 1.3 or 1.2.x`)
  }
  const theme = separator === -1 ? heading : heading.slice(separator + VERSION_SEPARATOR.length)
  return {
    id: slug(version ? `v${version}` : theme),
    version,
    theme,
    commitment,
    promise: meta[2],
    html: render(lines.slice(1).join('\n')),
  }
}

export function parseRoadmap(raw: string): Roadmap {
  const document = readSource(raw, NAME)
  const sections = document.sections.map(({ heading, body }) => {
    const { preamble: sectionIntro, parts: releaseParts } = splitAt(body, '### ')
    const isTier = (COMMITMENTS as readonly string[]).includes(heading)
    if (isTier && releaseParts.length === 0) {
      throw new Error(`${NAME}: commitment section "${heading}" has no releases`)
    }
    if (!isTier && releaseParts.length > 0) {
      throw new Error(`${NAME}: releases may only sit under ${COMMITMENTS.join(' / ')}, not "${heading}"`)
    }
    return {
      id: slug(heading),
      title: heading,
      html: render(sectionIntro),
      releases: releaseParts.map(r => parseRelease(r.heading, r.body, heading)),
    }
  })
  assertUniqueIds(sections.flatMap(s => [s.id, ...s.releases.map(r => r.id)]), NAME)

  return { title: document.title, summary: document.summary, introHtml: render(document.preamble), sections }
}

export function getRoadmap(): Roadmap {
  return parseRoadmap(fs.readFileSync(ROADMAP_PATH, 'utf8'))
}
