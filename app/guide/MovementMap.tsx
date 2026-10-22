import { getChapter, type Chapter } from "@/lib/guide";

// The app's spatial model, drawn before any detail (spec §6, The movement map). The labels are
// the app's own names for its views and places; every caption is the linked chapter's title
// from the generated bundle, so the teaching words stay in the single source.
const STACK = ["Cellar", "Atlas", "Storage", "Time Lens"] as const;
const SWITCHER = ["Cellar", "Atlas", "Storage", "Time Lens", "Wine List · Producer List", "Journal · Vynrpedia"] as const;
const PLACE = ["Europe", "France", "Burgundy"] as const;

function chapter(id: string): Chapter {
  const found = getChapter(id);
  if (!found) throw new Error(`guide movement map: chapter ${id} is missing from the bundle`);
  return found;
}

export default function MovementMap() {
  const move = chapter("move");
  const jump = chapter("jump");
  const hold = chapter("hold");
  return (
    <nav className="guide-map" aria-labelledby="guide-map-title">
      <h2 id="guide-map-title" className="guide-kicker">The movement map</h2>
      <div className="guide-map-grid">
        <a href={`#${move.id}`} className="guide-map-node">
          <span className="guide-map-stack" aria-hidden="true">
            {STACK.map((view, i) => (
              <span key={view} className="guide-map-stack-item">
                {i > 0 && <span className="guide-map-flick">↑ flick ↓</span>}
                <span className="guide-map-tile">{view}</span>
              </span>
            ))}
          </span>
          <span className="guide-map-caption">{move.title}</span>
        </a>
        <a href={`#${jump.id}`} className="guide-map-node">
          <span className="guide-map-switcher" aria-hidden="true">
            {SWITCHER.map((row) => <span key={row}>{row}</span>)}
          </span>
          <span className="guide-map-caption">{jump.title}</span>
        </a>
        <a href={`#${hold.id}`} className="guide-map-node">
          <span className="guide-map-place" aria-hidden="true">
            {PLACE.map((place, i) => (
              <span key={place} className="guide-map-place-item">
                {i > 0 && <span className="guide-map-sep">›</span>}
                <span className={i === PLACE.length - 1 ? "guide-map-tile is-held" : "guide-map-tile"}>{place}</span>
              </span>
            ))}
          </span>
          <span className="guide-map-caption">{hold.title}</span>
        </a>
      </div>
    </nav>
  );
}
