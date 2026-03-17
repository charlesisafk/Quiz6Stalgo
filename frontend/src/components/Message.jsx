import React from 'react';
import { Alert } from 'react-bootstrap';

export default function Message({ variant = 'info', children }) {
  return (
    <Alert variant={variant} className="my-3">
      {children}
    </Alert>
  );
}
