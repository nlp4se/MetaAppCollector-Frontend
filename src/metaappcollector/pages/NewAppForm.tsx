import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const mockApps = [
  { id: '1', name: 'Discord', iconUrl: 'https://cdn.logo.com/hotlink-ok/logo-social.png' },
  { id: '2', name: 'Instagram', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png' },
];

const NewAppForm: React.FC = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    appstoreId: '',
    playstoreId: '',
  });

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('App creada:', formData);
    // Aquí puedes llamar a un servicio para guardar la app
  };

  return (
    <Row style={{ height: '100vh' }}>
      <Col md={9} className="p-4">
        <div className="p-4">
          <h2>Create New App</h2>
          <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>App Store ID</Form.Label>
              <Form.Control
                type="text"
                name="appstoreId"
                value={formData.appstoreId}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Play Store ID</Form.Label>
              <Form.Control
                type="text"
                name="playstoreId"
                value={formData.playstoreId}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" variant="primary">Create</Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
};

export default NewAppForm;
