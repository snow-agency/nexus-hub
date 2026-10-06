export function computeTaskProgress(tasks: Array<{ status: string }>) {
  const tasksTotal = tasks.length;
  const tasksDone = tasks.filter((task) => task.status === 'FAIT').length;
  const tasksPercent = tasksTotal > 0 ? Math.round((tasksDone / tasksTotal) * 100) : 0;

  return { tasksTotal, tasksDone, tasksPercent };
}
