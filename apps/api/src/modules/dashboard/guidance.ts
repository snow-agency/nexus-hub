export type GuidanceKind = 'BUDGET_SETUP' | 'FIRST_TASK';

export const GUIDANCE: Record<GuidanceKind, { title: string; reason: string; impact: string }> = {
  BUDGET_SETUP: {
    title: 'Renseigne le budget de ton projet',
    reason: "Sans budget, Nexus ne peut pas suivre tes dépenses ni t'alerter avant un dépassement.",
    impact: 'Active le suivi financier de ton projet.',
  },
  FIRST_TASK: {
    title: 'Ajoute ta première tâche',
    reason: 'Une tâche avec une échéance permet à Nexus de te prévenir quand tu prends du retard.',
    impact: 'Donne une direction claire à ta semaine.',
  },
};

export const GUIDANCE_KINDS = Object.keys(GUIDANCE) as GuidanceKind[];

export function pendingGuidanceKinds(state: {
  budgetTotal: number;
  tasksCount: number;
}): GuidanceKind[] {
  const kinds: GuidanceKind[] = [];
  if (state.budgetTotal === 0) kinds.push('BUDGET_SETUP');
  if (state.tasksCount === 0) kinds.push('FIRST_TASK');
  return kinds;
}
