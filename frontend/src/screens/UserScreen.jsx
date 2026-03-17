import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserScreen = () => {
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [merchantId, setMerchantId] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchUsers();
    fetchApplications();
  }, [user, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const { data } = await axios.get(
        'http://localhost:8000/api/v1/users/admin/users/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const { data } = await axios.get(
        'http://localhost:8000/api/v1/applications/list/',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications');
    }
  };

  const handleApproveClick = (app) => {
    setSelectedApp(app);
    setShowApproveModal(true);
  };

  const handleDeclineClick = (app) => {
    setSelectedApp(app);
    setShowDeclineModal(true);
  };

  const handleApproveSubmit = async () => {
    if (!merchantId) {
      return; // Silently fail - form validation shows error
    }
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `http://localhost:8000/api/v1/applications/${selectedApp.id}/approve/`,
        { merchant_id: merchantId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowApproveModal(false);
      setMerchantId('');
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeclineSubmit = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(
        `http://localhost:8000/api/v1/applications/${selectedApp.id}/decline/`,
        { decline_reason: declineReason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowDeclineModal(false);
      setDeclineReason('');
      fetchApplications();
    } catch (err) {
      console.error(err);
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
      <h2 className="mb-4">Admin Dashboard</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <div className="mb-4">
        <Button
          variant={activeTab === 'users' ? 'primary' : 'outline-primary'}
          className="me-2"
          onClick={() => setActiveTab('users')}
        >
          Users
        </Button>
        <Button
          variant={activeTab === 'applications' ? 'primary' : 'outline-primary'}
          onClick={() => setActiveTab('applications')}
        >
          Seller Applications
        </Button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h3 className="mb-3">All Users</h3>
          {users.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.first_name}</td>
                    <td>{u.last_name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge bg-info">{u.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No users found</Alert>
          )}
        </div>
      )}

      {activeTab === 'applications' && (
        <div>
          <h3 className="mb-3">Seller Applications</h3>
          {applications.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.user_username}</td>
                    <td>{app.user_email}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          app.status === 'approved'
                            ? 'success'
                            : app.status === 'declined'
                            ? 'danger'
                            : 'warning'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>
                      {app.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="success"
                            className="me-2"
                            onClick={() => handleApproveClick(app)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeclineClick(app)}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <Alert variant="info">No applications found</Alert>
          )}
        </div>
      )}

      {/* Approve Modal */}
      <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Merchant ID</Form.Label>
            <Form.Control
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              placeholder="Enter merchant ID"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleApproveSubmit}>
            Approve
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Decline Modal */}
      <Modal show={showDeclineModal} onHide={() => setShowDeclineModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Decline Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Reason for Declining</Form.Label>
            <Form.Control
              as="textarea"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Enter reason"
              rows={4}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeclineModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeclineSubmit}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserScreen;
