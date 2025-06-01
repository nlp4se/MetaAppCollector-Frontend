export interface PollingStatusDTO {
  type: 'metrics' | 'reviews';
  enabled: boolean;
  intervalHours: number;
  lastRun: string | null;
  nextRun: string | null;
  startAt: string | null;
}
