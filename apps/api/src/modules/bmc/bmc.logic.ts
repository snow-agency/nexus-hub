export const BMC_BLOCKS = [
  'PROPOSITION_VALEUR',
  'SEGMENTS_CLIENTS',
  'CANAUX',
  'RELATIONS_CLIENTS',
  'REVENUS',
  'RESSOURCES_CLES',
  'ACTIVITES_CLES',
  'PARTENAIRES',
  'STRUCTURE_COUTS',
] as const;

export type BmcBlockName = (typeof BMC_BLOCKS)[number];

export const BMC_LABELS: Record<BmcBlockName, string> = {
  PROPOSITION_VALEUR: 'Proposition de valeur',
  SEGMENTS_CLIENTS: 'Segments clients',
  CANAUX: 'Canaux',
  RELATIONS_CLIENTS: 'Relations clients',
  REVENUS: 'Revenus',
  RESSOURCES_CLES: 'Ressources clés',
  ACTIVITES_CLES: 'Activités clés',
  PARTENAIRES: 'Partenaires',
  STRUCTURE_COUTS: 'Structure de coûts',
};

export function buildBmcBlocks(rows: Array<{ block: string; content: string }>) {
  const byBlock = new Map(rows.map((row) => [row.block, row.content]));
  const blocks = BMC_BLOCKS.map((block) => ({ block, content: byBlock.get(block) ?? '' }));
  const filled = blocks.filter((item) => item.content.trim() !== '').length;
  return { blocks, filled };
}
