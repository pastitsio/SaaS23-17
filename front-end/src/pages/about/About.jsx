import React from 'react';
import { Col, Container, Figure, Row } from 'react-bootstrap';

import './about.css';

const About = () => {
  return (
    <>
      <Container className="header-container">
        <Row >
          <Col><h2>About Us</h2></Col>
        </Row>
      </Container>
      <Container className="header-container mt-0">
        <Row className='mt-3'>
          <Col className='d-flex justify-content-center'><Figure>
            <Figure.Image className="rounded-circle" src="https://avatars.githubusercontent.com/u/93122062?v=4" width='150' alt="Person 2" />
            <Figure.Caption className='text-center'>Yannis Mitis<br />ntua-el<b>13133</b></Figure.Caption>
          </Figure></Col>
          <Col className='d-flex justify-content-center'><Figure>
            <Figure.Image className="rounded-circle" src="https://avatars.githubusercontent.com/u/115161491?v=4" width='150' alt="Person 1" />
            <Figure.Caption className='text-center'>Dimitris Charalampis<br />ntua-el<b>18406</b></Figure.Caption>
          </Figure></Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <p>{" "}</p>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col>
            <p>Check out our <a href="https://github.com/ntua/SaaS23-17" target="_blank" rel="noopener noreferrer">GitHub repository</a> for more information.</p>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default About
