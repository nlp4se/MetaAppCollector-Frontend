export interface PollingStatusDTO {
  type: 'metrics' | 'reviews';
  enabled: boolean;
  intervalHours: number;
  lastRun: Date | null;
  nextRun: Date | null;
}
