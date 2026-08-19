const SECRET_PATTERNS = [
  /(Authorization:\s*Bearer\s+)[^\s;]+/gi,
  /(api[_-]?key\s*[=:]\s*)[^\s;]+/gi,
  /(token\s*[=:]\s*)[^\s;]+/gi,
  /(password\s*[=:]\s*)[^\s;]+/gi,
  /(secret\s*[=:]\s*)[^\s;]+/gi
];

function redact(value) {
  let output = String(value ?? '');
  for (const pattern of SECRET_PATTERNS) {
    output = output.replace(pattern, '$1[REDACTED]');
  }
  return output;
}

function signatureFor(log) {
  return redact(log)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .slice(0, 240);
}

export function normalizeEvidence(input) {
  const redactedLog = redact(input.log);

  return {
    source: input.source,
    repository: input.repository,
    workflow: input.workflow,
    runId: input.runId,
    job: input.job,
    step: input.step,
    conclusion: input.conclusion,
    commitSha: input.commitSha,
    signature: signatureFor(redactedLog),
    redactedLog
  };
}
