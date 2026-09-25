export function draftNextAction(signal: { type: string }): { title: string; reason: string } {
  if (signal.type === 'BUDGET_DEPASSE') {
    return {
      title: 'Revoir le budget du projet',
      reason: 'Les dépenses atteignent ou dépassent 80 % du budget total.',
    };
  }

  if (signal.type === 'TACHE_RETARD') {
    return {
      title: 'Traiter les tâches en retard',
      reason: 'Au moins une tâche à faire a dépassé sa date d’échéance.',
    };
  }

  return {
    title: 'Consulter les alertes du projet',
    reason: 'Un signal nécessite ton attention.',
  };
}
