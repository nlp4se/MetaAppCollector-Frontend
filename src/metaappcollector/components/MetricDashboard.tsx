import React, { useEffect, useState } from 'react';
import MetricService from '../services/MetricService';
import { MetricDashboardDTO } from '../DTOs/MetricDashboardDTO';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Card, ButtonGroup, ToggleButton } from 'react-bootstrap';

interface MetricDashboardProps {
  appId: string;
  metricId: string;
}

const MetricDashboard: React.FC<MetricDashboardProps> = ({ appId, metricId }) => {
  const [metricData, setMetricData] = useState<MetricDashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('30d');
  const decimals = 4;

  useEffect(() => {
    const fetchData = async () => {
      if (appId && metricId) {
        const service = new MetricService();
        const result = await service.fetchMetricDashboard(appId, metricId);
        setMetricData(result);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [appId, metricId]);

  // 🔧 Agrupa y filtra por período
  const filterHistoryByPeriod = (
    history: { date: string; value: number }[],
    period: '1d' | '7d' | '30d' | '90d' | '1y'
  ) => {
    const now = new Date();
    const fromDate = new Date();
    const daysMap = { '1d': 1, '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    fromDate.setDate(now.getDate() - daysMap[period]);
    return history.filter(({ date }) => new Date(date) >= fromDate);
  };

  const periodOptions = [
    { value: '1d', label: 'Day' },
    { value: '7d', label: 'Week' },
    { value: '30d', label: 'Month' },
    { value: '90d', label: '3 Months' },
    { value: '1y', label: 'Year' },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (!metricData) return <div>No data available</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2>{metricData.metric.name}</h2>
          <p>{metricData.metric.description}</p>
        </div>
        <ButtonGroup>
          {periodOptions.map((opt) => (
            <ToggleButton
              key={opt.value}
              id={`period-${opt.value}`}
              type="radio"
              variant="outline-primary"
              name="period"
              value={opt.value}
              checked={period === opt.value}
              onChange={(e) => setPeriod(e.currentTarget.value as any)}
              size="sm"
            >
              {opt.label}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>

      {metricData.sources.map((source) => {
        const filteredHistory = filterHistoryByPeriod(source.history, period);

        return (
          <Card key={source.source} className="my-4 p-3 shadow-sm">
            <h5>{source.source}</h5>
            {filteredHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    allowDecimals={true}
                    tickCount={5}
                    tickFormatter={(value) => value.toFixed(decimals)}
                  />
                  <Tooltip
                    formatter={(value: any) => parseFloat(value).toFixed(decimals)}
                    labelFormatter={(label: string) => `Fecha: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4a90e2"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted">No hay datos en este período.</p>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default MetricDashboard;
