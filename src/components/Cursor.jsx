import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Only activate cursor on devices with a real fine pointer (mouse) and no reduced motion preference
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isFinePointer || prefersReducedMotion) return;

    document.body.classList.add("has-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Center both cursor elements and make them visible
    gsap.set([dot, ring], {
      xPercent: -50,
      yPercent: -50,
      opacity: 1,
    });

    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");

    // Ring follows smoothly with power3.out easing
    const quickRingX = gsap.quickTo(ring, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    const quickRingY = gsap.quickTo(ring, "y", {
      duration: 0.35,
      ease: "power3.out",
    });

    const handlePointerMove = (e) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      quickRingX(e.clientX);
      quickRingY(e.clientY);
    };

    const handlePointerOver = (e) => {
      const interactiveTarget = e.target.closest(
        'a, button, input, textarea, [data-cursor="hot"]'
      );
      if (interactiveTarget) {
        gsap.to(ring, {
          scale: 1.8,
          borderColor: "#ff5b1f",
          duration: 0.25,
          ease: "power2.out",
        });
      } else {
        gsap.to(ring, {
          scale: 1,
          borderColor: "rgba(232, 230, 223, 0.6)",
          duration: 0.25,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-signal pointer-events-none z-[999] opacity-0"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-bone/60 pointer-events-none z-[999] opacity-0"
      />
    </>
  );
}
