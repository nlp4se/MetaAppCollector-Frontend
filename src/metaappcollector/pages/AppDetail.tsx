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

const AppDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<AppDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const appService = new AppService();
  const metricService = new MetricService();
  const { removeAppFromList } = useApps();
  const [metrics, setMetrics] = useState<MetricSummaryDTO[]>([]);
  const { period, setPeriod, referenceDate, setReferenceDate } = useMetricPeriod();
  const periodOptions = [
  { value: '7d', label: 'Week' },
  { value: '30d', label: 'Month' },
  { value: 'all', label: 'All' },
  ];

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

    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    const confirmed = window.confirm(`Are you sure you want to delete "${app?.name}"?`);
    if (!confirmed) return;

    const success = await appService.deleteApp(id);

    if (success) {
      console.log("Eliminando app con ID:", id);
      removeAppFromList(id);
      navigate('/meta-app-collector');
    } else {
      alert('Error deleting the app.');
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
