export interface ParsedNextAction {
  title: string;
  reason: string;
  impact: string;
}

export function parseNextAction(text: string): ParsedNextAction {
  const titleMatch = text.match(/Titre\s*:\s*(.+)/i);
  const reasonMatch = text.match(/Raison\s*:\s*(.+)/i);
  const impactMatch = text.match(/Impact\s*:\s*(.+)/i);

  return {
    title: titleMatch?.[1]?.trim() ?? 'Vérifier la situation du projet',
    reason: reasonMatch?.[1]?.trim() ?? 'Un signal a été détecté sur ce projet.',
    impact: impactMatch?.[1]?.trim() ?? 'Permet de garder le projet sur la bonne voie.',
  };
}
