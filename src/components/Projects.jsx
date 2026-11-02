import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrambleText from "./ScrambleText";
import { projects } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

// Eagerly load all project cover images from src/assets/projects/
const projectImages = import.meta.glob(
  "../assets/projects/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" }
);

function getProjectImage(projectId) {
  for (const [path, module] of Object.entries(projectImages)) {
    const filename = path.split("/").pop().split(".")[0];
    if (filename === projectId) {
      return module;
    }
  }
  return null;
}

function ProjectCard({ project }) {
  const coverSrc = getProjectImage(project.id);

  return (
    <article
      className="group border border-bone/10 bg-panel/60 w-full md:w-[min(560px,42vw)] shrink-0 flex flex-col justify-between overflow-hidden"
      data-cursor="hot"
    >
      {/* Cover Area with Grayscale -> Full Color Scale Hover */}
      <div className="relative aspect-[16/10] md:aspect-[16/8] border-b border-bone/10 bg-ink overflow-hidden">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.04] block"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full hud-grid flex items-center justify-center p-6">
            <span className="font-mono text-xs uppercase tracking-widest text-dim">
              {project.id}
            </span>
          </div>
        )}

        {/* Top-Left Metric Badge */}
        <div className="absolute top-3 left-3 bg-ink/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-signal z-10 border border-bone/10 backdrop-blur-sm">
          {project.number} / {project.year}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 md:p-8 flex flex-col flex-1 justify-between gap-6">
        <div className="flex flex-col gap-3">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-bone group-hover:text-signal transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-sm md:text-base text-bone/70 leading-relaxed font-sans">
            {project.description}
          </p>

          {/* Hashtag Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-dim"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-bone/10">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-signal text-ink hover:bg-bone transition-colors duration-200 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 focus:outline-none"
            >
              Live ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-bone/30 text-bone hover:border-signal hover:text-signal transition-colors duration-200 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] px-4 py-2.5 focus:outline-none"
            >
              Code ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Pin section and scroll horizontally only on desktop screens with standard motion
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const track = trackRef.current;
        const section = sectionRef.current;
        const progressBar = progressRef.current;
        if (!track || !section) return;

        const getDistance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + 80);

        gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressBar) {
                gsap.set(progressBar, { scaleX: self.progress });
              }
            },
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="w-full overflow-hidden py-24 md:py-0 md:h-screen md:flex md:flex-col md:justify-center md:pt-20 md:pb-6"
    >
      {/* Header Row */}
      <div className="max-w-[1440px] w-full mx-auto px-5 md:px-10 mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <ScrambleText
            text="02 / Selected work"
            className="font-mono text-xs uppercase tracking-[0.3em] text-signal font-semibold block mb-2"
          />
          <h2 className="text-[clamp(2.4rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.03em] text-bone">
            Projects
          </h2>
        </div>
        <div className="hidden md:block font-mono text-xs text-dim tracking-wider uppercase">
          {projects.length} projects · scroll →
        </div>
      </div>

      {/* Cards Track: Mobile stacked, Desktop horizontal row */}
      <div
        ref={trackRef}
        className="flex flex-col gap-6 md:flex-row md:w-max md:gap-8 px-5 md:px-10"
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Desktop Scroll Progress Indicator */}
      <div className="hidden md:block max-w-[1440px] w-full mx-auto px-5 md:px-10 mt-8">
        <div className="w-full h-0.5 bg-bone/10 relative overflow-hidden">
          <div
            ref={progressRef}
            className="absolute inset-y-0 left-0 w-full bg-signal origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
