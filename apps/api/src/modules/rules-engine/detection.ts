export const BUDGET_THRESHOLD = 0.8;

export function isBudgetDepasse(
  totalDepenses: number,
  budgetTotal: number,
  threshold = BUDGET_THRESHOLD,
): boolean {
  if (budgetTotal === 0) {
    return totalDepenses > 0;
  }

  return totalDepenses >= budgetTotal * threshold;
}

export function hasOverdueTasks(
  tasks: Array<{ status: string; dueDate: Date | null }>,
  now: Date,
): boolean {
  return tasks.some(
    (task) => task.status === 'A_FAIRE' && task.dueDate !== null && task.dueDate < now,
  );
}
