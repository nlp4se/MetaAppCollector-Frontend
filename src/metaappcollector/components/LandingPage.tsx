import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { LineChart } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <Row className="min-vh-100">
      <Col md={9} className="p-4">
        <div className="p-4">
          <div className="mb-4 text-primary">
            <LineChart size={40} strokeWidth={2} />
          </div>

          <h1 className="fw-bold display-5 mb-3">Welcome to MetaAppCollector</h1>

          <p className="lead mb-3">
            Centralize, visualize, and analyze the performance of your mobile applications
            using data collected from Google Play, App Store, Reddit...
          </p>

          <p className="text-muted mb-4">
            This platform helps you better understand your digital visibility, identify trends,
            and make strategic decisions based on reliable and up-to-date data.
          </p>

          <div className="border-top pt-3 text-muted small">
            Use the menu on the left to explore your applications and create new ones.
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default LandingPage;
