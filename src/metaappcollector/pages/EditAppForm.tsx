import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import AppService from '../services/AppService';
import { AppDetailDTO } from '../DTOs/AppDetailDTO';
import { useApps } from '../contexts/AppsContext';
import { ArrowLeft } from 'lucide-react';

const EditAppForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const appService = new AppService();
  const navigate = useNavigate();
  const { refreshApps } = useApps();

  const [formData, setFormData] = useState<AppDetailDTO | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchApp = async () => {
      if (id) {
        const app = await appService.fetchAppById(id);
        setFormData(app);
      }
    };
    fetchApp();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !id) return;

    const result = await appService.updateApp(id, formData);

    if (result && 'id' in result) {
      await refreshApps();
      navigate(`/meta-app-collector/apps/${result.id}`);
    } else if (result && 'errors' in result) {
      setFormErrors(result.errors);
    } else {
      setFormErrors(['Unexpected error']);
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <Row style={{ minHeight: '100%' }}>
      <Col md={9} className="p-4">
        <Button variant="link" className="mb-2 p-0 d-flex align-items-center gap-1" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </Button>
        <h2>Edit App</h2>
        {formErrors.length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {formErrors.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}
        <Form onSubmit={handleSubmit} className="mt-3">
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
              name="appStoreId"
              value={formData.appStoreId}
              onChange={handleChange}
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Play Store ID</Form.Label>
              <Form.Control
              type="text"
              name="playStoreId"
              value={formData.playStoreId}
              onChange={handleChange}
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Developer</Form.Label>
              <Form.Control
              type="text"
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Check
              type="checkbox"
              label="Available on iOS"
              name="availableOnIos"
              checked={formData.availableOnIos}
              onChange={(e) =>
                  setFormData((prev) => ({ ...prev, availableOnIos: e.target.checked } as AppDetailDTO))
              }
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Check
              type="checkbox"
              label="Available on Android"
              name="availableOnAndroid"
              checked={formData.availableOnAndroid}
              onChange={(e) =>
                  setFormData((prev) => ({ ...prev, availableOnAndroid: e.target.checked } as AppDetailDTO))
              }
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>PEGI Rating</Form.Label>
              <Form.Control
              type="text"
              name="pegi_rating"
              value={formData.pegi}
              onChange={handleChange}
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Release Date</Form.Label>
              <Form.Control
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Minimum iOS Version</Form.Label>
              <Form.Control
              type="text"
              name="minIosVersion"
              value={formData.minIosVersion}
              onChange={handleChange}
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Icon URL</Form.Label>
              <Form.Control
              type="text"
              name="iconUrl"
              value={formData.iconUrl}
              onChange={handleChange}
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Size (MB)</Form.Label>
              <Form.Control
              type="number"
              name="sizeMB"
              value={formData.sizeMB}
              onChange={handleChange}
              />
          </Form.Group>
          <Button type="submit" variant="primary" className="mb-4">Save Changes</Button>
        </Form>
      </Col>
    </Row>
  );
};

export default EditAppForm;
