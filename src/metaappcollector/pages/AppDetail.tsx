import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';
import AppService from '../services/AppService';

const AppDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<AppDetailDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const appService = new AppService();

  useEffect(() => {
    const fetchApp = async () => {
      if (id) {
        const fetchedApp = await appService.fetchAppById(id);
        setApp(fetchedApp);
      }
      setIsLoading(false);
    };

    fetchApp();
  }, [id]); // Fetch app details when the ID changes

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!app) {
    return <div>App not found</div>;
  }

  return (
    <Row style={{ height: '100vh' }}>
      <Col md={9} className="p-4">
        <div className="p-4">
          <h2>{app.name}</h2>
          <p>{app.description}</p>
          <p><strong>App Store Id:</strong> {app.appStoreId}</p>
          <p><strong>Play Store Id:</strong> {app.playStoreId}</p>
          <p><strong>Developer:</strong> {app.developer}</p>
          <p><strong>Release Date:</strong> {app.releaseDate}</p>
          <p><strong>PEGI:</strong> {app.pegi}</p>
          {app.sizeMB !== null && app.sizeMB !== undefined && (
            <p><strong>Size:</strong> {app.sizeMB} MB</p>
          )}
          <div>
            <strong>Available on:</strong>
            <ul>
              {app.availableOnAndroid && <li>Android</li>}
              {app.availableOnIos && <li>iOS</li>}
            </ul>
          </div>
          <Button variant="danger">Remove</Button>
        </div>
      </Col>
    </Row>
  );
};

export default AppDetail;
