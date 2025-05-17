import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AppService from '../services/AppService';
import { AppCreateDTO } from '../DTOs/AppCreateDTO';

const NewAppForm: React.FC = () => {
  const appService = new AppService();
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState<AppCreateDTO>({
    code: '',
    name: '',
    description: '',
    appstoreId: '',
    playstoreId: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando formulario...');

    const result = await appService.createApp(formData);

    if (result === null) {
      setFormErrors(['Error inesperado al conectar con el servidor.']);
      return;
    }

    if ('id' in result) {
      navigate(`/meta-app-collector/apps/${result.id}`);
    } else if ('errors' in result) {
      setFormErrors(result.errors);
    }
  };

  return (
    <Row style={{ height: '100vh' }}>
      <Col md={9} className="p-4">
        <div className="p-4">
          <h2>Create New App</h2>
          {formErrors.length > 0 && (
            <div className="alert alert-danger">
              <ul className="mb-0">
                {formErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
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
