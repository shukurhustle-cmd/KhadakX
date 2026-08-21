import { classifyRecurrence } from '../knowledge/recurrence';
import { permanentFixScore } from '../knowledge/permanent-fix';
import { DEFAULT_BUDGETS, shouldEscalate } from '../headroom/budget-policy';
import { escalationTarget } from '../escalation/escalation-policy';
import { needsCtoAttention, type CtoDigest } from '../cto/digest';

describe('reliability policies', () => {
  it('classifies repeated unfixed incidents as chronic', () => {
    expect(classifyRecurrence({ failureDna: 'x', occurrences: 3, firstSeenAt: 'a', lastSeenAt: 'b', previousFixes: 2, permanentFixes: 0 })).toBe('chronic');
  });

  it('scores an architecturally prevented regression at 100', () => {
    expect(permanentFixScore({ workaround: false, rootCauseIdentified: true, regressionVerified: true, architecturalPrevention: true })).toBe(100);
  });

  it('escalates specialist loops to the main agent', () => {
    expect(shouldEscalate(2, DEFAULT_BUDGETS.specialist)).toBe(true);
  });

  it('routes P0 directly to a human engineer', () => {
    expect(escalationTarget({ severity: 'P0', tatMinutesRemaining: 100, specialistAttempts: 0, agentDisagreement: false, securityOrDataRisk: false })).toBe('human-engineer');
  });

  it('flags a digest when a TAT breach exists', () => {
    const digest: CtoDigest = {
      generatedAt: 'now',
      systemReliabilityPercent: 99,
      activeIncidents: [],
      agentHealth: [],
      tatBreaches: ['INC-1'],
      ctoAttentionRequired: false,
      recommendation: 'escalate',
    };
    expect(needsCtoAttention(digest)).toBe(true);
  });
});
