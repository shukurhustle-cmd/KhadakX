export type HealthState = 'green' | 'yellow' | 'red';

export interface DependencyHealth {
  name: string;
  required: boolean;
  healthy: boolean;
  latencyMs?: number;
  detail?: string;
}

export interface HealthSnapshot {
  state: HealthState;
  live: boolean;
  ready: boolean;
  capturedAt: string;
  dependencies: DependencyHealth[];
}

export function evaluateHealth(dependencies: DependencyHealth[], capturedAt = new Date().toISOString()): HealthSnapshot {
  const requiredFailures = dependencies.filter((dependency) => dependency.required && !dependency.healthy);
  const optionalFailures = dependencies.filter((dependency) => !dependency.required && !dependency.healthy);

  return {
    state: requiredFailures.length > 0 ? 'red' : optionalFailures.length > 0 ? 'yellow' : 'green',
    live: true,
    ready: requiredFailures.length === 0,
    capturedAt,
    dependencies: dependencies.map((dependency) => ({ ...dependency })),
  };
}
