import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../actions/authActions';
import Message from '../components/Message';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    dispatch(getUserProfile()).then(() => setProfileLoaded(true));
  }, [isAuthenticated, dispatch, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const messageText = inputValue.trim();
    setInputValue('');
    setError('');
    setSending(true);
    if (!user?.subscription) {
      setError('No subscription found');
      setSending(false);
      return;
    }

    if (!user.subscription.is_active) {
      setError('Your subscription is not active');
      setSending(false);
      return;
    }

    if (user.subscription.usage_left <= 0) {
      setError('No usage left. Please upgrade your subscription.');
      setSending(false);
      return;
    }
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'user',
        text: messageText,
        timestamp: new Date(),
      },
    ]);
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';
      const response = await fetch(`${apiUrl}/chat/ask/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'bot',
          text: data.response,
          timestamp: new Date(),
        },
      ]);
      dispatch(getUserProfile());
    } catch (err) {
      setError(err.message || 'Failed to send message');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="py-5">
        <Message variant="danger">Please sign in to use the chatbot</Message>
      </Container>
    );
  }

  if (!user?.subscription) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Loading chatbot...</p>
        {profileLoaded && (
          <p className="text-danger mt-3">
            No subscription found. Please refresh the page or <a href="/subscriptions">purchase a subscription</a>.
          </p>
        )}
      </Container>
    );
  }

  if (!user.subscription.is_active) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h5>Subscription Inactive</h5>
          <p>Your subscription is not active. Please renew it to use the chatbot.</p>
          <Button variant="primary" onClick={() => navigate('/subscriptions')}>
            Go to Subscriptions
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
      <Row className="mb-4">
        <Col>
          <h2>HVAC AI Chatbot</h2>
          <div className="d-flex justify-content-between align-items-center">
            <p className="text-muted mb-0">Get instant answers about HVAC services</p>
            <Card className="bg-light p-2" style={{ minWidth: '200px' }}>
              <div className="text-center">
                <strong>Usage Left:</strong>
                <div className="fs-5">
                  {user.subscription.usage_left}/{user.subscription.tier?.max_usage || '?'}
                </div>
                <small className="text-muted">
                  {user.subscription.tier?.name || 'Current'} Plan
                </small>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      {user.subscription.usage_left === 0 && (
        <Alert variant="danger" dismissible>
          <h5>No Usage Left</h5>
          <p>You have exhausted your chat usage. Please upgrade your subscription.</p>
          <Button variant="primary" size="sm" onClick={() => navigate('/subscriptions')}>
            Upgrade Plan
          </Button>
        </Alert>
      )}

      {error && <Message variant="danger">{error}</Message>}

      {/* Chat Messages Area */}
      <Card className="flex-grow-1 mb-3 p-3" style={{ overflowY: 'auto', minHeight: '400px', backgroundColor: '#f8f9fa' }}>
        {messages.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>Start a conversation! Ask about HVAC services, maintenance, repairs, and more.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 d-flex ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`p-3 rounded ${
                  msg.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white border border-light'
                }`}
                style={{
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                }}
              >
                <p className="mb-1">{msg.text}</p>
                <small className={msg.type === 'user' ? 'text-light' : 'text-muted'}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </small>
              </div>
            </div>
          ))
        )}

        {sending && (
          <div className="d-flex align-items-center text-muted">
            <Spinner animation="border" size="sm" className="me-2" />
            AI is thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </Card>

      {/* Input Area */}
      <Form onSubmit={handleSendMessage}>
        <Row className="g-2">
          <Col>
            <Form.Control
              type="text"
              placeholder="Ask about HVAC services..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={sending || user.subscription.usage_left === 0}
              className="rounded-pill"
            />
          </Col>
          <Col xs="auto">
            <Button
              variant="primary"
              type="submit"
              className="rounded-pill"
              disabled={sending || !inputValue.trim() || user.subscription.usage_left === 0}
            >
              {sending ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default Chatbot;
