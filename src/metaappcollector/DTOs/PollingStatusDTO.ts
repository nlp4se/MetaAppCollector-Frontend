export interface PollingStatusDTO {
  type: 'metrics' | 'reviews';
  enabled: boolean;
  frequencyHours: number;
  lastRun: string;
  nextRun: string;
}
