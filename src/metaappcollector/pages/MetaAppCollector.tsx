// src/pages/MetaAppDashboard.tsx

import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import AppSidebar from '../components/AppSidebar';
import AppDetails from '../components/AppDetails';
import { AppSummaryDTO } from '../DTOs/AppSummaryDTO';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';

const mockApps: AppSummaryDTO[] = [
  { id: '1', name: 'Discord', iconUrl: 'https://cdn.logo.com/hotlink-ok/logo-social.png' },
  { id: '2', name: 'Instagram', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
];

const mockDetails: Record<string, AppDetailDTO> = {
  '1': {
    id: '1',
    name: 'Discord',
    description: 'App para hablar con comunidades y jugar con amigos',
    developer: 'Discord Inc.',
    releaseDate: '2015-05-21',
    pegi: '17+',
    contentDescriptors: ['Fear', 'Language'],
    sizeMB: 214.84,
    availableOnAndroid: true,
    availableOnIos: true,
  },
  '2': {
    id: '2',
    name: 'Instagram',
    description: 'Comparte fotos y vídeos con tus amigos',
    developer: 'Meta Platforms',
    releaseDate: '2012-10-06',
    pegi: '12+',
    contentDescriptors: ['Mild Content'],
    sizeMB: 135.6,
    availableOnAndroid: true,
    availableOnIos: true,
  },
};

const MetaAppCollector: React.FC = () => {
  const [selectedAppId, setSelectedAppId] = useState<string | null>('1');

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
        {selectedAppId && <AppDetails app={mockDetails[selectedAppId]} />}
      </Col>
    </Row>
  );
};

export default MetaAppCollector;
