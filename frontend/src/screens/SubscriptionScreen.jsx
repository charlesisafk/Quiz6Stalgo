import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { listSubscriptions } from '../actions/subscriptionActions';

const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const SubscriptionScreen = () => {
  const dispatch = useDispatch();
  const { loading, tiers } = useSelector((state) => state.subscriptions);
  const { user } = useSelector((state) => state.auth);
  const paypalScriptLoaded = useRef(false);
  const renderTimeoutRef = useRef(null);
  const currentTierId = user?.subscription?.tier?.id || null;

  useEffect(() => {
    if (paypalScriptLoaded.current || window.paypal) {
      return; // Script already loaded
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
    script.async = true;
    script.onload = () => {
      paypalScriptLoaded.current = true;
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
    };
    document.body.appendChild(script);

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    dispatch(listSubscriptions());
  }, [dispatch]);

  useEffect(() => {
    if (!window.paypal || !tiers || tiers.length === 0) return;
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    renderTimeoutRef.current = setTimeout(() => {
      renderPayPalButtons();
    }, 100);

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [tiers]);

  const renderPayPalButtons = () => {
    if (!window.paypal || !tiers || tiers.length === 0) return;

    tiers.forEach((tier) => {
      const containerId = `paypal-button-container-${tier.id}`;
      const container = document.getElementById(containerId);
      
      if (!container) return;
      if (!document.body.contains(container)) {
        console.warn(`Container ${containerId} not in DOM`);
        return;
      }
      container.innerHTML = '';
      try {
        const buttons = window.paypal.Buttons({
          style: {
            shape: 'pill',
            color: 'blue',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data, actions) {
            return actions.subscription.create({
              plan_id: tier.paypal_plan_id,
              quantity: 1
            });
          },
          onApprove: async function(data, actions) {
            try {
              const token = localStorage.getItem('access_token');
              const response = await fetch('http://localhost:8000/api/v1/subscriptions/subscribe/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                  tier_id: tier.id,
                  paypal_subscription_id: data.subscriptionID
                })
              });
              
              if (response.ok) {
                window.location.href = '/subscriptions';
              }
            } catch (err) {
              console.error('Error saving subscription:', err);
            }
          },
          onError: function(err) {
            console.error('PayPal error:', err);
          }
        });
        
        buttons.render(`#${containerId}`).catch(err => {
          console.error('PayPal render error:', err, 'for container:', containerId);
        });
      } catch (err) {
        console.error('Error creating PayPal button:', err);
      }
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!PAYPAL_CLIENT_ID) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Configuration Error</h4>
          <p>PayPal Client ID is not configured. Please add REACT_APP_PAYPAL_CLIENT_ID to your .env file and restart the development server.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-2 text-center">Choose Your Subscription</h2>
      <p className="text-center text-muted mb-5">
        Get unlimited access to our AI chatbot with different usage tiers
      </p>

      <Row>
        {tiers && tiers.length > 0 ? (
          tiers.map((tier) => {
            const isCurrentTier = currentTierId === tier.id;
            return (
              <Col md={4} className="mb-4" key={tier.id}>
                <Card className={`h-100 shadow-sm ${isCurrentTier ? 'border-success border-3' : 'border-primary'}`}>
                  {isCurrentTier && (
                    <div className="bg-success text-white p-2 text-center">
                      <strong>✓ Current Plan</strong>
                    </div>
                  )}
                  <Card.Body className="text-center">
                    <Card.Title className="fs-4">{tier.name}</Card.Title>
                    <div className="mb-3">
                      <h2 className="text-primary">${tier.price}</h2>
                      <p className="text-muted">per month</p>
                    </div>

                    <div className="mb-4">
                      <p className="fs-5">
                        <strong>{tier.max_usage}</strong> chat messages
                      </p>
                      <small className="text-muted">
                        per month
                      </small>
                    </div>

                    <ul className="list-unstyled mb-4">
                      <li className="mb-2">✓ Access to AI Chatbot</li>
                      <li className="mb-2">✓ Priority Support</li>
                      <li className="mb-2">✓ Service Bookings</li>
                    </ul>

                    <div id={`paypal-button-container-${tier.id}`} />
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col className="text-center py-5">
            <p>No subscriptions available</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default SubscriptionScreen;
