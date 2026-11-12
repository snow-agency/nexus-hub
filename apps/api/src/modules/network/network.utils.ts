export type OpportunityLike = {
  status: string;
  deadline: Date | string | null;
};

const CLOSED_STATUSES = ['OBTENUE', 'ECARTEE'];

export function isOpenOpportunity(opportunity: { status: string }): boolean {
  return !CLOSED_STATUSES.includes(opportunity.status);
}

function toTime(value: Date | string | null): number | null {
  if (value === null) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

export function sortOpportunities<T extends OpportunityLike>(opportunities: T[]): T[] {
  return [...opportunities].sort((a, b) => {
    const openA = isOpenOpportunity(a);
    const openB = isOpenOpportunity(b);
    if (openA !== openB) return openA ? -1 : 1;

    const timeA = toTime(a.deadline);
    const timeB = toTime(b.deadline);
    if (timeA === timeB) return 0;
    if (timeA === null) return 1;
    if (timeB === null) return -1;
    return timeA - timeB;
  });
}

export function isDeadlineSoon(
  deadline: Date | string | null,
  now: Date = new Date(),
  days = 14,
): boolean {
  const time = toTime(deadline);
  if (time === null) return false;
  const diff = time - now.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}
