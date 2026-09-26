import fs from 'fs'
import path from 'path'
import { assertUniqueIds, readSource, render, slug, splitAt } from './markdown-source'

// VYNR-PLUS.md at the repository root is the single public source for /vynr-plus. It restates
// the V1 free/vynr+ boundary (ADR-0018 ADDENDUM SJAM-591 D3) and must never extend it.
const PLANS_PATH = path.join(process.cwd(), 'VYNR-PLUS.md')
const NAME = 'VYNR-PLUS.md'

export interface ComparisonRow {
  id: string
  area: string
  freeHtml: string
  plusHtml: string
}

export interface PlansSection {
  id: string
  title: string
  html: string
  /** Present when the section is a side-by-side comparison. */
  rows?: ComparisonRow[]
}

export interface Plans {
  title: string
  summary: string
  introHtml: string
  sections: PlansSection[]
}

// A comparison row is exactly two list items: "- **vynr:** …" then "- **vynr+:** …".
const ROW = /^- \*\*vynr:\*\* (.+)\n- \*\*vynr\+:\*\* (.+)$/

function parseRow(area: string, body: string): ComparisonRow | null {
  const match = body.trim().match(ROW)
  return match ? { id: slug(area), area, freeHtml: render(match[1]), plusHtml: render(match[2]) } : null
}

export function parsePlans(raw: string): Plans {
  const document = readSource(raw, NAME)
  const sections = document.sections.map(({ heading, body }): PlansSection => {
    const { preamble, parts } = splitAt(body, '### ')
    const rows = parts.map(part => parseRow(part.heading, part.body))
    const isComparison = parts.length > 0 && rows.every(row => row !== null)
    if (!isComparison && parts.length > 0 && rows.some(row => row !== null)) {
      throw new Error(`${NAME}: "${heading}" mixes comparison rows with other subsections`)
    }
    return isComparison
      ? { id: slug(heading), title: heading, html: render(preamble), rows: rows as ComparisonRow[] }
      : { id: slug(heading), title: heading, html: render(body) }
  })
  assertUniqueIds(sections.map(s => s.id), NAME)
  return { title: document.title, summary: document.summary, introHtml: render(document.preamble), sections }
}

export function getPlans(): Plans {
  return parsePlans(fs.readFileSync(PLANS_PATH, 'utf8'))
}
