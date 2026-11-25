import { describe, expect, it } from 'vitest';
import { clampProgress, computeMarketProgress } from './strategy.logic.js';

describe('computeMarketProgress', () => {
  it('renvoie 0 sans étape', () => {
    expect(computeMarketProgress([])).toBe(0);
  });

  it('calcule le pourcentage arrondi', () => {
    expect(computeMarketProgress([{ done: true }, { done: false }, { done: false }])).toBe(33);
    expect(computeMarketProgress([{ done: true }, { done: true }])).toBe(100);
  });
});

describe('clampProgress', () => {
  it('borne entre 0 et 100', () => {
    expect(clampProgress(-5)).toBe(0);
    expect(clampProgress(140)).toBe(100);
    expect(clampProgress(54.6)).toBe(55);
  });
});
