"use client";

import { useEffect, useState, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

// ── Dark mode: white & sky-blue stars on a near-black background ─────────────
const DARK_OPTIONS: ISourceOptions = {
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
    size: { value: { min: 0.4, max: 2.2 } },
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
        trail: { enable: true, length: 18, fill: { color: "#0ea5e9" } },
        life: { count: 1, duration: { value: { min: 0.4, max: 0.8 } } },
      },
    },
  ],
};

// ── Light mode: slate-blue & indigo dots visible on an off-white background ──
const LIGHT_OPTIONS: ISourceOptions = {
  fullScreen: false,
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  particles: {
    number: { value: 110, density: { enable: true } },
    color: { value: ["#38bdf8", "#818cf8", "#94a3b8", "#0ea5e9"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.15, max: 0.45 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: { value: { min: 0.5, max: 2.5 } },
    move: {
      enable: true,
      speed: 0.08,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
    twinkle: {
      particles: { enable: true, frequency: 0.05, opacity: 0.6 },
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
        color: { value: "#0284c7" },
        shape: { type: "circle" },
        opacity: { value: 0.7 },
        size: { value: { min: 1, max: 2 } },
        move: {
          enable: true,
          speed: 30,
          direction: "bottom-left",
          straight: true,
          outModes: { default: "destroy" },
        },
        trail: { enable: true, length: 18, fill: { color: "#38bdf8" } },
        life: { count: 1, duration: { value: { min: 0.4, max: 0.8 } } },
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
    <>
      {/* Dark mode particles — hidden in light mode */}
      <Particles
        id="star-bg-dark"
        className="pointer-events-none fixed inset-0 hidden dark:block"
        style={{ zIndex: 0 }}
        options={DARK_OPTIONS}
      />
      {/* Light mode particles — hidden in dark mode */}
      <Particles
        id="star-bg-light"
        className="pointer-events-none fixed inset-0 block dark:hidden"
        style={{ zIndex: 0 }}
        options={LIGHT_OPTIONS}
      />
    </>
  );
}

// memo prevents re-renders when the parent state changes (e.g. typing in a form)
export const StarBackground = memo(StarBackgroundInner);
