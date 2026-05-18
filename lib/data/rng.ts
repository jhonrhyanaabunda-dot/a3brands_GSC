/**
 * Deterministic seeded RNG helpers. Same seed → same sequence.
 * Used so dashboard data is stable across reloads.
 */

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) || 1;
}

export function makeRng(seed: number | string) {
  let state = (typeof seed === "string" ? hashString(seed) : seed) >>> 0;
  if (state === 0) state = 1;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

export function range(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}

export function rangeInt(rng: () => number, min: number, max: number) {
  return Math.floor(range(rng, min, max + 1));
}

export function rnd(rng: () => number, decimals: number) {
  const v = rng();
  return Number(v.toFixed(decimals));
}
