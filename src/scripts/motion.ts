// Shared motion primitives built on GSAP + ScrollTrigger.
// All motion respects prefers-reduced-motion (pulls the no-op path).
//
// ScrollTrigger is loaded lazily via dynamic import() inside the scroll-
// dependent helpers only. Pages that call revealHero() alone (which uses
// GSAP core but no ScrollTrigger) do not download the ScrollTrigger chunk.
// This keeps /privacy, /terms, /contact, /404 and similar static pages
// under the smaller baseline bundle.

import { gsap } from 'gsap';

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lazy loader. Caches the ScrollTrigger module so repeat callers pay once.
let scrollTriggerPromise: Promise<typeof import('gsap/ScrollTrigger').ScrollTrigger> | null = null;
function loadScrollTrigger() {
  if (!scrollTriggerPromise) {
    scrollTriggerPromise = import('gsap/ScrollTrigger').then((mod) => {
      gsap.registerPlugin(mod.ScrollTrigger);
      return mod.ScrollTrigger;
    });
  }
  return scrollTriggerPromise;
}

/**
 * revealHero. one-shot staggered entrance on page load.
 * Reveals direct descendants of the container in order:
 *   kicker → h1 → subhead → cta row → trust line
 * Total duration ~900ms, ease out-quad.
 * Does NOT pull ScrollTrigger. Safe for static pages.
 */
export function revealHero(selector: string): void {
  if (reducedMotion()) return;
  const el = document.querySelector<HTMLElement>(selector);
  if (!el) return;

  const targets = [
    el.querySelector('.kicker'),
    el.querySelector('h1'),
    el.querySelector('h1 + p'),
    el.querySelector('.hero-cta-row'),
    el.querySelector('.hero-trust'),
    el.querySelector('.signals-chip'),
    el.querySelector('.product-pane-wrap'),
  ].filter((n): n is HTMLElement => n instanceof HTMLElement);

  if (targets.length === 0) return;

  gsap.set(targets, { opacity: 0, y: 16 });
  gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power2.out',
    stagger: 0.08,
    delay: 0.05,
  });
}

/**
 * revealCards. staggered reveal of card-like elements when they enter
 * the viewport. Uses ScrollTrigger.batch for performance (single observer
 * instead of N instances). Once-only; doesn't re-animate on re-entry.
 * Pulls ScrollTrigger via dynamic import.
 */
export async function revealCards(
  selector: string,
  options: {
    start?: string;
    stagger?: number;
    duration?: number;
    distance?: number;
  } = {}
): Promise<void> {
  if (reducedMotion()) return;
  const targets = document.querySelectorAll<HTMLElement>(selector);
  if (targets.length === 0) return;

  const ScrollTrigger = await loadScrollTrigger();

  gsap.set(targets, { opacity: 0, y: options.distance ?? 20 });

  ScrollTrigger.batch(selector, {
    start: options.start ?? 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: options.duration ?? 0.6,
        ease: 'power2.out',
        stagger: options.stagger ?? 0.1,
        overwrite: true,
      });
    },
  });
}

/**
 * pipelineScrubIndicator. adds a Signal-hued progress bar that fills
 * horizontally as the user scrubs through a pinned ScrollTrigger
 * animation. Returns a cleanup function (as a promise).
 *
 * The caller is responsible for creating the bar element in markup
 * (keep separate from the tween target). Pass the bar's selector.
 * Pulls ScrollTrigger via dynamic import.
 */
export async function pipelineScrubIndicator(
  triggerSelector: string,
  barSelector: string
): Promise<(() => void) | void> {
  if (reducedMotion()) return;
  const trigger = document.querySelector<HTMLElement>(triggerSelector);
  const bar = document.querySelector<HTMLElement>(barSelector);
  if (!trigger || !bar) return;

  const ScrollTrigger = await loadScrollTrigger();

  const st = ScrollTrigger.create({
    trigger,
    start: 'top top',
    end: () => '+=' + (trigger.scrollWidth - window.innerWidth),
    scrub: 1,
    onUpdate: (self) => {
      bar.style.transform = `scaleX(${self.progress})`;
    },
  });

  return () => st.kill();
}
