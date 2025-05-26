import React, { useState } from 'react';
import { Row, Col, Form, Button, Container, Card, Toast, ToastContainer } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Footer from "../../../components/footer/Footer";
import Logo from '../../../assets/static/images/logos/logo-GESSI.jpg';
import './SignUpForm.css';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    family_name: '',
    email: '',
    password: '',
  });

  const [backend, setBackend] = useState<'metaapp' | 'reminer'>('metaapp');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    let url = '';
    let body: BodyInit;

    if (backend === 'metaapp') {
      url = 'http://127.0.0.1:8000/api/users/register/';
      body = JSON.stringify(payload);
    } else {
      // REMINER espera form-data
      url = 'http://localhost:3001/api/v1/users';
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.username);
      formDataToSend.append('family_name', formData.family_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      body = formDataToSend;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: backend === 'metaapp' ? { 'Content-Type': 'application/json' } : undefined,
        body: body,
      });

      if (response.ok) {
        localStorage.setItem('ACTIVE_BACKEND', backend);
        navigate('/login');
      } else {
        const errorData = await response.json();
        setToastMessage(errorData.message || "Sign-up failed. Please try again.");
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage("Sign-up failed. Please check your connection.");
      setShowToast(true);
    }
  };

  return (
    <>
      <Container className="mt-5 d-flex justify-content-center">
        <div className="text-center">
          <a href="https://gessi.upc.edu/en" target="_blank" rel="noopener noreferrer">
            <Image alt="GESSI logo" src={Logo} className="logo-image mb-4" />
          </a>
        </div>
      </Container>

      <Container className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
        <Card className="shadow-lg p-4 rounded" style={{ width: "450px" }}>
          <h2 className="text-center text-secondary mb-4">Sign Up</h2>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="backend" className="mb-3">
              <Form.Label className="fw-semibold">Backend</Form.Label>
              <Form.Select name="backend" value={backend} onChange={(e) => setBackend(e.target.value as 'metaapp' | 'reminer')}>
                <option value="metaapp">MetaAppCollector</option>
                <option value="reminer">REMINER</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {backend === 'reminer' && (
              <Form.Group controlId="family_name" className="mb-3">
                <Form.Label>Family Name</Form.Label>
                <Form.Control
                  type="text"
                  name="family_name"
                  value={formData.family_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            )}

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row className="mt-4">
              <Col className="text-start">
                <Button variant="secondary" onClick={() => navigate('/login')}>
                  Back
                </Button>
              </Col>
              <Col className="text-end">
                <Button variant="primary" type="submit">
                  Sign Up
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>

      <ToastContainer className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        <Toast show={showToast} bg="danger" autohide delay={3000} onClose={() => setShowToast(false)}>
          <Toast.Header>
            <strong className="me-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
};

export default SignUpForm;
