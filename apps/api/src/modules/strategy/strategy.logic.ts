export function computeMarketProgress(etapes: Array<{ done: boolean }>): number {
  if (etapes.length === 0) return 0;
  const done = etapes.filter((etape) => etape.done).length;
  return Math.round((done / etapes.length) * 100);
}

export function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}
