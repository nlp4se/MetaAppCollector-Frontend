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
import { useMetricPeriod, Period } from '../contexts/MetricDashboardContext';

interface MetricDashboardProps {
  appId: string;
  metricId: string;
}

const MetricDashboard: React.FC<MetricDashboardProps> = ({ appId, metricId }) => {
  const [metricData, setMetricData] = useState<MetricDashboardDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { period, referenceDate } = useMetricPeriod();
  const [visibleSources, setVisibleSources] = useState<Record<string, boolean>>({});
  const decimals = 4;
  
  function getDateRange(referenceDate: Date, period: Period): [Date, Date] {
  const end = new Date(referenceDate);
   end.setDate(end.getDate() + 1);// copia segura
  let start = new Date(referenceDate); // copia segura

  if (period === '7d') {
    start.setDate(end.getDate() - 6); // 7 días incluyendo hoy
  } else if (period === '30d') {
    start.setMonth(end.getMonth() - 1);
    // Corrige casos como 31 marzo -> 28 febrero
    if (start.getDate() !== end.getDate()) {
      const lastDayOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      start.setDate(Math.min(end.getDate(), lastDayOfMonth));
    }
  } else if (period === 'all') {
    start = new Date(0); // desde el inicio de los tiempos (1970-01-01)
  }

  // Asegurar que ambos estén a medianoche para igualdad precisa
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return [start, end];
}
  useEffect(() => {
      const fetchData = async () => {
        if (appId && metricId) {
          const service = new  MetricService();
          const result = await service.fetchMetricDashboard(appId, metricId);
          setMetricData(result);
  
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
    period: '7d' | '30d' | 'all'
  ) => {
    const endDate = new Date(referenceDate);
    endDate.setHours(0, 0, 0, 0);

    if (period === 'all') {
      return history.filter(({ date }) => new Date(date) <= endDate);
    }

    const startDate = new Date(referenceDate);
    if (period === '7d') {
      startDate.setDate(startDate.getDate() - 6);
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 29);
    }
    startDate.setHours(0, 0, 0, 0);

    return history.filter(({ date }) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d >= startDate && d <= endDate;
    });
  };


  const fillMissingDates = (
    allHistories: Record<string, { date: string; value: number }[]>
  ) => {
    const { referenceDate, period } = useMetricPeriod();

    // Si és 'all', no cal omplir dates buides — només fusionar per data
    if (period === 'all') {
      const dateMap: Record<string, any> = {};
      
      for (const [source, history] of Object.entries(allHistories)) {
        history.forEach(({ date, value }) => {
          if (!dateMap[date]) dateMap[date] = { date };
          dateMap[date][source] = value;
        });
      }

      const referenceDateISO = referenceDate.toISOString().split('T')[0];
      return Object.values(dateMap)
        .filter((row) => row.date <= referenceDateISO)
        .sort((a, b) => (a.date > b.date ? 1 : -1));
    }

    // Per als altres períodes, sí que s’omplen buits
    const [startDate, endDate] = getDateRange(referenceDate, period);

    const allDateStrings: string[] = [];
    for (let d = new Date(startDate.getTime()); d <= endDate; d.setDate(d.getDate() + 1)) {
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


  if (isLoading) return <div>Loading...</div>;
  if (!metricData) return <div>No data available</div>;

  // Prepara los datos combinados por fecha
  const computeChartData = () => {
    if (!metricData) return [];

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

    return fillMissingDates(allHistories);
  };

  const chartData = computeChartData();
  const colors = ['#4a90e2', '#f39c12', '#2ecc71', '#e74c3c', '#9b59b6', '#1abc9c'];
  const isInteger = metricData.metric.value_type === 'integer';
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
      </div>

      <Card className="my-4 p-3 shadow-sm">
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
              width={80}
              domain={([dataMin, dataMax]) => {
                if (dataMax <= 1) {
                  return [0, 1];
                }
                return isInteger
                  ? [Math.max(0, dataMin - 1), dataMax + 1]
                  : [Math.max(0, dataMin - 0.1), Math.round((dataMax + 0.1) * 10) / 10];
              }}
              allowDecimals={!isInteger}
              tickCount={5}
              tickFormatter={(value) =>
                isInteger ? value.toFixed(0) : (Math.round(value * 10) / 10).toFixed(1)
              }
            />
            <Tooltip  
              formatter={(value: any) => {
                const num = parseFloat(value);
                return Number.isInteger(num) ? num.toString() : num.toFixed(decimals);
              }}
              labelFormatter={(label: string) => `Date: ${label}`}
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

