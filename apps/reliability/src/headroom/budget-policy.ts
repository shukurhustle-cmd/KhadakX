export type TaskTier = 'specialist' | 'main-agent' | 'cto';

export interface TaskBudget {
  tier: TaskTier;
  maxAttempts: number;
  maxMinutes: number;
  escalateAfterAttempts: number;
}

export const DEFAULT_BUDGETS: Record<TaskTier, TaskBudget> = {
  specialist: { tier: 'specialist', maxAttempts: 2, maxMinutes: 10, escalateAfterAttempts: 2 },
  'main-agent': { tier: 'main-agent', maxAttempts: 2, maxMinutes: 20, escalateAfterAttempts: 2 },
  cto: { tier: 'cto', maxAttempts: 1, maxMinutes: 30, escalateAfterAttempts: 1 },
};

export function shouldEscalate(attempts: number, budget: TaskBudget): boolean {
  return attempts >= budget.escalateAfterAttempts;
}
