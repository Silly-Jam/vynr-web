import { remark } from 'remark'
import html from 'remark-html'

// Shared reading of the site's single-source public documents (ROADMAP.md, VYNR-PLUS.md).
// Each file is GitHub-readable as-is; these helpers split it on heading lines and render
// each part through remark, so a page lays the document out without carrying its words.

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

export function slug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function render(markdown: string): string {
  const out = String(remark().use(html).processSync(markdown.trim()))
  return out.replace(SITE_LINK, (_, path: string | undefined) => `href="${path ?? '/'}"`)
}

export interface MarkdownPart {
  heading: string
  body: string
}

/** Splits `markdown` at every line starting with `marker` (e.g. "## "), returning the preamble and the parts. */
export function splitAt(markdown: string, marker: string): { preamble: string; parts: MarkdownPart[] } {
  const [preamble, ...rest] = markdown.split(new RegExp(`^${marker}`, 'm'))
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

export interface SourceDocument {
  title: string
  /** The first paragraph after the title as plain text, for the page's meta description. */
  summary: string
  /** Everything between the title and the first "## " heading. */
  preamble: string
  /** The "## " sections, in order. */
  sections: MarkdownPart[]
}

/**
 * Reads a public source file, refusing anything the split-and-render approach cannot carry
 * faithfully. `name` prefixes every error so a failed build names the file to fix.
 */
export function readSource(raw: string, name: string): SourceDocument {
  const markdown = raw.replace(/\r\n?/g, '\n')
  // The source is split on heading lines; a fenced block could hide a "## " line and tear
  // the fence apart. These documents have no use for code, so refuse it rather than guess.
  if (/^\s*(?:```|~~~)/m.test(markdown)) throw new Error(`${name}: fenced code blocks are not supported`)
  // Each part renders on its own, so a reference-style link definition in one part would not
  // resolve in another. Inline links only.
  if (hasNode(remark().parse(markdown), 'definition')) {
    throw new Error(`${name}: use inline links, not reference-style definitions`)
  }

  const titleMatch = markdown.match(/^# (.+)$/m)
  if (!titleMatch) throw new Error(`${name}: missing "# " title`)
  const afterTitle = markdown.slice(markdown.indexOf(titleMatch[0]) + titleMatch[0].length)
  const { preamble, parts } = splitAt(afterTitle, '## ')

  const summary = preamble.trim().split(/\n\s*\n/)[0]?.replace(/\s+/g, ' ').trim() ?? ''
  if (!summary) throw new Error(`${name}: the intro must open with a summary paragraph`)

  return { title: titleMatch[1].trim(), summary, preamble, sections: parts }
}

/** Every id becomes an HTML id and a jump target: each must exist and be unique. */
export function assertUniqueIds(ids: string[], name: string): void {
  for (const id of ids) {
    if (!id) throw new Error(`${name}: a heading produced an empty id; use ASCII letters or digits`)
    if (ids.indexOf(id) !== ids.lastIndexOf(id)) throw new Error(`${name}: duplicate id "${id}"`)
  }
}
