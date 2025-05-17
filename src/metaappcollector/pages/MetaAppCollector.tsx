import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';

const MetaAppCollector: React.FC = () => {
  return (
    <Row style={{ height: '100vh' }}>
      <Col md={3}>
        <AppSidebar />
      </Col>
      <Col md={9} className="p-4">
        <Outlet />
      </Col>
    </Row>
  );
};

export default MetaAppCollector;
