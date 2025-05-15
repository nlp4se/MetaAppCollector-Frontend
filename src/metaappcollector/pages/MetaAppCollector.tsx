// src/pages/MetaAppDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import AppSidebar from '../components/AppSidebar';
import { Outlet } from 'react-router-dom';
import { AppSummaryDTO } from '../DTOs/AppSummaryDTO';
import AppService from '../services/AppService';

const MetaAppCollector: React.FC = () => {
  const [apps, setApps] = useState<AppSummaryDTO[]>([]); // State to store apps
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const appService = new AppService();

  useEffect(() => {
    const fetchApps = async () => {
      const fetchedApps = await appService.fetchApps();
      setApps(fetchedApps);
    };

    fetchApps();
  }, []); // Fetch apps on component mount

  return (
    <Row style={{ height: '100vh' }}>
      <Col md={3}>
        <AppSidebar
          apps={apps} // Pass fetched apps to AppSidebar
          selectedAppId={selectedAppId}
          onSelectApp={setSelectedAppId}
        />
      </Col>
      <Col md={9} className="p-4">
        <Outlet /> {/* Aquí se renderizan las rutas secundarias */}
      </Col>
    </Row>
  );
};

export default MetaAppCollector;
