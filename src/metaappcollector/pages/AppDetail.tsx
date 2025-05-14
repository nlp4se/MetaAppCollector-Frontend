import React from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';

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

const AppDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const app = mockDetails[id || ''];

  if (!app) {
    return <div>App not found</div>;
  }

  return (
    <Row style={{ height: '100vh' }}>
      <Col md={9} className="p-4">
        <div className="p-4">
          <h2>{app.name}</h2>
          <p>{app.description}</p>
          <p><strong>Developer:</strong> {app.developer}</p>
          <p><strong>Release Date:</strong> {app.releaseDate}</p>
          <p><strong>PEGI:</strong> {app.pegi}</p>
          <p><strong>Content Descriptors:</strong> {app.contentDescriptors.join(', ')}</p>
          <p><strong>Size:</strong> {app.sizeMB} MB</p>
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
