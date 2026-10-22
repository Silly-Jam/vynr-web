"use client";

import { useEffect } from "react";

// Progressive enhancement for the guide's story sections (spec §6). The server markup is the
// complete page; this only toggles class names. Wide screens (≥ 900 px) get the pinned phone
// that follows the step being read; narrow screens and no-JavaScript keep the linear layout.
// Reduce Motion is honoured in CSS: the highlighting stays, every animation is removed.
const WIDE = "(min-width: 900px)";
const READING_LINE = "-45% 0px -45% 0px";

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

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && activate(entry.target as HTMLElement)),
      { rootMargin: READING_LINE },
    );
    document.querySelectorAll<HTMLElement>(".guide-step").forEach((step) => observer.observe(step));

    return () => {
      observer.disconnect();
      wide.removeEventListener("change", applyWidth);
      sections.forEach((s) => s.classList.remove("is-enhanced"));
    };
  }, []);
  return null;
}
