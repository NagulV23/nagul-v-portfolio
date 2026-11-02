import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Scene & Camera setup
    const scene = new THREE.Scene();

    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);
    camera.position.z = 7;

    // WebGL Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    // Group to hold all 3D centerpiece elements
    const group = new THREE.Group();
    scene.add(group);

    // 1. Outer Shell: Edges of IcosahedronGeometry(1.9, 1) in Signal Orange
    const outerGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const outerEdges = new THREE.EdgesGeometry(outerGeo);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0xff5b1f,
      transparent: true,
      opacity: prefersReducedMotion ? 0.9 : 0,
    });
    const outerShell = new THREE.LineSegments(outerEdges, outerMat);
    group.add(outerShell);

    // 2. Inner Core: Dense constellation points of IcosahedronGeometry(1.15, 4) in bone color
    const innerGeo = new THREE.IcosahedronGeometry(1.15, 4);
    const innerMat = new THREE.PointsMaterial({
      color: 0xe8e6df,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
    });
    const innerPoints = new THREE.Points(innerGeo, innerMat);
    group.add(innerPoints);

    // 3. Orbit Ring: 128-point EllipseCurve tilted at PI / 2.4
    const curve = new THREE.EllipseCurve(0, 0, 2.7, 2.7, 0, 2 * Math.PI, false, 0);
    const points2D = curve.getPoints(128);
    const ringGeo = new THREE.BufferGeometry().setFromPoints(points2D);
    const ringMat = new THREE.LineBasicMaterial({
      color: 0xe8e6df,
      transparent: true,
      opacity: 0.18,
    });
    const orbitRing = new THREE.LineLoop(ringGeo, ringMat);
    orbitRing.rotation.x = Math.PI / 2.4;
    group.add(orbitRing);

    // Interaction states
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let baseRotationY = 0;
    let baseRotationX = 0;

    // Window pointermove: calculate tilt towards cursor, or spin while dragging
    const onWindowPointerMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        baseRotationY += deltaX * 0.01;
        baseRotationX += deltaY * 0.01;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      } else {
        const normalisedX = (e.clientX / window.innerWidth) * 2 - 1;
        const normalisedY = (e.clientY / window.innerHeight) * 2 - 1;
        targetTiltY = normalisedX * 0.4;
        targetTiltX = normalisedY * 0.25;
      }
    };

    // Canvas pointerdown: start dragging
    const onCanvasPointerDown = (e) => {
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    // Window pointerup: stop dragging
    const onWindowPointerUp = () => {
      isDragging = false;
    };

    renderer.domElement.addEventListener("pointerdown", onCanvasPointerDown);
    window.addEventListener("pointermove", onWindowPointerMove);
    window.addEventListener("pointerup", onWindowPointerUp);

    // Window resize handler
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // IntersectionObserver to pause rendering when off-screen
    let isVisible = true;
    let animationFrameId = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisible;
          isVisible = entry.isIntersecting;
          if (!wasVisible && isVisible) {
            animate();
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Materialise intro curve on load (from scale 0.6 to 1 over 1000ms)
    const introStartTime = performance.now();
    const introDuration = 1000;

    if (prefersReducedMotion) {
      group.scale.set(1, 1, 1);
      outerMat.opacity = 0.9;
    } else {
      group.scale.set(0.6, 0.6, 0.6);
    }

    const clock = new THREE.Clock();

    // Main animation loop
    const animate = () => {
      if (!isVisible) return;
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Intro materialise animation
      if (!prefersReducedMotion) {
        const elapsed = performance.now() - introStartTime;
        if (elapsed < introDuration) {
          const progress = Math.min(elapsed / introDuration, 1);
          // Cubic ease-out
          const ease = 1 - Math.pow(1 - progress, 3);
          const currentScale = 0.6 + 0.4 * ease;
          group.scale.set(currentScale, currentScale, currentScale);
          outerMat.opacity = 0.9 * ease;
        } else {
          group.scale.set(1, 1, 1);
          outerMat.opacity = 0.9;
        }
      }

      // Auto-spin on Y axis unless reduced motion or user is actively dragging
      if (!prefersReducedMotion && !isDragging) {
        baseRotationY += 0.0025;
      }

      // Rotate inner points in reverse direction
      innerPoints.rotation.y = -time * 0.15;

      // Group eases toward target rotation (factor 0.06)
      const destX = baseRotationX + targetTiltX;
      const destY = baseRotationY + targetTiltY;
      group.rotation.x += (destX - group.rotation.x) * 0.06;
      group.rotation.y += (destY - group.rotation.y) * 0.06;

      renderer.render(scene, camera);
    };

    // Kick off animation loop
    animate();

    // Comprehensive cleanup on unmount
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      observer.disconnect();

      renderer.domElement.removeEventListener("pointerdown", onCanvasPointerDown);
      window.removeEventListener("pointermove", onWindowPointerMove);
      window.removeEventListener("pointerup", onWindowPointerUp);
      window.removeEventListener("resize", onResize);

      // Dispose geometries
      outerGeo.dispose();
      outerEdges.dispose();
      innerGeo.dispose();
      ringGeo.dispose();

      // Dispose materials
      outerMat.dispose();
      innerMat.dispose();
      ringMat.dispose();

      // Dispose renderer & release WebGL context
      renderer.dispose();
      renderer.forceContextLoss();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab active:cursor-grabbing relative"
      role="img"
      aria-label="Interactive 3D shape — drag to rotate"
      data-cursor="hot"
    />
  );
}
