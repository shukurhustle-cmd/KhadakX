import { ReliabilityControlPlane } from '../control-plane';

describe('ReliabilityControlPlane', () => {
  it('freezes autonomous actions when a critical incident is unresolved', () => {
    const controlPlane = new ReliabilityControlPlane();

    const snapshot = controlPlane.update({
      capturedAt: '2026-08-21T00:00:00Z',
      health: 'red',
      agents: [],
      activeIncidents: 1,
      unresolvedCriticalIncidents: 1,
    });

    expect(snapshot.health).toBe('frozen');
    expect(controlPlane.canPerformAutonomousAction()).toBe(false);
  });

  it('freezes on repeated agent failures', () => {
    const controlPlane = new ReliabilityControlPlane({ repeatedFailureThreshold: 2 });

    controlPlane.update({
      capturedAt: '2026-08-21T00:00:00Z',
      health: 'yellow',
      agents: [{
        agentId: 'ci-agent',
        state: 'degraded',
        openIncidents: 2,
        tatBreaches: 0,
      }],
      activeIncidents: 2,
      unresolvedCriticalIncidents: 0,
    });

    expect(controlPlane.canPerformAutonomousAction()).toBe(false);
  });

  it('supports an explicit resume after the system is safe', () => {
    const controlPlane = new ReliabilityControlPlane();
    controlPlane.freezeAutonomousActions();
    expect(controlPlane.canPerformAutonomousAction()).toBe(false);

    controlPlane.resumeAutonomousActions();
    expect(controlPlane.canPerformAutonomousAction()).toBe(true);
  });
});
