const MONTH_LABELS = [
  'Janv',
  'Févr',
  'Mars',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sept',
  'Oct',
  'Nov',
  'Déc',
];

export type PerfTransaction = { type: string; amount: unknown; date: Date };
export type PerfTask = { status: string; dueDate: Date | null; createdAt: Date };

export function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function lastMonths(now: Date, count = 6): Array<{ month: string; label: string }> {
  const months: Array<{ month: string; label: string }> = [];

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1));
    months.push({ month: monthKey(date), label: MONTH_LABELS[date.getUTCMonth()] });
  }

  return months;
}

export function computeSeries(now: Date, transactions: PerfTransaction[], tasks: PerfTask[]) {
  return lastMonths(now).map(({ month, label }) => {
    let revenus = 0;
    let depenses = 0;

    for (const transaction of transactions) {
      if (monthKey(transaction.date) !== month) continue;
      const amount = Number(transaction.amount);
      if (transaction.type === 'REVENU') revenus += amount;
      if (transaction.type === 'DEPENSE') depenses += amount;
    }

    const tasksCreated = tasks.filter((task) => monthKey(task.createdAt) === month).length;

    return { month, label, revenus, depenses, tasksCreated };
  });
}

export function computeKpis(
  now: Date,
  tasks: PerfTask[],
  transactions: PerfTransaction[],
  budgetTotal: number,
) {
  const done = tasks.filter((task) => task.status === 'FAIT').length;
  const open = tasks.filter((task) => task.status === 'A_FAIRE');
  const overdueTasks = open.filter((task) => task.dueDate !== null && task.dueDate < now).length;

  const totalRevenus = transactions
    .filter((transaction) => transaction.type === 'REVENU')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  const totalDepenses = transactions
    .filter((transaction) => transaction.type === 'DEPENSE')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  return {
    taskCompletionRate: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0,
    budgetUsedPercent: budgetTotal > 0 ? Math.round((totalDepenses / budgetTotal) * 100) : 0,
    totalRevenus,
    totalDepenses,
    net: totalRevenus - totalDepenses,
    overdueTasks,
    openTasks: open.length,
  };
}

export function goalProgress(current: number, target: number): number {
  if (!(target > 0)) return 0;
  return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
}
