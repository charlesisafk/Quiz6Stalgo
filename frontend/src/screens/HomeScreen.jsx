import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';
import { listServices } from '../actions/serviceActions';
import Service from '../components/Service';
import Loader from '../components/Loader';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { loading, services } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(listServices());
  }, [dispatch]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Loader />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-5">Available Services</h2>
      <Row>
        {services && services.length > 0 ? (
          services.map((service) => (
            <Col md={4} className="mb-4" key={service.id}>
              <Service service={service} />
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <p>No services available</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default HomeScreen;
