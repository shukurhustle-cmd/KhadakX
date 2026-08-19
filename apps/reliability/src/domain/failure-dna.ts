export interface FailureFingerprintInput {
  workflow: string;
  service: string;
  operation: string;
  errorClass: string;
  environment: string;
}

/** Stable operational fingerprint. Free-form error text is intentionally excluded. */
export function buildFailureFingerprint(input: FailureFingerprintInput): string {
  return [
    input.workflow,
    input.service,
    input.operation,
    input.errorClass,
    input.environment,
  ]
    .map((part) => part.trim().toLowerCase())
    .join(':');
}
