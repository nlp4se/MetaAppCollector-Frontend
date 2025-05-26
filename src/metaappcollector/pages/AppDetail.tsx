import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';
import AppService from '../services/AppService';
import MetricService from '../services/MetricService';
import { useApps } from '../contexts/AppsContext';
import { MetricSummaryDTO } from '../DTOs/MetricSummaryDTO';
import MetricDashboard from '../components/MetricDashboard';

const AppDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<AppDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const appService = new AppService();
  const metricService = new MetricService();
  const { removeAppFromList } = useApps();
  const [metrics, setMetrics] = useState<MetricSummaryDTO[]>([]);

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
        </div>
        {metrics.map((metric) => (
          <div key={metric.id} className="my-5">
            <h4>{metric.name}</h4>
            <MetricDashboard appId={id!} metricId={metric.id.toString()} />
          </div>
        ))}
      </Col>
    </Row>
  );
};

export default AppDetail;
