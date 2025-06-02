import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Image, ButtonGroup, ToggleButton, Card } from 'react-bootstrap';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';
import AppService from '../services/AppService';
import MetricService from '../services/MetricService';
import { useApps } from '../contexts/AppsContext';
import { MetricSummaryDTO } from '../DTOs/MetricSummaryDTO';
import MetricDashboard from '../components/MetricDashboard';
import { Period } from '../contexts/MetricDashboardContext';
import { useMetricPeriod } from '../contexts/MetricDashboardContext';
import PollingService from '../services/PollingService';
import { PollingStatusDTO } from '../DTOs/PollingStatusDTO';
import { getEnabledCategories } from 'node:trace_events';
import Swal from 'sweetalert2';
// Puedes usar los iconos de Bootstrap en vez de react-icons
// Ejemplo usando Bootstrap Icons como SVGs embebidos:
const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14z"/>
    <path d="M10.97 5.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 9.384a.75.75 0 1 1 1.06-1.06l1.094 1.093 3.492-4.438z"/>
  </svg>
);

const TimesCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" className="bi bi-x-circle" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14z"/>
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
  </svg>
);
const AppDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<AppDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const appService = new AppService();
  const metricService = new MetricService();
  const pollingService = new PollingService();
  const { removeAppFromList } = useApps();
  const [metrics, setMetrics] = useState<MetricSummaryDTO[]>([]);
  const { period, setPeriod, referenceDate, setReferenceDate } = useMetricPeriod();
  const periodOptions = [
  { value: '7d', label: 'Week' },
  { value: '30d', label: 'Month' },
  { value: 'all', label: 'All' },
  ];
  const [metricPolling, setMetricPolling] = useState<PollingStatusDTO | null>(null);
  const [reviewPolling, setReviewPolling] = useState<PollingStatusDTO | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const [fetchedApp, fetchedMetrics] = await Promise.all([
        appService.fetchAppById(id),
        metricService.fetchMetrics(),
      ]);

      setApp(fetchedApp);
      setMetrics(fetchedMetrics);
      setIsLoading(false);
    };
    const fetchPollingData = async () => {
      if (!id) return;
      
      const [metricsPoll, reviewsPoll] = await Promise.all([
        pollingService.fetchMetricPolling(id),
        pollingService.fetchReviewPolling(id),
      ]);

      setMetricPolling(metricsPoll);
      setReviewPolling(reviewsPoll);
    };

    fetchPollingData();
    fetchData();
  }, [id]);

  const handleDelete = async () => {
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

    const success = await appService.deleteApp(id);

    if (success) {
      Swal.fire('Deleted!', `"${app?.name}" has been deleted.`, 'success');
      removeAppFromList(id);
      navigate('/meta-app-collector');
    } else {
      Swal.fire('Error', 'There was a problem deleting the app.', 'error');
    }
  };

  const handleTogglePolling = async (type: 'metrics' | 'reviews', enabled: boolean) => {
    if (!id) return;

    const action = enabled ? 'disable' : 'activate';
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} the ${type} polling?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: enabled ? '#d33' : '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: enabled ? 'Yes, disable it' : 'Yes, activate it',
    });
    if (!result.isConfirmed) return;

    try {
      let updatedPolling;

      if (type === 'metrics') {
        updatedPolling = enabled
          ? await pollingService.deactivateMetricPolling(id)
          : await pollingService.activateMetricPolling(id);
        setMetricPolling(updatedPolling);
      } else if (type === 'reviews') {
        updatedPolling = enabled
          ? await pollingService.deactivateReviewPolling(id)
          : await pollingService.activateReviewPolling(id);
        setReviewPolling(updatedPolling);
      }
      Swal.fire({
        title: 'Success',
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} polling ${enabled ? 'disabled' : 'activated'} successfully.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
  } catch (error) {
      console.error(`Error toggling ${type} polling:`, error);
      // Aquí pots afegir una notificació d'error si tens un sistema d'alertes
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!app) return <div>App not found</div>;

  const handleExportAllMetricsToCSV = async () => {
    if (!id || metrics.length === 0) return;

    const metricService = new MetricService();
    const results = await Promise.all(
      metrics.map((m) => metricService.fetchMetricDashboard(id, m.id.toString()))
    );

    const rows: string[] = [];
    rows.push("Metric;Date;Source;Value");

    results.forEach((data) => {
      if (!data || (data.metric.value_type !== "integer" && data.metric.value_type !== "float")) return;

      data.sources.forEach((source) => {
        const grouped: Record<string, number[]> = {};

        source.history.forEach(({ date, value }) => {
          const day = new Date(date).toISOString().split("T")[0];
          const val = typeof value === "number" ? value : parseFloat(String(value));
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push(val);
        });

        Object.entries(grouped).forEach(([date, values]) => {
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          rows.push([data.metric.name, date, source.source, avg.toFixed(4)].join(";"));
        });
      });
    });

    const csvContent = rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "metrics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <Row className="min-vh-100">
      <Col md={9} className="p-4">
        <div className="p-4">
          <div className="text-center mb-4">
            <Image src={app.iconUrl} alt={`${app.name} logo`} roundedCircle width={100} height={100} />
          </div>
          <h2 className="text-center">{app.name}</h2>
          <p>{app.description || 'No description available.'}</p>
          <p><strong>App Store ID:</strong> {app.appStoreId || 'N/A'}</p>
          <p><strong>Play Store ID:</strong> {app.playStoreId || 'N/A'}</p>
          <p><strong>Developer:</strong> {app.developer || 'N/A'}</p>
          <p><strong>Release Date:</strong> {app.releaseDate || 'N/A'}</p>
          <p><strong>PEGI:</strong> {app.pegi || 'N/A'}</p>
          {app.sizeMB != null && (
            <p><strong>Size:</strong> {app.sizeMB} MB</p>
          )}
          <div>
            <strong>Available on:</strong>
            <ul>
              {app.availableOnAndroid && <li>Android</li>}
              {app.availableOnIos && <li>iOS</li>}
            </ul>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/meta-app-collector/apps/${id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDelete}
            >
              Remove
            </Button>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button
              variant="success"
              size="sm"
              onClick={handleExportAllMetricsToCSV}
            >
              Export all metrics to CSV
            </Button>
          </div>
          {(metricPolling || reviewPolling) && (
            <Card className="my-3 p-3 shadow-sm">
              <h5 className="mb-3">Polling Status</h5>
              <div className="d-flex gap-3 flex-wrap">
                {[metricPolling, reviewPolling].map((poll, idx) => poll && (
                  <Card key={poll.type} className="p-3 shadow-sm" style={{ flex: '1 1 300px' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong className="text-capitalize">
                        {poll.type === 'metrics' ? '📊 Metrics' : '📝 Reviews'}
                      </strong>
                      {poll.enabled ? (
                        <CheckCircleIcon />
                      ) : (
                        <TimesCircleIcon />
                      )}
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      <div><strong>Interval:</strong> {poll.intervalHours}h</div>
                      <div><strong>Last run:</strong> {poll.lastRun || 'N/A'}</div>
                      <div><strong>Next run:</strong> {poll.nextRun || 'N/A'}</div>
                      <div><strong>Starts at:</strong> {poll.startAt || 'N/A'}</div>
                    </div>
                    <div className="text-end mt-2">
                      <Button
                        variant={poll.enabled ? "outline-danger" : "outline-success"}
                        size="sm"
                        onClick={() => handleTogglePolling(poll.type, poll.enabled)}
                      >
                        {poll.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          )}


          <Card className="my-3 p-3 shadow-sm">
            <h5 className="mb-3">Filters</h5>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              {/* Selector de període */}
              <ButtonGroup size="sm">
                {periodOptions.map((opt) => (
                  <ToggleButton
                    key={opt.value}
                    type="radio"
                    variant="outline-primary"
                    name="global-period-selector"
                    id={`period-${opt.value}`}
                    value={opt.value}
                    checked={period === opt.value}
                    onChange={(e) => setPeriod(e.currentTarget.value as Period)}
                  >
                    {opt.label}
                  </ToggleButton>
                ))}
              </ButtonGroup>
              <div className="d-flex align-items-center gap-2">
                <label htmlFor="reference-date" className="mb-0"><strong>Reference date:</strong></label>
                <input
                  type="date"
                  id="reference-date"
                  className="form-control form-control-sm"
                  style={{ width: "150px" }}
                  value={referenceDate.toISOString().split('T')[0]}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setReferenceDate(newDate);
                  }}
                />
              </div>    
            </div>
          </Card>
        </div>
        {metrics.map((metric) => (
          <div key={metric.id} className="">
            <MetricDashboard appId={id!} metricId={metric.id.toString()} />
          </div>
        ))}
      </Col>
    </Row>
  );
};

export default AppDetail;
