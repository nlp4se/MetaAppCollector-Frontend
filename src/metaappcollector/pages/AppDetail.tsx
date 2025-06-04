import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useApps } from '../contexts/AppsContext';
import { useMetricPeriod } from '../contexts/MetricDashboardContext';

import AppInfoCard from '../components/AppInfoCard';
import FiltersPanel from '../components/FiltersPanel';
import PollingStatusCard from '../components/PollingStatusCard';
import MetricDashboard from '../components/MetricDashboard';

import { useAppDetail } from '../hooks/useAppDetail';
import AppService from '../services/AppService';
import PollingService from '../services/PollingService';
import { exportMetricsToCSV } from '../utils/exportMetricsToCSV';

const AppDetail: React.FC = () => {
  const {
    id,
    app,
    metrics,
    metricPolling,
    reviewPolling,
    isLoading,
    showLoading,
    setMetricPolling,
    setReviewPolling,
  } = useAppDetail();

  const navigate = useNavigate();
  const { removeAppFromList } = useApps();
  const { period, setPeriod, referenceDate, setReferenceDate } = useMetricPeriod();

  const handleDelete = useCallback(async () => {
    if (!id) return;

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete "${app?.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!result.isConfirmed) return;

    const success = await new AppService().deleteApp(id);

    if (success) {
      Swal.fire('Deleted!', `"${app?.name}" has been deleted.`, 'success');
      removeAppFromList(id);
      navigate('/meta-app-collector');
    } else {
      Swal.fire('Error', 'There was a problem deleting the app.', 'error');
    }
  }, [id, app, removeAppFromList, navigate]);

  const handleTogglePolling = useCallback(async (type: 'metrics' | 'reviews', enabled: boolean, intervalHours: number) => {
    if (!id) return;

    const action = enabled ? 'disable' : 'activate';
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: `Do you want to <strong>${action}</strong> the <strong>${type}</strong> polling?${
        action === 'activate'
          ? `<br><br>
            A data collection will be triggered now,<br>
            followed by automatic executions every <strong>${intervalHours}</strong> hours.`
          : ''
      }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: enabled ? '#d33' : '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: enabled ? 'Yes, disable it' : 'Yes, activate it',
    });

    if (!result.isConfirmed) return;

    const pollingService = new PollingService();
    try {
      const updated = type === 'metrics'
        ? enabled
          ? await pollingService.deactivateMetricPolling(id)
          : await pollingService.activateMetricPolling(id, intervalHours)
        : enabled
          ? await pollingService.deactivateReviewPolling(id)
          : await pollingService.activateReviewPolling(id, intervalHours);

      type === 'metrics' ? setMetricPolling(updated) : setReviewPolling(updated);

      Swal.fire({
        title: 'Success',
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} polling ${enabled ? 'disabled' : 'activated'} successfully.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(`Error toggling ${type} polling:`, error);
    }
  }, [id, setMetricPolling, setReviewPolling]);

  const handleExportAllMetricsToCSV = useCallback(() => {
    if (!id || metrics.length === 0) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'No metrics to export',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }
    exportMetricsToCSV(id, metrics).then(() => {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'CSV exported successfully',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    });
  }, [id, metrics]);

  if (isLoading && showLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" role="status" style={{ width: '4rem', height: '4rem' }} />
          <p className="mt-3 text-secondary fs-5">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoading && !app) {
    return (
      <div className="text-center mt-5 text-muted">
        <h4>App not found</h4>
        <Button variant="link" onClick={() => navigate(-1)}>← Go back</Button>
      </div>
    );
  }

  if (!app) return null;

  return (
    <Row className="min-vh-100">
      <Col md={9} className="p-4">
        <div className="p-4">
          <AppInfoCard
            app={app}
            onEdit={() => navigate(`/meta-app-collector/apps/${id}/edit`)}
            onDelete={handleDelete}
            onExportCSV={handleExportAllMetricsToCSV}
          />
          {(metricPolling || reviewPolling) && (
            <PollingStatusCard
              pollings={[metricPolling, reviewPolling]}
              onTogglePolling={handleTogglePolling}
            />
          )}
          <FiltersPanel
            period={period}
            setPeriod={setPeriod}
            referenceDate={referenceDate}
            setReferenceDate={setReferenceDate}
          />
          {metrics.map((metric) => (
            <MetricDashboard key={metric.id} appId={id!} metricId={metric.id.toString()} />
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default AppDetail;
