import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

import { getUserProfile } from './actions/authActions';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';

import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ApplySeller from './screens/ApplySeller';
import UserProfile from './screens/UserProfile';
import UserScreen from './screens/UserScreen';
import SellerDashboard from './screens/SellerDashboard';
import SubscriptionScreen from './screens/SubscriptionScreen';
import SubscriptionList from './screens/SubscriptionList';
import Chatbot from './screens/Chatbot';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <Header />
        <div style={{ flex: 1 }}>

      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<HomeScreen />} />
        <Route path="/service/:id" element={<DetailScreen />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SubscriptionScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Chatbot />
            </ProtectedRoute>
          }
        />

        {/* Seller Routes */}
        <Route
          path="/apply-seller"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ApplySeller />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller-dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserScreen />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subscriptions"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <SubscriptionList />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
