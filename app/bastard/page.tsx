import type { Metadata } from "next";
import { Homemade_Apple } from "next/font/google";
import WineStains from "./WineStains";

// The one hand-written line on the page. next/font self-hosts the file at
// build time, so no request leaves for Google when the page is read.
const pen = Homemade_Apple({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--manifesto-pen",
});

// An unlinked page: not in the sitemap, not in navigation, not indexed.
export const metadata: Metadata = {
  title: "The Wine Bastard Manifesto",
  description: "What a Wine Bastard believes about wine, knowledge, memory and time.",
  robots: { index: false, follow: false },
};

export default function BastardPage() {
  return (
    <article className={`manifesto ${pen.variable}`} aria-labelledby="manifesto-title">
      <div className="manifesto-sheet">
        <WineStains />
        <h1 id="manifesto-title" className="manifesto-title-hidden">The Wine Bastard Manifesto</h1>

        <div className="manifesto-verse">
          <div className="manifesto-stamp-row">
            <div className="manifesto-stamp" aria-hidden="true">
              <span className="manifesto-stamp-main">Wine Bastard</span>
              <span className="manifesto-stamp-sub">Manifesto</span>
            </div>
          </div>

          <p className="manifesto-carries">
            Every bottle carries
            <span>a place,</span>
            <span>a maker,</span>
            <span>a history</span>
            <span>and a future.</span>
          </p>

          <p>What it means is yours.</p>

          <p>
            Know more.
            <br />
            Make no one feel less.
          </p>

          <p>
            A famous bottle can disappoint.
            <br />
            A humble one can stop the room.
            <br />
            You may say so.
          </p>

          <p>
            Wine changes in the bottle.
            <br />
            What we know should not stand still.
          </p>

          <p>
            The machine minds the cellar.
            <br />
            You mind the moments.
          </p>

          <p>
            Know where it came from.
            <br />
            Know where you put it.
            <br />
            Know when to leave it there.
          </p>

          <p>
            Some evenings need remembering.
            <br />
            Write them down before they improve with age.
          </p>

          <p className="manifesto-margin">Margins are for writing in.</p>

          <p>Your cellar is nobody else&rsquo;s business.</p>

          <p className="manifesto-close">Enjoy it mightily.</p>
        </div>
      </div>
    </article>
  );
}
