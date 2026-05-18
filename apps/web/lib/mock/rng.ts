// M0.S3 · T-M0.S3-02 · Deterministic seeded PRNG for stable mock data across builds.
// xmur3 + sfc32 — public-domain mini PRNG. Each call to next() returns [0,1).

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function sfc32(a: number, b: number, c: number, d: number) {
  return () => {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    const t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    const r = (t + d) | 0;
    c = (c + r) | 0;
    return (r >>> 0) / 4294967296;
  };
}

export function makeRng(seed: string) {
  const s = xmur3(seed);
  const rand = sfc32(s(), s(), s(), s());
  return {
    next: rand,
    int: (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min,
    pick: <T,>(arr: readonly T[]): T => arr[Math.floor(rand() * arr.length)],
    range: (min: number, max: number) => min + rand() * (max - min),
    clamp01: (v: number) => Math.max(0, Math.min(1, v)),
  };
}

export type Rng = ReturnType<typeof makeRng>;
