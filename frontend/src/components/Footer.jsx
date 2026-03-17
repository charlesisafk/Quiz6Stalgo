import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row className="mb-4">
          <Col md={4} className="mb-4">
            <h5>About Us</h5>
            <p>Your trusted platform for professional services marketplace.</p>
          </Col>
          <Col md={4} className="mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-white-50 text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a href="/" className="text-white-50 text-decoration-none">
                  Services
                </a>
              </li>
              <li>
                <a href="/" className="text-white-50 text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4} className="mb-4">
            <h5>Contact Info</h5>
            <p className="text-white-50">Email: info@hvachub.com</p>
            <p className="text-white-50">Phone: (555) 123-4567</p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center border-top pt-4">
            <p className="text-white-50 mb-0">
              &copy; {currentYear} HVACHub - HVAC Services Marketplace. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
