import { describe, expect, it } from 'vitest';
import { BMC_BLOCKS, BMC_LABELS, buildBmcBlocks } from './bmc.logic.js';

describe('buildBmcBlocks', () => {
  it('renvoie les 9 blocs dans l’ordre, vides par défaut', () => {
    const result = buildBmcBlocks([]);
    expect(result.blocks.map((b) => b.block)).toEqual([...BMC_BLOCKS]);
    expect(result.blocks).toHaveLength(9);
    expect(result.filled).toBe(0);
  });

  it('remplit les blocs existants et compte les complétés', () => {
    const result = buildBmcBlocks([
      { block: 'CANAUX', content: 'WhatsApp' },
      { block: 'REVENUS', content: '   ' },
    ]);
    expect(result.blocks.find((b) => b.block === 'CANAUX')?.content).toBe('WhatsApp');
    expect(result.filled).toBe(1);
  });

  it('possède un libellé pour chaque bloc', () => {
    for (const block of BMC_BLOCKS) expect(BMC_LABELS[block]).toBeTruthy();
  });
});
