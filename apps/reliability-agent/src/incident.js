const HIGH_RISK_COMPONENTS = new Set([
  'authentication',
  'authorization',
  'payments',
  'orders',
  'refunds',
  'database',
  'security'
]);

export function classifyIncident(input) {
  const production = input.source === 'production';
  const highRisk = production && HIGH_RISK_COMPONENTS.has(input.component);

  if (highRisk) {
    return {
      category: 'production',
      severity: 'critical',
      requiresApproval: true
    };
  }

  if (input.source === 'github-actions') {
    return {
      category: 'ci',
      severity: 'high',
      requiresApproval: false
    };
  }

  return {
    category: production ? 'production' : 'unknown',
    severity: production ? 'medium' : 'low',
    requiresApproval: production
  };
}
