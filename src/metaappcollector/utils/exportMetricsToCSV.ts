import { MetricSummaryDTO } from '../DTOs/MetricSummaryDTO';
import MetricService from '../services/MetricService';

export const exportMetricsToCSV = async (appId: string, metrics: MetricSummaryDTO[]) => {
  const metricService = new MetricService();
  const results = await Promise.all(
    metrics.map((m) => metricService.fetchMetricDashboard(appId, m.id.toString()))
  );

  const rows: string[] = ["Metric;Date;Source;Value"];

  results.forEach((data) => {
    if (!data || (data.metric.value_type !== 'integer' && data.metric.value_type !== 'float')) return;

    data.sources.forEach((source) => {
      const grouped: Record<string, number[]> = {};

      source.history.forEach(({ date, value }) => {
        const day = new Date(date).toISOString().split('T')[0];
        const val = typeof value === 'number' ? value : parseFloat(String(value));
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(val);
      });

      Object.entries(grouped).forEach(([date, values]) => {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        rows.push([data.metric.name, date, source.source, avg.toFixed(4)].join(';'));
      });
    });
  });

  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'metrics.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
