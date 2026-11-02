import { lazy, Suspense, useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrambleText from "./ScrambleText";
import { heroContent, personalInfo } from "../data/portfolioData";

// Lazy-load the Three.js 3D centerpiece so three.js loads in an independent code chunk
const HeroScene = lazy(() => import("./HeroScene"));

export default function Hero() {
  const sectionRef = useRef(null);

  // Split name: first word solid bone, remaining words outlined stroke
  const nameParts = (personalInfo.name || "").trim().split(/\s+/);
  const firstName = nameParts[0] || "";
  const restName = nameParts.slice(1).join(" ") || "";

  useEffect(() => {
    // Skip motion entrance if reduced motion preference is active
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Staggered fade and slide entrance for text, controls, and frame
      gsap.fromTo(
        '[data-hero="fade"]',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          delay: 0.3,
        }
      );

      // Horizontal expand animation for the divider line
      gsap.fromTo(
        '[data-hero="divider"]',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.inOut",
          delay: 0.3,
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hud-grid min-h-screen flex flex-col justify-between overflow-hidden px-5 md:px-10 pt-24 pb-10"
    >
      <div className="w-full max-w-[1440px] mx-auto my-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-10 lg:gap-14">
        {/* LEFT COLUMN: Identity, Headlines, Introduction, and CTAs */}
        <div className="flex flex-col items-start gap-6">
          {/* Eyebrow Label */}
          <div
            data-hero="fade"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal"
          >
            {heroContent.eyebrow}
          </div>

          {/* Large Hero Heading: First word solid, Rest outlined */}
          <h1
            data-hero="fade"
            className="text-[clamp(3.2rem,11vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em]"
          >
            <span className="block text-bone">
              <ScrambleText text={firstName} trigger="mount" delay={200} />
            </span>
            {restName && (
              <span className="block text-transparent [-webkit-text-stroke:1.5px_#e8e6df]">
                <ScrambleText text={restName} trigger="mount" delay={500} />
              </span>
            )}
          </h1>

          {/* Animated Horizontal Accent Divider */}
          <div
            data-hero="divider"
            className="h-px w-full max-w-xl bg-bone/25 origin-left"
          />

          {/* Role and Intro Copy */}
          <div data-hero="fade" className="flex flex-col gap-2 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
              {personalInfo.role}
            </span>
            <p className="text-lg md:text-xl text-bone/85 leading-relaxed font-sans">
              {heroContent.intro}
            </p>
          </div>

          {/* Action Buttons */}
          <div data-hero="fade" className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href={heroContent.ctaPrimary.href}
              className="group inline-flex items-center gap-3 bg-signal text-ink hover:bg-bone transition-colors duration-200 font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 focus:outline-none"
            >
              <span>{heroContent.ctaPrimary.label}</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href={heroContent.ctaSecondary.href}
              className="inline-flex items-center justify-center border border-bone/30 text-bone hover:border-signal hover:text-signal transition-colors duration-200 font-mono text-xs font-semibold uppercase tracking-[0.2em] px-6 py-3.5 focus:outline-none"
            >
              <span>{heroContent.ctaSecondary.label}</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive 3D Signal Core Frame */}
        <div data-hero="fade" className="w-full">
          <div className="hud-frame relative border border-bone/10 bg-panel/40 h-[48vh] min-h-[320px] lg:h-[70vh] w-full overflow-hidden flex items-center justify-center">
            {/* Corner HUD Diagnostics */}
            <div className="absolute top-3 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none z-10">
              core.view — drag to rotate
            </div>
            <div className="absolute bottom-3 right-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none z-10">
              {personalInfo.city}
            </div>

            {/* Suspense-wrapped lazy 3D canvas */}
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>
        </div>
      </div>

      {/* BOTTOM HUD STRIP */}
      <div
        data-hero="fade"
        className="w-full max-w-[1440px] mx-auto mt-10 border-t border-bone/10 pt-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-dim"
      >
        <div className="flex items-center gap-2.5">
          <span
            className="w-2 h-2 rounded-full bg-signal animate-pulse"
            aria-hidden="true"
          />
          <span>{personalInfo.availability}</span>
        </div>
        <div className="hidden sm:block">Scroll ↓</div>
      </div>
    </section>
  );
}
