import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";

export default function ScrambleText({
  text = "",
  as: Tag = "span",
  className = "",
  delay = 0,
  speed = 30,
  trigger = "view",
}) {
  const [display, setDisplay] = useState(text);
  const containerRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    // If the user prefers reduced motion, skip the scramble animation
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    let intervalId = null;
    let timeoutId = null;
    let observer = null;

    const playScramble = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      let frame = 0;
      const totalChars = text.length;

      intervalId = setInterval(() => {
        // Resolve one more character every 2 frames from left to right
        const resolvedCount = Math.floor(frame / 2);

        if (resolvedCount >= totalChars) {
          setDisplay(text);
          clearInterval(intervalId);
          return;
        }

        const scrambled = text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < resolvedCount) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");

        setDisplay(scrambled);
        frame++;
      }, speed);
    };

    const startWithDelay = () => {
      if (delay > 0) {
        timeoutId = setTimeout(playScramble, delay);
      } else {
        playScramble();
      }
    };

    if (trigger === "mount") {
      startWithDelay();
    } else {
      // Trigger when 40% of the element enters the viewport
      const element = containerRef.current;
      if (element && "IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                observer.disconnect();
                startWithDelay();
              }
            });
          },
          { threshold: 0.4 }
        );
        observer.observe(element);
      } else {
        startWithDelay();
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      if (observer) observer.disconnect();
    };
  }, [text, delay, speed, trigger]);

  return (
    <Tag ref={containerRef} aria-label={text} className={className}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}
