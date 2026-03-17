import React from 'react';
import { Container } from 'react-bootstrap';

export default function FormContainer({ children }) {
  return (
    <Container className="mx-auto p-4" style={{ maxWidth: '500px' }}>
      <div className="bg-white rounded p-5 shadow-sm">{children}</div>
    </Container>
  );
}
