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
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);

            const response = await fetch('http://localhost:3001/api/v1/login', {
                method: 'POST',
                body: formDataToSend
            });

            if (response.ok) {
                const responseBody = await response.json();
                localStorage.setItem('USER_ID', responseBody.user_data.id);
                localStorage.setItem('ACCESS_TOKEN', responseBody.access_token);
                localStorage.setItem('REFRESH_TOKEN', responseBody.refresh_token);
                navigate('/dashboard');
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

            {/* Form Section (Fixed Layout to Match SignUpForm) */}
            <Container className="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                <Card className="shadow-lg p-4 rounded" style={{ width: "450px" }}>
                    <h2 className="text-center text-secondary mb-4">Login to RE-Miner 2.0</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label className="fw-semibold">Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                style={{ padding: '10px', fontSize: '1rem' }}
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
                                style={{ padding: '10px', fontSize: '1rem' }}
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

            {/* Toast Notification (Same as SignUpForm) */}
            <ToastContainer className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                <Toast show={showToast} bg="danger" autohide delay={3000} onClose={() => setShowToast(false)}>
                    <Toast.Header>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Footer (Now Matches SignUpForm) */}
            <div className="mt-5">
                <Footer />
            </div>
        </div>
    );
};

export default LoginForm;
