import React, { useState } from 'react';
import { Row, Col, Form, Button, Container, Card, Toast, ToastContainer } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Footer from "../../../components/footer/Footer";
import Logo from '../../../assets/static/images/logos/logo-GESSI.jpg';
import './SignUpForm.css';
import { useNavigate } from 'react-router-dom';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    family_name: '',
    email: '',
    password: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('family_name', formData.family_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);

      const response = await fetch('http://localhost:3001/api/v1/users', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        navigate('/login');
      } else {
        // Extract JSON response body
        const errorData = await response.json();

        // Show error message if available
        if (errorData.message) {
          setToastMessage(errorData.message);
        } else {
          setToastMessage(`Sign-up failed: ${response.statusText}`);
        }

        setShowToast(true);
      }
    } catch (error) {
      setToastMessage(`Sign-up failed: ${error}`);
      setShowToast(true);
      console.error('Sign-up failed:', error);
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

        <Container className="d-flex justify-content-center">
          <Card className="shadow-lg p-4 rounded" style={{ width: "450px" }}>
            <h2 className="text-center text-secondary mb-4">Sign Up in RE-Miner 2.0</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
              </Form.Group>

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

        {/* Toast Notification - Fixed to Top Right */}
        <ToastContainer
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: 1050 }}
        >
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
