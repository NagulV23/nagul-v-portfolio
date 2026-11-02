import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "./ScrambleText";
import { experience } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

export default function Journey() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const fillLineRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (fillLineRef.current) {
        fillLineRef.current.style.transform = "scaleY(1)";
      }
      itemRefs.current.forEach((item) => {
        if (item) {
          item.classList.add("is-on");
        }
      });
      return;
    }

    const ctx = gsap.context(() => {
      // Animate vertical progress line fill from top to bottom as user scrolls through the list
      if (fillLineRef.current && listRef.current) {
        gsap.fromTo(
          fillLineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 70%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      }

      // Track each item to toggle the 'is-on' class and fade in from x: 30
      itemRefs.current.forEach((item) => {
        if (!item) return;

        // Toggle active node state when fill line reaches this item
        ScrollTrigger.create({
          trigger: item,
          start: "top 65%",
          onEnter: () => item.classList.add("is-on"),
          onLeaveBack: () => item.classList.remove("is-on"),
        });

        // Entrance fade and horizontal slide animation (once: true)
        gsap.fromTo(
          item,
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="w-full px-5 md:px-10 py-28 md:py-40"
    >
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">
        {/* LEFT COLUMN: Sticky Header on Large Screens */}
        <div className="lg:sticky lg:top-28 lg:self-start flex flex-col gap-4">
          <ScrambleText
            text="03 / Journey"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold"
          />
          <h2 className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-bone">
            Where I&apos;ve been learning and building.
          </h2>
        </div>

        {/* RIGHT COLUMN: Chronological Timeline with Scrubbed Filling Line */}
        <div className="w-full">
          <ol ref={listRef} className="relative pl-10 space-y-16 list-none">
            {/* Background Base Line */}
            <div
              className="absolute top-0 bottom-0 left-[7px] w-px bg-bone/15 pointer-events-none"
              aria-hidden="true"
            />

            {/* Signal Orange Filling Line */}
            <div
              ref={fillLineRef}
              className="absolute top-0 bottom-0 left-[7px] w-px bg-signal origin-top pointer-events-none"
              style={{ transform: "scaleY(0)" }}
              aria-hidden="true"
            />

            {experience.map((item, index) => (
              <li
                key={`${item.period}-${item.role}`}
                ref={(el) => (itemRefs.current[index] = el)}
                className="relative flex flex-col gap-2.5 group [&.is-on_.node]:bg-signal [&.is-on_.node]:scale-100"
              >
                {/* 15px Square Node Centered on Timeline */}
                <div
                  className="node absolute -left-10 top-1.5 w-[15px] h-[15px] border border-signal bg-ink scale-75 transition-all duration-300 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Period Badge */}
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-dim">
                  {item.period}
                </span>

                {/* Role Title */}
                <h3 className="text-2xl md:text-3xl font-bold text-bone tracking-tight">
                  {item.role}
                </h3>

                {/* Organisation */}
                <span className="font-mono text-sm text-signal font-medium">
                  {item.org}
                </span>

                {/* Description */}
                <p className="text-bone/70 text-base leading-relaxed font-sans max-w-2xl pt-1">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
