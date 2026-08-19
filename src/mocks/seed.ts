// Small deterministic PRNG so mock data is stable across renders/reloads
// instead of re-randomizing on every call (which would make charts jitter).
export function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  let state = h || 1;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return (state % 10000) / 10000;
  };
}

export function pick<T>(rand: () => number, arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => rand() - 0.5);
  return shuffled.slice(0, count);
}

export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}
