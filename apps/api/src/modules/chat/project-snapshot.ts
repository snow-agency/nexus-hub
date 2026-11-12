import { prisma } from '../../db/prisma.js';
import { computeFinanceSummary } from '../finance/finance.utils.js';
import { runDetection } from '../rules-engine/rules-engine.service.js';
import type { ProjectSnapshot } from './snapshot-text.js';

export async function loadProjectSnapshot(projectId: string): Promise<ProjectSnapshot | null> {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return null;
  }

  const [tasks, transactions, strategyItems, bmcBlocks, team, goals, contactsCount, opportunities] =
    await Promise.all([
      prisma.task.findMany({
        where: { projectId },
        include: { assignee: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 200,
      }),
      prisma.transaction.findMany({ where: { projectId } }),
      prisma.strategyItem.findMany({ where: { projectId }, orderBy: { position: 'asc' } }),
      prisma.bmcBlock.findMany({ where: { projectId } }),
      prisma.teamMember.findMany({ where: { projectId } }),
      prisma.goal.findMany({ where: { projectId } }),
      prisma.contact.count({ where: { projectId } }),
      prisma.opportunity.findMany({ where: { projectId }, take: 10 }),
    ]);

  const signals = await runDetection(projectId);
  const finance = computeFinanceSummary(transactions, Number(project.budgetTotal));

  const byCategory = new Map<string, number>();
  for (const transaction of transactions) {
    if (transaction.type !== 'DEPENSE') continue;
    const key = transaction.category ?? 'AUTRE';
    byCategory.set(key, (byCategory.get(key) ?? 0) + Number(transaction.amount));
  }

  const openTasks = tasks.filter((task) => task.status === 'A_FAIRE');

  return {
    project: {
      name: project.name,
      sector: project.sector,
      country: project.country,
      phase: project.phase,
      budgetTotal: Number(project.budgetTotal),
      objective: project.objective,
    },
    tasks: {
      open: openTasks.slice(0, 25).map((task) => ({
        title: task.title,
        dueDate: task.dueDate,
        assignee: task.assignee?.name ?? null,
      })),
      doneCount: tasks.length - openTasks.length,
      totalCount: tasks.length,
    },
    finance: {
      totalDepenses: finance.totalDepenses,
      totalRevenus: finance.totalRevenus,
      budgetRestant: finance.budgetRestant,
      topCategories: Array.from(byCategory.entries())
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5),
    },
    signals: signals.map((signal) => ({ type: signal.type, severity: signal.severity })),
    strategy: {
      etapes: strategyItems
        .filter((item) => item.kind === 'ETAPE_MARCHE')
        .map((item) => ({ title: item.title, done: item.done })),
      positionnement: strategyItems.find((item) => item.kind === 'POSITIONNEMENT')?.title ?? null,
      sections: strategyItems
        .filter((item) => item.kind === 'SECTION_PLAN')
        .map((item) => ({ title: item.title, progress: item.progress })),
    },
    bmc: bmcBlocks.map((block) => ({ block: block.block, content: block.content })),
    team: team.map((member) => ({ name: member.name, role: member.role })),
    goals: goals.map((goal) => ({
      title: goal.title,
      current: goal.current,
      target: goal.target,
      unit: goal.unit,
    })),
    network: {
      contacts: contactsCount,
      opportunities: opportunities.map((o) => ({ title: o.title, status: o.status })),
    },
  };
}
