# Highlights — the one editorial layer

An edition under `content/revisions/` is **generated** in vynr-data by comparing two
published reference-data epochs. It is never edited here.

To add or amend a human note on an edition **after** it is published, create or edit:

```
content/revisions/highlights/<editionId>.md      e.g. epoch-953.md
```

Plain markdown, no front matter. It renders in its own **Highlights** panel above the
machine record, labelled as hand-written.

**What a highlights file cannot do, by construction:** it cannot change, hide, reorder
or add to a single generated fact, and removing it leaves the edition complete. That is
what keeps an annotated edition still reproducible from the epoch pair it names — the
generator never reads this directory, and never writes to it.

A highlights file whose name matches no edition is ignored — `getHighlights` resolves
the edition first — so notes-about-notes can never surface as one edition's panel.
