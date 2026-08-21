import { randomUUID } from 'node:crypto';

export interface TelemetryEvent {
  eventId: string;
  occurredAt: string;
  service: string;
  environment: string;
  eventType: string;
  severity: 'info' | 'warn' | 'error' | 'critical';
  correlationId: string;
  traceId?: string;
  agentId?: string;
  workflow?: string;
  operation?: string;
  durationMs?: number;
  attributes?: Record<string, string | number | boolean>;
}

export interface TelemetrySink {
  emit(event: TelemetryEvent): Promise<void>;
}

export class InMemoryTelemetrySink implements TelemetrySink {
  readonly events: TelemetryEvent[] = [];

  async emit(event: TelemetryEvent): Promise<void> {
    this.events.push({ ...event, attributes: event.attributes ? { ...event.attributes } : undefined });
  }
}

export function createCorrelationId(): string {
  return `corr-${randomUUID()}`;
}
