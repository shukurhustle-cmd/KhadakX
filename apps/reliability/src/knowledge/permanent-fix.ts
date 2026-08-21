export interface FixEvidence {
  workaround: boolean;
  rootCauseIdentified: boolean;
  regressionVerified: boolean;
  architecturalPrevention: boolean;
}

export function permanentFixScore(evidence: FixEvidence): number {
  if (evidence.architecturalPrevention && evidence.regressionVerified && evidence.rootCauseIdentified) return 100;
  if (evidence.regressionVerified && evidence.rootCauseIdentified) return 85;
  if (evidence.rootCauseIdentified) return 70;
  if (evidence.workaround) return 20;
  return 0;
}
