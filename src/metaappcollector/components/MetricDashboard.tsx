import React, { useEffect, useState } from 'react';
import MetricService from '../services/MetricService';
import { MetricDashboardDTO } from '../DTOs/MetricDashboardDTO';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, ButtonGroup, ToggleButton } from 'react-bootstrap';

interface MetricDashboardProps {
  appId: string;
  metricId: string;
}

const MetricDashboard: React.FC<MetricDashboardProps> = ({ appId, metricId }) => {
  const [metricData, setMetricData] = useState<MetricDashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('7d');
  const [visibleSources, setVisibleSources] = useState<Record<string, boolean>>({});
  const decimals = 4;

  useEffect(() => {
    const fetchData = async () => {
      if (appId && metricId) {
        const service = new MetricService();
        const result = await service.fetchMetricDashboard(appId, metricId);
        setMetricData(result);

        // Inicializa visibilidad: todos visibles
        const visibility: Record<string, boolean> = {};
        if (result) {
          result.sources.forEach((s) => (visibility[s.source] = true));
        }
        setVisibleSources(visibility);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [appId, metricId]);

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

  const fillMissingDates = (
  allHistories: Record<string, { date: string; value: number }[]>
) => {
  const allDates = new Set<string>();
  Object.values(allHistories).forEach((hist) =>
    hist.forEach((entry) => allDates.add(entry.date))
  );

  const sortedDates = Array.from(allDates).sort();

  if (sortedDates.length === 0) return [];

  // 🆕 Añadimos días vacíos hasta hoy (si falta)
  const startDate = new Date(sortedDates[0]);
  const endDate = new Date(); // hoy
  console.log('startDate', startDate);
  endDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() + 1);
  const allDateStrings: string[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    allDateStrings.push(d.toISOString().split('T')[0]);
  }

  return allDateStrings.map((date) => {
    const entry: any = { date };
    for (const [source, hist] of Object.entries(allHistories)) {
      const point = hist.find((h) => h.date === date);
      entry[source] = point ? point.value : null;
    }
    return entry;
  });
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

  // Prepara los datos combinados por fecha
  const allHistories: Record<string, { date: string; value: number }[]> = {};
  metricData.sources.forEach((source) => {
    const grouped: Record<string, number[]> = {};

    source.history.forEach(({ date, value }) => {
      const day = new Date(date).toISOString().split('T')[0];
      const numValue = typeof value === 'number' ? value : parseFloat(String(value));
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(numValue);
    });

    const averaged = Object.entries(grouped).map(([date, values]) => ({
      date,
      value: values.reduce((a, b) => a + b, 0) / values.length,
    }));

    allHistories[source.source] = filterHistoryByPeriod(averaged, period);
  });

  const chartData = fillMissingDates(allHistories);
  const colors = ['#4a90e2', '#f39c12', '#2ecc71', '#e74c3c', '#9b59b6', '#1abc9c'];

  const renderCustomLegend = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingLeft: '10px', paddingBottom: '10px' }}>
      {metricData?.sources.map((source, index) => (
        <label key={source.source} style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={visibleSources[source.source]}
            onChange={() =>
              setVisibleSources((prev) => ({
                ...prev,
                [source.source]: !prev[source.source],
              }))
            }
            style={{ marginRight: '5px' }}
          />
          <span style={{ color: colors[index % colors.length] }}>{source.source}</span>
        </label>
      ))}
    </div>
  );
};

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

      <Card className="my-4 p-3 shadow-sm">
        <h5>Sources</h5>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) =>
                new Date(dateStr).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={['dataMin - 0.1', 'dataMax + 0.1']}
              allowDecimals={true}
              tickCount={5}
              tickFormatter={(value) => (Math.round(value * 10) / 10).toFixed(1)}
            />
            {/*<YAxis
              domain={([dataMin, dataMax]: [number, number]) => {
                const min = Math.floor(dataMin * 10) / 10;
                const max = Math.ceil(dataMax * 10) / 10;
                return [min, max];
              }}
              ticks={Array.from({ length: 5 }, (_, i) => {
                const min = Math.floor(metricData!.sources.flatMap(s =>
                  s.history.map(p => typeof p.value === 'number' ? p.value : parseFloat(String(p.value))
                )).reduce((a, b) => Math.min(a, b)) * 10) / 10;
                return parseFloat((min + i * 0.1).toFixed(1));
              })}
              tickFormatter={(value) => value.toFixed(1)}
            />*/}
            <Tooltip  
              formatter={(value: any) => parseFloat(value).toFixed(decimals)}
              labelFormatter={(label: string) => `Fecha: ${label}`}
            />
            <Legend content={renderCustomLegend} />
            {metricData.sources.map((source, index) =>
              visibleSources[source.source] ? (
                <Line
                  key={source.source}
                  type="monotone"
                  dataKey={source.source}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                  connectNulls
                  isAnimationActive={false}
                />
              ) : null
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default MetricDashboard;

