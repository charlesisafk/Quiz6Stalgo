import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch({ type: 'USER_LOGOUT' });
    navigate('/signin');
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top" className="header-navbar">
      <Container>
        <Navbar.Brand
          onClick={() => navigate('/')}
          className="fw-bold"
          style={{ cursor: 'pointer', fontSize: '1.3rem' }}
        >
          <i className="fas fa-snowflake me-2" />
          HVACHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate('/')} className="nav-link-item">
              Home
            </Nav.Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'user' && (
                  <>
                    <Nav.Link onClick={() => navigate('/subscriptions')} className="ps-3">
                      Subscriptions
                    </Nav.Link>
                    <Nav.Link onClick={() => navigate('/chatbot')} className="ps-3">
                      Chatbot
                    </Nav.Link>
                    {user?.role !== 'seller' && (
                      <Nav.Link onClick={() => navigate('/apply-seller')} className="ps-3">
                        Become Seller
                      </Nav.Link>
                    )}
                  </>
                )}

                {user?.role === 'seller' && (
                  <>
                    <Nav.Link onClick={() => navigate('/seller-dashboard')} className="ps-3">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link onClick={() => navigate('/subscriptions')} className="ps-3">
                      Subscriptions
                    </Nav.Link>
                  </>
                )}

                {user?.role === 'admin' && (
                  <>
                    <Nav.Link onClick={() => navigate('/admin/users')} className="ps-3">
                      Users
                    </Nav.Link>
                    <Nav.Link onClick={() => navigate('/admin/subscriptions')} className="ps-3">
                      Subscriptions
                    </Nav.Link>
                  </>
                )}

                <Nav.Link onClick={() => navigate('/profile')} className="ps-3">
                  <i className="fas fa-user me-1" /> Profile
                </Nav.Link>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate('/signin')} className="ps-3">
                  Sign In
                </Nav.Link>
                <Nav.Link onClick={() => navigate('/signup')} className="ps-3">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
