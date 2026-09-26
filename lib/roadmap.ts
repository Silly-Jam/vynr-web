import fs from 'fs'
import path from 'path'
import { remark } from 'remark'
import html from 'remark-html'

// ROADMAP.md at the repository root is the single public source for /roadmap: GitHub renders
// it as-is, and this module projects the same file into the page's structure. The page never
// carries a second copy of the copy.
const ROADMAP_PATH = path.join(process.cwd(), 'ROADMAP.md')

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
  introHtml: string
  sections: RoadmapSection[]
}

// "**Planned next** · *Remember every tasting.*" — the first line of every release band.
const META_LINE = /^\*\*(.+?)\*\*(?: · \*(.+)\*)?$/
const VERSION_SEPARATOR = ' — '
const SITE_ORIGIN = 'https://vynr.app/'

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function render(markdown: string): string {
  const out = String(remark().use(html).processSync(markdown.trim()))
  // The source links absolutely so it reads correctly on GitHub; on the site they are local.
  return out.split(`href="${SITE_ORIGIN}`).join('href="/')
}

/** Splits `markdown` at every line starting with `marker` (e.g. "## "), returning the preamble and the parts. */
function splitAt(markdown: string, marker: string): { preamble: string; parts: { heading: string; body: string }[] } {
  const chunks = markdown.split(new RegExp(`^${marker}`, 'm'))
  const [preamble, ...rest] = chunks
  return {
    preamble,
    parts: rest.map(chunk => {
      const newline = chunk.indexOf('\n')
      return newline === -1
        ? { heading: chunk.trim(), body: '' }
        : { heading: chunk.slice(0, newline).trim(), body: chunk.slice(newline + 1) }
    }),
  }
}

function parseRelease(heading: string, body: string, section: string): RoadmapRelease {
  const lines = body.trim().split('\n')
  const meta = lines[0]?.match(META_LINE)
  if (!meta) {
    throw new Error(`ROADMAP.md: release "${heading}" must open with "**<commitment>** · *<promise>*"`)
  }
  const commitment = meta[1] as Commitment
  if (!COMMITMENTS.includes(commitment)) {
    throw new Error(`ROADMAP.md: release "${heading}" has unknown commitment "${meta[1]}"`)
  }
  if (commitment !== section) {
    throw new Error(`ROADMAP.md: release "${heading}" is "${commitment}" but sits under "${section}"`)
  }
  const separator = heading.indexOf(VERSION_SEPARATOR)
  const version = separator === -1 ? undefined : heading.slice(0, separator)
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

export function parseRoadmap(markdown: string): Roadmap {
  const titleMatch = markdown.match(/^# (.+)$/m)
  if (!titleMatch) throw new Error('ROADMAP.md: missing "# " title')
  const afterTitle = markdown.slice(markdown.indexOf(titleMatch[0]) + titleMatch[0].length)

  const { preamble, parts } = splitAt(afterTitle, '## ')
  const sections = parts.map(({ heading, body }) => {
    const { preamble: sectionIntro, parts: releaseParts } = splitAt(body, '### ')
    const isTier = (COMMITMENTS as readonly string[]).includes(heading)
    if (isTier && releaseParts.length === 0) {
      throw new Error(`ROADMAP.md: commitment section "${heading}" has no releases`)
    }
    if (!isTier && releaseParts.length > 0) {
      throw new Error(`ROADMAP.md: releases may only sit under ${COMMITMENTS.join(' / ')}, not "${heading}"`)
    }
    return {
      id: slug(heading),
      title: heading,
      html: render(sectionIntro),
      releases: releaseParts.map(r => parseRelease(r.heading, r.body, heading)),
    }
  })

  return { title: titleMatch[1].trim(), introHtml: render(preamble), sections }
}

export function getRoadmap(): Roadmap {
  return parseRoadmap(fs.readFileSync(ROADMAP_PATH, 'utf8'))
}
