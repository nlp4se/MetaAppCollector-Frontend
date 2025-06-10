// hooks/useAppDetail.ts
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppService from '../services/AppService';
import MetricService from '../services/MetricService';
import PollingService from '../services/PollingService';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';
import { MetricSummaryDTO } from '../DTOs/MetricSummaryDTO';
import { PollingStatusDTO } from '../DTOs/PollingStatusDTO';

export const useAppDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<AppDetailDTO | null>(null);
  const [metrics, setMetrics] = useState<MetricSummaryDTO[]>([]);
  const [metricPolling, setMetricPolling] = useState<PollingStatusDTO | null>(null);
  const [reviewPolling, setReviewPolling] = useState<PollingStatusDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const appService = new AppService();
  const metricService = new MetricService();
  const pollingService = new PollingService();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const [fetchedApp, fetchedMetrics] = await Promise.all([
        appService.fetchAppById(id),
        metricService.fetchMetrics(),
      ]);
      setApp(fetchedApp);
      setMetrics(fetchedMetrics);
      setIsLoading(false);
    };

    const fetchPollingData = async () => {
      const [metricsPoll, reviewsPoll] = await Promise.all([
        pollingService.fetchMetricPolling(id),
        pollingService.fetchReviewPolling(id),
      ]);
      setMetricPolling(metricsPoll);
      setReviewPolling(reviewsPoll);
    };

    fetchData();
    fetchPollingData();
  }, [id]);

  useEffect(() => {
    const timeout = setTimeout(() => setShowLoading(true), 300);
    return () => clearTimeout(timeout);
    }, []);

  return {
    id,
    app,
    metrics,
    metricPolling,
    reviewPolling,
    isLoading,
    showLoading,
    setApp,
    setMetrics,
    setMetricPolling,
    setReviewPolling,
  };
};
