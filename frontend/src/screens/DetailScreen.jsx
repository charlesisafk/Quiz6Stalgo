import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceDetail } from '../actions/serviceActions';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';

const API_BASE_URL = 'http://localhost:8000';

const DetailScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, service } = useSelector((state) => state.services);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    dispatch(getServiceDetail(id));
  }, [dispatch, id]);

  const getImageUrl = () => {
    if (service?.sample_image) {
      if (service.sample_image.startsWith('http')) {
        return service.sample_image;
      }
      return `${API_BASE_URL}${service.sample_image}`;
    }
    return null;
  };

  const handleBuyService = async () => {
    if (!isAuthenticated) {
      setError('Please sign in to purchase a service');
      setTimeout(() => navigate('/signin'), 2000);
      return;
    }

    setPurchasing(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('access_token');
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/orders/create/`,
        {
          service: service.id,
          paypal_transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          price_paid: service.price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        'Failed to purchase service. Please try again.'
      );
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Loader />
      </Container>
    );
  }

  if (!service) {
    return (
      <Container className="py-5">
        <Message variant="danger">Service not found</Message>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={6}>
          {getImageUrl() ? (
            <img
              src={getImageUrl()}
              alt={service.service_name}
              className="img-fluid rounded"
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center rounded" style={{ height: '400px', backgroundColor: '#e9ecef' }}>
              <i className="fas fa-image" style={{ fontSize: '5rem', color: '#6c757d' }}></i>
            </div>
          )}
        </Col>
        <Col md={6}>
          <h2>{service.service_name}</h2>
          <div className="mb-3">
            <small className="text-warning"><i className="fas fa-star" style={{ color: '#f8c306' }}></i> {service.rating || 'N/A'}</small>
          </div>

          <h4 className="text-primary mb-3">${service.price}</h4>

          <div className="mb-3">
            <h5>About this service:</h5>
            <p>{service.description}</p>
          </div>

          <div className="mb-3">
            <h5>Duration:</h5>
            <p>{service.duration_of_service}</p>
          </div>

          <div className="mb-3">
            <h5>Expert:</h5>
            <p>{service.seller_email}</p>
          </div>

          {error && <Message variant="danger">{error}</Message>}

          <Button
            variant="success"
            size="lg"
            className="w-100"
            onClick={handleBuyService}
            disabled={purchasing}
          >
            {purchasing ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              'Purchase Service'
            )}
          </Button>

          <Button
            variant="outline-secondary"
            className="w-100 mt-2"
            onClick={() => navigate('/')}
            disabled={purchasing}
          >
            Back to Services
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailScreen;
