/** Generative ambient music — soft category-aware pads via Web Audio. */

import { getCategoryTheme, HOME_THEME, type CategoryTheme } from "./categoryThemes";
import { isMuted } from "@/lib/sound";

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let oscillators: OscillatorNode[] = [];
let lfo: OscillatorNode | null = null;
let activeTheme: string | null = null;
let fadeTimer: ReturnType<typeof setTimeout> | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function stopNodes() {
  for (const o of oscillators) {
    try {
      o.stop();
      o.disconnect();
    } catch {
      /* already stopped */
    }
  }
  oscillators = [];
  if (lfo) {
    try {
      lfo.stop();
      lfo.disconnect();
    } catch {
      /* noop */
    }
    lfo = null;
  }
}

function buildPad(theme: CategoryTheme) {
  const ac = getCtx();
  if (!ac || !masterGain || isMuted()) return;

  stopNodes();

  const freqs = [
    theme.ambientFreq,
    theme.ambientFreq * 1.5,
    theme.ambientFreq * 2,
  ];

  for (const freq of freqs) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.value = theme.ambientMod * 0.08;
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start();
    oscillators.push(osc);
  }

  lfo = ac.createOscillator();
  const lfoGain = ac.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = theme.ambientMod * 0.04;
  lfo.connect(lfoGain);
  lfoGain.connect(masterGain.gain);
  lfo.start();
}

function fadeTo(target: number, ms = 1200) {
  const ac = getCtx();
  if (!ac || !masterGain) return;
  const now = ac.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(masterGain.gain.value, now);
  masterGain.gain.linearRampToValueAtTime(target, now + ms / 1000);
}

export function startAmbientMusic(categorySlug?: string): void {
  if (isMuted()) return;
  const theme = categorySlug ? getCategoryTheme(categorySlug) : HOME_THEME;
  const key = theme.slug;
  if (activeTheme === key && oscillators.length > 0) return;

  activeTheme = key;
  if (fadeTimer) clearTimeout(fadeTimer);

  buildPad(theme);
  fadeTo(0.22, 1500);
}

export function stopAmbientMusic(): void {
  activeTheme = null;
  fadeTo(0, 800);
  fadeTimer = setTimeout(() => {
    stopNodes();
    fadeTimer = null;
  }, 900);
}

export function duckAmbientMusic(): void {
  fadeTo(0.06, 400);
}

export function restoreAmbientMusic(): void {
  if (activeTheme && !isMuted()) fadeTo(0.22, 600);
}
