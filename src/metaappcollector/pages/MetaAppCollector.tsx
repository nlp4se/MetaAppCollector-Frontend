import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/AppSidebar';

const MetaAppCollector: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Row className="flex-grow-1" style={{ minHeight: '100%' }}>

        <Col md={3} className="pt-0">
          <AppSidebar />
        </Col>
        <Col md={9} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </div>
  );
};

export default MetaAppCollector;
