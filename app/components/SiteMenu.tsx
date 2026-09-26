"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

// Every page of the site, grouped. The header keeps Atlas, Guide and Blog visible; this menu
// is the complete map, so the footer can stay a single calm line.
const GROUPS: { label: string; links: { href: string; label: string }[] }[] = [
  {
    label: "Explore",
    links: [
      { href: "/atlas", label: "Atlas" },
      { href: "/guide", label: "Guide" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    label: "Vynr",
    links: [
      { href: "/about", label: "About" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/revisions", label: "Revisions" },
    ],
  },
  {
    label: "Help",
    links: [
      { href: "/support", label: "Support" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close whenever the route changes: the layout persists across client navigation.
  // Adjusting state during render (not in an effect) is React's pattern for this.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Return focus to the button only if it was inside the menu; never pull it from elsewhere.
      const focusWasInside = rootRef.current?.contains(document.activeElement) ?? false;
      setOpen(false);
      if (focusWasInside) buttonRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="site-menu"
      onBlur={(event) => {
        // Tabbing out of the menu closes it, without moving the focus that is leaving.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="tap-target site-menu-button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path
            d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <nav id={panelId} className="site-menu-panel" aria-label="Site" hidden={!open}>
        {GROUPS.map((group) => (
          <div key={group.label} className="site-menu-group">
            <p className="site-menu-label">{group.label}</p>
            <ul>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="tap-target nav-link"
                    aria-current={pathname === link.href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
