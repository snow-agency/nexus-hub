export type WorkloadTask = { status: string; assigneeId: string | null };

export type MemberWorkload = {
  openTasks: number;
  doneTasks: number;
  workloadPercent: number;
};

/**
 * Charge d'un membre = nombre de tâches ouvertes (A_FAIRE) qui lui sont assignées.
 * workloadPercent est relatif au membre le plus chargé (lui = 100 %), 0 si personne n'a de tâche ouverte.
 */
export function computeTeamWorkload(
  memberIds: string[],
  tasks: WorkloadTask[],
): { byMember: Record<string, MemberWorkload>; unassignedOpenTasks: number } {
  const counts: Record<string, { open: number; done: number }> = {};
  for (const id of memberIds) counts[id] = { open: 0, done: 0 };

  let unassignedOpenTasks = 0;

  for (const task of tasks) {
    if (!task.assigneeId) {
      if (task.status === 'A_FAIRE') unassignedOpenTasks += 1;
      continue;
    }
    const entry = counts[task.assigneeId];
    if (!entry) continue;
    if (task.status === 'A_FAIRE') entry.open += 1;
    else if (task.status === 'FAIT') entry.done += 1;
  }

  const maxOpen = Math.max(0, ...Object.values(counts).map((entry) => entry.open));

  const byMember: Record<string, MemberWorkload> = {};
  for (const id of memberIds) {
    const { open, done } = counts[id];
    byMember[id] = {
      openTasks: open,
      doneTasks: done,
      workloadPercent: maxOpen > 0 ? Math.round((open / maxOpen) * 100) : 0,
    };
  }

  return { byMember, unassignedOpenTasks };
}
