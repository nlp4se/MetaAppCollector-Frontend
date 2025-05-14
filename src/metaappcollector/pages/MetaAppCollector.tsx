// src/pages/MetaAppDashboard.tsx

import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import AppSidebar from '../components/AppSidebar';
import { Outlet } from 'react-router-dom';
import { AppSummaryDTO } from '../DTOs/AppSummaryDTO';

const mockApps: AppSummaryDTO[] = [
  { id: '1', name: 'Discord', iconUrl: 'https://cdn.logo.com/hotlink-ok/logo-social.png' },
  { id: '2', name: 'Instagram', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
];

const MetaAppCollector: React.FC = () => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  return (
    <Row style={{ height: '100vh' }}>
      <Col md={3}>
        <AppSidebar
          apps={mockApps}
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
