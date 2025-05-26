import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Period = '1d' | '7d' | '30d' | '90d' | '1y';

const defaultPeriod: Period = '7d';

const MetricPeriodContext = createContext<{
  period: Period;
  setPeriod: (p: Period) => void;
}>({
  period: defaultPeriod,
  setPeriod: () => {},
});

export const MetricPeriodProvider = ({ children }: { children: ReactNode }) => {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  return (
    <MetricPeriodContext.Provider value={{ period, setPeriod }}>
      {children}
    </MetricPeriodContext.Provider>
  );
};

export const useMetricPeriod = () => {
  const context = useContext(MetricPeriodContext);
  if (!context) throw new Error('❌ useMetricPeriod must be used within MetricPeriodProvider');
  return context;
};
