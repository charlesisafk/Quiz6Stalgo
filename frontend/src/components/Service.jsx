import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Rating from './Rating';

const API_BASE_URL = 'http://localhost:8000';

export default function Service({ service }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/service/${service.id}`);
  };

  const getImageUrl = () => {
    if (service.sample_image) {
      if (service.sample_image.startsWith('http')) {
        return service.sample_image;
      }
      return `${API_BASE_URL}${service.sample_image}`;
    }
    return null;
  };

  return (
    <Card className="h-100 shadow-sm">
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
        {getImageUrl() ? (
          <Card.Img
            variant="top"
            src={getImageUrl()}
            alt={service.service_name}
            style={{ height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="d-flex align-items-center justify-content-center" style={{ height: '100%', backgroundColor: '#e9ecef' }}>
            <i className="fas fa-image" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
          </div>
        )}
        {service.status && (
          <Badge
            bg={service.status === 'active' ? 'success' : 'warning'}
            className="position-absolute"
            style={{ top: '10px', right: '10px' }}
          >
            {service.status}
          </Badge>
        )}
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title style={{ fontSize: '1.1rem', fontWeight: '600' }}>
          {service.service_name}
        </Card.Title>
        <Card.Text className="flex-grow-1 text-muted" style={{ fontSize: '0.9rem' }}>
          {service.description?.substring(0, 100)}
          {service.description?.length > 100 ? '...' : ''}
        </Card.Text>
        <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.85rem' }}>
          <Rating value={service.rating || 0} text={`(${service.reviews || 0})`} />
          <span className="text-muted">
            <i className="fas fa-clock me-1" />
            {service.duration_of_service}
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span style={{ fontSize: '1.3rem', fontWeight: '700', color: '#28a745' }}>
            ${service.price}
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
