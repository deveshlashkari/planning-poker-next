"use client";

import { useEffect, useState, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

// Defined outside the component so the reference never changes between renders.
// tsparticles does a deep-equal check on options — a new object reference on
// every render causes it to fully restart (the "rotating" / flickering you see).
const PARTICLES_OPTIONS: ISourceOptions = {
  fullScreen: false,
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  particles: {
    number: { value: 120, density: { enable: true } },
    color: { value: ["#ffffff", "#bae6fd", "#7dd3fc"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.1, max: 0.6 },
      animation: { enable: true, speed: 0.6, sync: false },
    },
    size: {
      value: { min: 0.4, max: 2.2 },
    },
    move: {
      enable: true,
      speed: 0.08,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
    twinkle: {
      particles: { enable: true, frequency: 0.05, opacity: 1 },
    },
  },
  emitters: [
    {
      direction: "bottom-left",
      rate: { delay: 2.5, quantity: 1 },
      position: { x: 80, y: 10 },
      size: { width: 40, height: 0 },
      particles: {
        number: { value: 0 },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.9 },
        size: { value: { min: 1, max: 2 } },
        move: {
          enable: true,
          speed: 30,
          direction: "bottom-left",
          straight: true,
          outModes: { default: "destroy" },
        },
        trail: {
          enable: true,
          length: 18,
          fill: { color: "#0ea5e9" },
        },
        life: {
          count: 1,
          duration: { value: { min: 0.4, max: 0.8 } },
        },
      },
    },
  ],
};

function StarBackgroundInner() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="star-bg"
      className="pointer-events-none fixed inset-0 hidden dark:block"
      style={{ zIndex: 0 }}
      options={PARTICLES_OPTIONS}
    />
  );
}

// memo prevents re-renders when the parent state changes (e.g. typing in a form)
export const StarBackground = memo(StarBackgroundInner);
