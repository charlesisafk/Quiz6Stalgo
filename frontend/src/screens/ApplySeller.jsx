import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplySeller = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please sign in first');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(
        'http://localhost:8000/api/v1/applications/apply/',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Application submitted! Awaiting admin approval.');
      setTimeout(() => navigate('/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <div className="p-4 border rounded">
            <h2 className="mb-4">Apply as Seller</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleApply}>
              <p className="text-muted mb-4">
                By applying as a seller, you will be able to create and manage services on our platform.
              </p>

              <div className="alert alert-info">
                <strong>Requirements:</strong>
                <ul className="mb-0">
                  <li>Complete user profile</li>
                  <li>Valid contact information</li>
                  <li>Admin approval required</li>
                </ul>
              </div>

              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplySeller;
