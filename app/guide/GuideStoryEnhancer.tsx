"use client";

import { useEffect } from "react";

// Progressive enhancement for the guide's story sections (spec §6). The server markup is the
// complete page; this only toggles class names. Wide screens (≥ 900 × 640 px) get the pinned phone
// that follows the step being read; narrow screens and no-JavaScript keep the linear layout.
// Reduce Motion is honoured in CSS: the highlighting stays, every animation is removed.
// Wide and tall enough for the 540 px pinned phone plus its 80 px offset; otherwise linear.
const WIDE = "(min-width: 900px) and (min-height: 640px)";
// The reading line is the middle tenth of the viewport. Percent root margins are not used:
// how they resolve against the viewport varies, so the band is computed in pixels from the
// window height and rebuilt when the window is resized.
const READING_BAND = 0.45;

function activate(step: HTMLElement) {
  const section = step.closest<HTMLElement>("[data-guide-story]");
  if (!section) return;
  const shot = step.dataset.shot;
  const n = step.dataset.n;
  section.querySelectorAll(".guide-step.is-on").forEach((el) => el.classList.remove("is-on"));
  step.classList.add("is-on");
  section.querySelectorAll<HTMLElement>(".guide-phone-shot").forEach((frame) => {
    frame.classList.toggle("is-shown", frame.dataset.shot === shot);
  });
  section.querySelectorAll(".guide-phone .guide-c.is-on").forEach((el) => el.classList.remove("is-on"));
  section
    .querySelector(`.guide-phone-shot[data-shot="${shot}"] .guide-c[data-n="${n}"]`)
    ?.classList.add("is-on");
  section.querySelector(".guide-phone")?.classList.add("has-active");
}

export default function GuideStoryEnhancer() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || !window.matchMedia) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-guide-story]"));
    const wide = window.matchMedia(WIDE);
    const applyWidth = () => sections.forEach((s) => s.classList.toggle("is-enhanced", wide.matches));
    applyWidth();
    wide.addEventListener("change", applyWidth);

    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer?.disconnect();
      const inset = Math.round(window.innerHeight * READING_BAND);
      observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && activate(entry.target as HTMLElement)),
        { rootMargin: `-${inset}px 0px -${inset}px 0px` },
      );
      document.querySelectorAll<HTMLElement>(".guide-step").forEach((step) => observer?.observe(step));
    };
    observe();
    window.addEventListener("resize", observe);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observe);
      wide.removeEventListener("change", applyWidth);
      sections.forEach((s) => s.classList.remove("is-enhanced"));
    };
  }, []);
  return null;
}
