import { Row, Col } from 'react-bootstrap';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const linkStyle = {
        textDecoration: 'none'
    };

    return (
        <footer className="footer mt-5 w-100 py-3 bg-light text-center">
            <div className="container-fluid">
                <Row className="justify-content-center">
                    <Col xs={12} md={6} className="text-secondary">
                        {currentYear} © <a style={linkStyle} className="text-secondary" href="https://gessi.upc.edu/en" target="_blank" rel="noopener noreferrer">GESSI</a>
                    </Col>
                </Row>
            </div>
        </footer>
    );
};

export default Footer;
