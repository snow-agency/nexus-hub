import { Signal, SignalSeverity } from '@prisma/client';

const severityScore: Record<SignalSeverity, number> = {
  HAUTE: 3,
  MOYENNE: 2,
  BASSE: 1,
};

export function pickPrioritySignal(signaux: Signal[]): Signal | null {
  if (signaux.length === 0) return null;

  return [...signaux].sort((a, b) => {
    const scoreA = severityScore[a.severity];
    const scoreB = severityScore[b.severity];
    if (scoreA !== scoreB) return scoreB - scoreA;
    return a.detectedAt.getTime() - b.detectedAt.getTime();
  })[0];
}
