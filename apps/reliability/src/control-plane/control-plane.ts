export type SystemHealth = 'green' | 'yellow' | 'red' | 'frozen';

export type AgentState = 'healthy' | 'degraded' | 'failed' | 'disabled';

export interface AgentStatus {
  agentId: string;
  state: AgentState;
  lastHeartbeatAt?: string;
  openIncidents: number;
  tatBreaches: number;
}

export interface ReliabilitySnapshot {
  capturedAt: string;
  health: SystemHealth;
  autonomousActionsEnabled: boolean;
  agents: AgentStatus[];
  activeIncidents: number;
  unresolvedCriticalIncidents: number;
}

export interface ControlPlanePolicy {
  maxAutonomousRetries: number;
  freezeOnCriticalIncident: boolean;
  freezeOnRepeatedFailure: boolean;
  repeatedFailureThreshold: number;
}

export class ReliabilityControlPlane {
  private readonly policy: ControlPlanePolicy;
  private autonomousActionsEnabled = true;
  private snapshot: ReliabilitySnapshot;

  constructor(policy: Partial<ControlPlanePolicy> = {}) {
    this.policy = {
      maxAutonomousRetries: 3,
      freezeOnCriticalIncident: true,
      freezeOnRepeatedFailure: true,
      repeatedFailureThreshold: 3,
      ...policy,
    };
    this.snapshot = {
      capturedAt: new Date().toISOString(),
      health: 'green',
      autonomousActionsEnabled: true,
      agents: [],
      activeIncidents: 0,
      unresolvedCriticalIncidents: 0,
    };
  }

  update(snapshot: Omit<ReliabilitySnapshot, 'autonomousActionsEnabled'>): ReliabilitySnapshot {
    this.snapshot = {
      ...snapshot,
      autonomousActionsEnabled: this.autonomousActionsEnabled,
    };

    if (this.policy.freezeOnCriticalIncident && snapshot.unresolvedCriticalIncidents > 0) {
      this.freezeAutonomousActions();
    }

    if (
      this.policy.freezeOnRepeatedFailure &&
      snapshot.agents.some((agent) => agent.openIncidents >= this.policy.repeatedFailureThreshold)
    ) {
      this.freezeAutonomousActions();
    }

    return this.getSnapshot();
  }

  freezeAutonomousActions(): void {
    this.autonomousActionsEnabled = false;
    this.snapshot = { ...this.snapshot, health: 'frozen', autonomousActionsEnabled: false };
  }

  resumeAutonomousActions(): void {
    this.autonomousActionsEnabled = true;
    this.snapshot = { ...this.snapshot, autonomousActionsEnabled: true };
  }

  canPerformAutonomousAction(): boolean {
    return this.autonomousActionsEnabled;
  }

  getSnapshot(): ReliabilitySnapshot {
    return { ...this.snapshot, agents: [...this.snapshot.agents] };
  }
}
