import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Period = '7d' | '30d' | 'all';

const defaultPeriod: Period = '7d';

export const MetricPeriodContext = createContext<{
  period: Period;
  setPeriod: (p: Period) => void;
  referenceDate: Date;
  setReferenceDate: (d: Date) => void;
}>({
  period: defaultPeriod,
  setPeriod: () => {},
  referenceDate: new Date(),
  setReferenceDate: () => {},
});

export const MetricPeriodProvider = ({ children }: { children: ReactNode }) => {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [referenceDate, setReferenceDate] = useState<Date>(new Date());
    
  return (
    <MetricPeriodContext.Provider value={{ period, setPeriod, referenceDate, setReferenceDate }}>
      {children}
    </MetricPeriodContext.Provider>
  );
};

export const useMetricPeriod = () => {
  const context = useContext(MetricPeriodContext);
  if (!context) throw new Error('❌ useMetricPeriod must be used within MetricPeriodProvider');
  return context;
};
