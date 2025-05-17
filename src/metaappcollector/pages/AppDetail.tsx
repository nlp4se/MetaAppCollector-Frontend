import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';
import AppService from '../services/AppService';
import { useApps } from '../contexts/AppsContext';

const AppDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<AppDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const appService = new AppService();
  const { removeAppFromList } = useApps();

  useEffect(() => {
    const fetchApp = async () => {
      if (id) {
        const fetchedApp = await appService.fetchAppById(id);
        setApp(fetchedApp);
      }
      setIsLoading(false);
    };

    fetchApp();
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
    <Row style={{ height: '100vh' }}>
      <Col md={9} className="p-4">
        <div className="p-4">
          <h2>{app.name}</h2>
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
          <Button variant="danger" onClick={handleDelete}>Remove</Button>
        </div>
      </Col>
    </Row>
  );
};

export default AppDetail;
