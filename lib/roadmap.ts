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
// Links to the site itself are written absolutely so they work on GitHub; on the site they are local.
const SITE_LINK = /href="https:\/\/(?:www\.)?vynr\.app(\/[^"]*)?"/g

interface MarkdownNode {
  type: string
  children?: MarkdownNode[]
}

/** Whether the parsed markdown tree contains a node of `type` anywhere, at any depth. */
function hasNode(node: MarkdownNode, type: string): boolean {
  return node.type === type || (node.children ?? []).some(child => hasNode(child, type))
}

function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function render(markdown: string): string {
  const out = String(remark().use(html).processSync(markdown.trim()))
  return out.replace(SITE_LINK, (_, path: string | undefined) => `href="${path ?? '/'}"`)
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
  if (version !== undefined && !VERSION_SHAPE.test(version)) {
    throw new Error(`ROADMAP.md: "${heading}" — text before " — " must be a version such as 1.3 or 1.2.x`)
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
  const markdown = raw.replace(/\r\n?/g, '\n')
  // The source is split on heading lines; a fenced block could hide a "## " line and tear
  // the fence apart. The roadmap has no use for code, so refuse it rather than guess.
  if (/^\s*(?:```|~~~)/m.test(markdown)) throw new Error('ROADMAP.md: fenced code blocks are not supported')
  // Each section renders on its own, so a reference-style link definition in one section
  // would not resolve in another. Inline links only.
  if (hasNode(remark().parse(markdown), 'definition')) {
    throw new Error('ROADMAP.md: use inline links, not reference-style definitions')
  }
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

  // Every section and release id becomes an HTML id and a jump target: each must exist and be unique.
  const ids = sections.flatMap(s => [s.id, ...s.releases.map(r => r.id)])
  for (const id of ids) {
    if (!id) throw new Error('ROADMAP.md: a heading produced an empty id; use ASCII letters or digits')
    if (ids.indexOf(id) !== ids.lastIndexOf(id)) throw new Error(`ROADMAP.md: duplicate id "${id}"`)
  }

  const summary = preamble.trim().split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ?? ''
  if (!summary) throw new Error('ROADMAP.md: the intro must open with a summary paragraph')

  return { title: titleMatch[1].trim(), summary, introHtml: render(preamble), sections }
}

export function getRoadmap(): Roadmap {
  return parseRoadmap(fs.readFileSync(ROADMAP_PATH, 'utf8'))
}
