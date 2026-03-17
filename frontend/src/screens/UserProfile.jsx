import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Table, Card, Spinner, Alert } from 'react-bootstrap';
import { getUserProfile } from '../actions/authActions';
import axios from 'axios';
import Loader from '../components/Loader';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    dispatch(getUserProfile());
    fetchOrders();
  }, [dispatch]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const { data } = await axios.get(
        'http://localhost:8000/api/v1/orders/history/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Loader />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">My Profile</h2>

      {user && (
        <Row className="mb-5">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title>Personal Information</Card.Title>
                <div className="mb-3">
                  <strong>Name:</strong> {user.first_name} {user.last_name}
                </div>
                <div className="mb-3">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="mb-3">
                  <strong>Phone:</strong> {user.phone_number || 'N/A'}
                </div>
                <div className="mb-3">
                  <strong>Location:</strong> {user.location || 'N/A'}
                </div>
                <div className="mb-3">
                  <strong>Role:</strong>{' '}
                  <span className="badge bg-info">{user.role}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <h3 className="mb-4">Order History</h3>
      {ordersLoading ? (
        <Spinner animation="border" />
      ) : orders.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Service</th>
              <th>Price Paid</th>
              <th>Date Purchased</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.service_name}</td>
                <td>${order.price_paid}</td>
                <td>{new Date(order.date_purchased).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No orders yet</Alert>
      )}
    </Container>
  );
};

export default UserProfile;
