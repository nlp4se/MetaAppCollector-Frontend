import React, { useState } from 'react';
import { Row, Col, Form, Button, Container, Card, Toast, ToastContainer } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import Footer from "../../../components/footer/Footer";
import Logo from '../../../assets/static/images/logos/logo-GESSI.jpg';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [backend, setBackend] = useState<'metaapp' | 'reminer'>('reminer');

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const payload = {
                username: formData.email, // o email, segons backend
                password: formData.password,
            };

            let loginUrl = '';
            if (backend === 'reminer') {
                loginUrl = 'http://localhost:3001/api/v1/login'; // REMINER endpoint
            } else {
                loginUrl = 'http://127.0.0.1:8000/api/users/token/'; // METAAPP JWT endpoint
            }

            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const responseBody = await response.json();
                localStorage.setItem('ACTIVE_BACKEND', backend);

                if (backend === 'reminer') {
                    localStorage.setItem('REMINER_ACCESS_TOKEN', responseBody.access_token);
                    localStorage.setItem('REMINER_REFRESH_TOKEN', responseBody.refresh_token);
                    localStorage.setItem('USER_ID', responseBody.user_data.id);
                    navigate('/dashboard');
                } else {
                    localStorage.setItem('METAAPP_ACCESS_TOKEN', responseBody.access);
                    localStorage.setItem('METAAPP_REFRESH_TOKEN', responseBody.refresh);
                    navigate('/meta-app-collector');
                }
            } else {
                const errorData = await response.json();
                setToastMessage(errorData.message || "Login failed. Please try again.");
                setShowToast(true);
            }
        } catch (error) {
            setToastMessage("Login failed. Please check your connection.");
            setShowToast(true);
        }
    };

    return (
        <div className="d-flex flex-column vh-100">
            <Container className="mt-5 d-flex justify-content-center">
                <div className="text-center">
                    <a href="https://gessi.upc.edu/en" target="_blank" rel="noopener noreferrer">
                        <Image alt="GESSI logo" src={Logo} className="logo-image mb-4" />
                    </a>
                </div>
            </Container>

            <Container className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                <Card className="shadow-lg p-4 rounded" style={{ width: "450px" }}>
                    <h2 className="text-center text-secondary mb-4">Login</h2>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="backend" className="mb-3">
                            <Form.Label className="fw-semibold">Backend</Form.Label>
                            <Form.Select name="backend" value={backend} onChange={(e) => setBackend(e.target.value as 'metaapp' | 'reminer')}>
                                <option value="reminer">REMINER</option>
                                <option value="metaapp">MetaAppCollector</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label className="fw-semibold">Email / Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email or username"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label className="fw-semibold">Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                required
                            />
                        </Form.Group>

                        <Row className="mt-4 text-center">
                            <Col>
                                <Button variant="secondary" className="w-100 fw-bold" onClick={() => navigate('/sign-up')}>
                                    Sign Up
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="primary" type="submit" className="w-100 fw-bold">
                                    Login
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
        </div>
    );
};

export default LoginForm;
