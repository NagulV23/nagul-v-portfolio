import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "./ScrambleText";
import { aboutContent, personalInfo, skillGroups } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

// Eagerly resolve candidate portrait image files from src/assets/about/
const portraitModules = import.meta.glob(
  "../assets/about/about-portrait.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" }
);
const portraitSrc = Object.values(portraitModules)[0] || null;

export default function About() {
  const sectionRef = useRef(null);
  const counterRefs = useRef([]);

  useEffect(() => {
    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      aboutContent.stats.forEach((stat, i) => {
        if (counterRefs.current[i]) {
          counterRefs.current[i].textContent = stat.value;
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Reveal elements when the top of the section reaches 75% of the viewport (once: true)
      gsap.fromTo(
        '[data-about="reveal"]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // Animate stat counters from 0 to their target numeric value
      aboutContent.stats.forEach((stat, i) => {
        const targetEl = counterRefs.current[i];
        if (!targetEl) return;

        const counterObj = { val: 0 };
        gsap.to(counterObj, {
          val: stat.value,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
          onUpdate: () => {
            targetEl.textContent = Math.round(counterObj.val);
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Label with ScrambleText */}
        <div className="mb-10" data-about="reveal">
          <ScrambleText
            text={aboutContent.label}
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold"
          />
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
          {/* LEFT: Portrait in HUD Frame with signal tint */}
          <div data-about="reveal" className="flex justify-center lg:justify-start">
            <div className="hud-frame relative aspect-[4/5] w-full max-w-[420px] border border-bone/10 bg-panel overflow-hidden">
              {portraitSrc ? (
                <img
                  src={portraitSrc}
                  alt={`${personalInfo.name} — ${personalInfo.role}`}
                  className="w-full h-full object-cover grayscale contrast-125 block"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-mono text-xs uppercase tracking-widest text-dim p-4 text-center">
                  [about-portrait missing]
                </div>
              )}

              {/* Orange tint layer with mix-blend-multiply */}
              <div
                className="absolute inset-0 bg-signal mix-blend-multiply opacity-25 pointer-events-none"
                aria-hidden="true"
              />

              {/* Bottom-left diagnostic brand tag */}
              <div className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.25em] text-dim pointer-events-none z-10">
                ID · {personalInfo.brandName}
              </div>
            </div>
          </div>

          {/* RIGHT: Heading, Bio, Animated Stats, and Skill Modules */}
          <div className="flex flex-col gap-8">
            {/* Heading */}
            <h2
              data-about="reveal"
              className="text-[clamp(2.2rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone"
            >
              {aboutContent.heading}
            </h2>

            {/* Paragraph / Bio */}
            <p
              data-about="reveal"
              className="text-lg md:text-xl leading-relaxed text-bone/75 max-w-2xl font-sans"
            >
              {aboutContent.paragraph}
            </p>

            {/* Stats dl grid */}
            <dl
              data-about="reveal"
              className="grid grid-cols-3 gap-4 border-y border-bone/10 py-8 my-2"
            >
              {aboutContent.stats.map((stat, i) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dd className="text-4xl md:text-6xl font-bold text-bone flex items-baseline">
                    <span ref={(el) => (counterRefs.current[i] = el)}>0</span>
                    {stat.suffix && (
                      <span className="text-signal ml-0.5">{stat.suffix}</span>
                    )}
                  </dd>
                  <dt className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-dim">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>

            {/* Technical Skill Groups */}
            <div
              data-about="reveal"
              className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-bone/10 border border-bone/10"
            >
              {skillGroups.map((group, index) => {
                const groupNumber = String(index + 1).padStart(2, "0");
                return (
                  <div
                    key={group.title}
                    className="bg-ink p-6 hover:bg-panel transition-colors duration-200 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-signal font-semibold">
                        {group.title}
                      </span>
                      <span className="font-mono text-xs text-dim">
                        {groupNumber}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <span
                          key={skill}
                          className="border border-bone/15 px-2.5 py-1 font-mono text-xs text-bone/90"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
