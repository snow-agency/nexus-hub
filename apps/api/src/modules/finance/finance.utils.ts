export type FinanceTransaction = {
  type: string;
  amount: unknown;
};

export function toAmount(value: unknown): number {
  return Number(value);
}

export function computeFinanceSummary(transactions: FinanceTransaction[], budgetTotal: number) {
  const totalDepenses = transactions
    .filter((transaction) => transaction.type === 'DEPENSE')
    .reduce((sum, transaction) => sum + toAmount(transaction.amount), 0);

  const totalRevenus = transactions
    .filter((transaction) => transaction.type === 'REVENU')
    .reduce((sum, transaction) => sum + toAmount(transaction.amount), 0);

  return {
    totalDepenses,
    totalRevenus,
    solde: totalRevenus - totalDepenses,
    budgetTotal,
    budgetRestant: budgetTotal - totalDepenses,
  };
}
