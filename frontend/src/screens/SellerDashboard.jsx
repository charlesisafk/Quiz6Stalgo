import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Alert, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    service_name: '',
    description: '',
    price: '',
    duration_of_service: '',
    sample_image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'seller') {
      navigate('/');
      return;
    }
    fetchServices();
  }, [user, navigate]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const { data } = await axios.get(
        'http://localhost:8000/api/v1/services/manage/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setServices(data);
    } catch (err) {
      console.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, sample_image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    const data = new FormData();
    data.append('service_name', formData.service_name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('duration_of_service', formData.duration_of_service);
    if (formData.sample_image) {
      data.append('sample_image', formData.sample_image);
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/v1/services/manage/${editingId}/`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post('http://localhost:8000/api/v1/services/manage/', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchServices();
      setShowForm(false);
      setError('');
      setFormData({
        service_name: '',
        description: '',
        price: '',
        duration_of_service: '',
        sample_image: null,
      });
      setEditingId(null);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to save service';
      setError(errorMsg);
      console.error('Error saving service:', err);
    }
  };

  const handleEdit = (service) => {
    setFormData({
      service_name: service.service_name,
      description: service.description,
      price: service.price,
      duration_of_service: service.duration_of_service,
      sample_image: null,
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`http://localhost:8000/api/v1/services/manage/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Seller Dashboard</h2>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <div className="mb-4">
        <Button
          variant="primary"
          onClick={() => {
            setShowForm(!showForm);
            setError('');
            setEditingId(null);
            setFormData({
              service_name: '',
              description: '',
              price: '',
              duration_of_service: '',
              sample_image: null,
            });
          }}
        >
          {showForm ? 'Cancel' : 'Add New Service'}
        </Button>
      </div>

      {showForm && (
        <div className="p-4 border rounded mb-4">
          <h4>{editingId ? 'Edit Service' : 'Add New Service'}</h4>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Service Name</Form.Label>
              <Form.Control
                type="text"
                name="service_name"
                value={formData.service_name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration</Form.Label>
                  <Form.Control
                    type="text"
                    name="duration_of_service"
                    value={formData.duration_of_service}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 hours"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Service Image</Form.Label>
              <Form.Control
                type="file"
                name="sample_image"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Button variant="success" type="submit">
              {editingId ? 'Update Service' : 'Add Service'}
            </Button>
          </Form>
        </div>
      )}

      <h3 className="mb-3">Your Services</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : services.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.service_name}</td>
                <td>${service.price}</td>
                <td>{service.duration_of_service}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No services yet. Create your first service!</Alert>
      )}
    </Container>
  );
};

export default SellerDashboard;
