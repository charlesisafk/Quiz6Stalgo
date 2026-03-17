import React, { useState, useEffect } from 'react';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchSubscriptions();
  }, [user, navigate]);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const { data } = await axios.get(
        'http://localhost:8000/api/v1/subscriptions/list/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSubscriptions(data);
    } catch (err) {
      console.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Subscription Transactions</h2>

      {subscriptions.length > 0 ? (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>User</th>
              <th>Tier</th>
              <th>Subscription Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.user_email}</td>
                <td>{sub.tier_name}</td>
                <td>
                  {new Date(sub.subscribed_at).toLocaleDateString()}
                </td>
                <td>
                  <span className={`badge bg-${sub.is_active ? 'success' : 'danger'}`}>
                    {sub.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No subscriptions found</Alert>
      )}
    </Container>
  );
};

export default SubscriptionList;
